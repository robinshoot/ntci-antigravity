import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function proxy(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Only allow request if user has valid NextAuth session token
        return !!token;
      },
    },
    pages: {
      signIn: '/?loginRequired=true',
    },
  }
);

export const config = {
  matcher: ['/ad-art', '/sos'],
};
