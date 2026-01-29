import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const response = await fetch(`${process.env.BACKEND_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (response.ok) {
      // If the backend returns the token in the body (common pattern: { access_token: "..." })
      // receive it and set it as an HttpOnly cookie
      const token = data.access_token;

      if (token) {
        // Set HttpOnly cookie
        // Max-age: 7 days (60 * 60 * 24 * 7)
        res.setHeader('Set-Cookie', `access_token=${token}; Path=/; Max-Age=604800; HttpOnly; SameSite=Lax`);
      } else {
        // Fallback: If backend sets cookie, we forward it (already in original code, but kept for safety)
        const cookies = response.headers.get('set-cookie');
        if (cookies) {
          res.setHeader('Set-Cookie', cookies);
        }
      }
    }

    res.status(response.status).json(data);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}