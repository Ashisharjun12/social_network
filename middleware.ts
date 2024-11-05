import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get('auth_token')?.value;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/about', '/privacy', '/terms'];
  const authRoutes = ['/login', '/register'];
  const isAdminRoute = pathname.startsWith('/admin');

  if (authCookie) {
    try {
      const { user } = JSON.parse(authCookie);
      const isAdmin = user.role === 'admin';

      // Redirect based on role
      if (authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL(isAdmin ? '/admin' : '/feed', request.url));
      }

      // Protect admin routes
      if (isAdminRoute && !isAdmin) {
        return NextResponse.redirect(new URL('/feed', request.url));
      }

      // Redirect admin users to admin dashboard if they try to access feed
      if (isAdmin && pathname === '/feed') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }

    } catch (error) {
      request.cookies.delete('auth_token');
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } else {
    if (!publicRoutes.includes(pathname) && !authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
}; 