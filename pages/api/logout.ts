import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const response = await fetch(`${process.env.BACKEND_API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Cookie': req.headers.cookie || '',
      },
    });

    const data = await response.json();

    if (response.ok) {
      // Clear the cookie
      res.setHeader('Set-Cookie', 'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax');
    }

    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}