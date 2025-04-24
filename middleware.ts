import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;
  
  console.log('=== Auth Debug ===');
  console.log('Path:', pathname);
  console.log('Session Cookie Present:', !!sessionCookie);
  console.log('Current URL:', request.url);
  
  // Handle root path
  if (pathname === '/') {
    if (sessionCookie) {
      return NextResponse.redirect(new URL('/boards', request.url));
    }

    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Handle auth pages (/login, /signup)
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    if (sessionCookie) {
      return NextResponse.redirect(new URL('/boards', request.url));
    }
    
    return NextResponse.next();
  }

  // Handle protected routes
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/', // Handle root path
    '/boards/:path*', // Re-enable boards protection
    '/login', // Handle auth pages
    '/signup',
    '/account/:path*', // Protected routes
    '/boards/:path*',
  ],
};
