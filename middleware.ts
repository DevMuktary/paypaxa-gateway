import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Grab the secure JWT session cookie we set during login
  const session = request.cookies.get('paypaxa_session')?.value;

  // 2. Check if the user is trying to access ANY page inside the dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    
    // 3. If they have no session, intercept and redirect instantly
    if (!session) {
      // We attach a URL parameter so your login page knows why they were redirected
      const loginUrl = new URL('/login?reason=unauthorized', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. If they have a session, let them pass through normally
  return NextResponse.next();
}

// 🚀 CRITICAL: This tells Next.js to ONLY run this bouncer on dashboard routes to keep your app lightning fast
export const config = {
  matcher: ['/dashboard/:path*'],
};
