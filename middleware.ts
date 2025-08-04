import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token');
  const { pathname } = request.nextUrl;
 
  const publicRoutes = ['/about']; // Explicitly public routes
  const authRoutes = ['/login', '/register'];
  
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Allow public routes without authentication
  if (isPublicRoute) {
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
    '/login',
    '/register',
    '/',
    '/dashboard/:path*',
    '/profile/:path*'
  ]
};