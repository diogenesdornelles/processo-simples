/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  const publicRoutes = ['/login'];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(
    process.env.NEXT_PUBLIC_AUTH_TOKEN || ''
  )?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const apiUrl = process.env.API_URL || 'http://localhost:8000/api';

    const response = await axios(`${apiUrl}/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      timeout: 5000,
    });

    if (response.status < 200 || response.status >= 300) {
      console.warn(
        'Token validation failed - invalid response status:',
        response.status
      );
      const redirectResponse = NextResponse.redirect(
        new URL('/login', request.url)
      );
      redirectResponse.cookies.delete(process.env.NEXT_PUBLIC_AUTH_TOKEN || '');
      return redirectResponse;
    }

    if (!response.data || !response.data.id) {
      console.warn('Token validation failed - invalid user data');
      const redirectResponse = NextResponse.redirect(
        new URL('/login', request.url)
      );
      redirectResponse.cookies.delete(process.env.NEXT_PUBLIC_AUTH_TOKEN || '');
      return redirectResponse;
    }

    const nextResponse = NextResponse.next();
    nextResponse.headers.set('X-User-ID', response.data.id.toString());
    nextResponse.headers.set('X-User-Email', response.data.email || '');
    nextResponse.headers.set('X-User-Role', response.data.role || '');
    nextResponse.headers.set('X-User-Name', response.data.name || '');

    return nextResponse;
  } catch (error: any) {
    console.error('Token validation error:', error.message || error);

    const redirectResponse = NextResponse.redirect(
      new URL('/login', request.url)
    );
    redirectResponse.cookies.delete(process.env.NEXT_PUBLIC_AUTH_TOKEN || '');
    return redirectResponse;
  }
}

export const config = {
  matcher: ['/', '/home/:path*', '/processos/:path*', '/usuarios/:path*'],
};
