import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token');
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/about']; // Explicitly public routes
  const authRoutes = ['/login', '/register'];

  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Allow public routes and static files (handled by matcher partially, but good safety net)
  // Also allow PWA files (sw.js, manifest.json, workbox files)
  const isPWAFile = pathname === '/sw.js' || pathname === '/manifest.json' || pathname.startsWith('/workbox-');
  if (isPublicRoute || pathname.startsWith('/_next') || pathname.startsWith('/static') || isPWAFile) {
    return NextResponse.next();
  }

  // Redirect to login if accessing any other route without token (including home)
  if (!isAuthRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing auth pages while logged in
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match everything except api routes, Next.js internals, static files, and PWA files
    '/((?!api|_next|static|favicon.ico|sw.js|manifest.json|workbox-|icons/).*)',
  ]
};