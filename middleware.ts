import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  console.log('Session Cookie:', sessionCookie);

  const { pathname } = request.nextUrl;
  
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
  // Specify the routes the middleware applies to
  matcher: [
    '/',               // Handle root path
    '/boards/:path*',  // Protect board routes
    '/login',          // Handle auth pages
    '/signup',
    '/account/:path*', // Keep existing protected routes
    '/dashboard/:path*'
  ],
};
