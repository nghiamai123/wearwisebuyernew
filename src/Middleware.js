import { NextResponse } from 'next/server';

export function middleware(request) {
  const accessToken = request.cookies.get('accessToken')?.value || request.cookies.get('refreshToken')?.value || request.headers.get('Authorization')?.split(' ')[1];
  const userString = request.cookies.get('user')?.value
  const user = userString ? JSON.parse(userString) : null;
  const path = request.nextUrl.pathname;

  if (!accessToken) {
    if (path.startsWith('/supplier')) {
      return NextResponse.redirect(new URL('/login', request.nextUrl));
    }
  } else {
    if (path === '/login' || path === '/register') {
      return NextResponse.redirect(new URL('/', request.nextUrl));
    }
    if (user && user.role === 'supplier') {
      if (!path.startsWith('/supplier')) {
        return NextResponse.redirect(new URL('/supplier', request.nextUrl));
      }
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/supplier/:path*', '/', '/login', '/register'],
};