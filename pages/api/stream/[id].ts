import type { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Extract track ID from URL
  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/');
  const id = pathSegments[pathSegments.length - 1];

  if (!id) {
    return new Response(JSON.stringify({ error: 'Track ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get range header from client request
    const range = req.headers.get('range');
    
    // Prepare headers for backend request
    const backendHeaders: Record<string, string> = {
      'User-Agent': 'NextJS-Streaming-Proxy/1.0',
    };

    // Forward range header if present
    if (range) {
      backendHeaders['Range'] = range;
    }

    // Make request to Python backend
    const backendUrl = `${process.env.BACKEND_API_URL}/stream/${id}`;
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: backendHeaders,
    });

    if (!response.ok) {
      console.error(`Backend error: ${response.status} ${response.statusText}`);
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch audio stream',
        status: response.status 
      }), {
        status: response.status === 404 ? 404 : 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Prepare response headers
    const responseHeaders = new Headers();

    // Copy important headers from backend response
    const headersToForward = [
      'content-type',
      'content-length',
      'content-range',
      'accept-ranges',
      'cache-control',
      'etag',
      'last-modified',
    ];

    headersToForward.forEach(headerName => {
      const headerValue = response.headers.get(headerName);
      if (headerValue) {
        responseHeaders.set(headerName, headerValue);
      }
    });

    // Set CORS headers if needed for your frontend
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET');
    responseHeaders.set('Access-Control-Allow-Headers', 'Range');

    // Return streaming response with appropriate status
    const status = response.status; // Will be 206 for partial content, 200 for full content

    return new Response(response.body, {
      status,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('Streaming error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error while streaming' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}