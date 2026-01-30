import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { q, type = 'all', limit = 20, page = 1 } = req.query;

    if (!q) {
        return res.status(400).json({ message: 'Search query "q" is required' });
    }

    try {
        const backendUrl = new URL(`${process.env.BACKEND_API_URL}/search`);
        backendUrl.searchParams.append('q', q as string);
        backendUrl.searchParams.append('type', type as string);
        backendUrl.searchParams.append('limit', limit as string);
        backendUrl.searchParams.append('page', page as string);

        const response = await fetch(backendUrl.toString());

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error searching:', error);
        res.status(500).json({ error: 'Failed to perform search' });
    }
}
