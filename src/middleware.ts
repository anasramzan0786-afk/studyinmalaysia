import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getJwtSecret } from '@/lib/runtime-config';

const JWT_SECRET = getJwtSecret();
const COOKIE_NAME = 'meezab_session';

function base64UrlDecode(str: string): string {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) {
    b64 += '=';
  }
  return atob(b64);
}

async function verifyToken(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const dataToVerify = enc.encode(`${header}.${payload}`);
    const expectedSigRaw = base64UrlDecode(signature);
    const expectedSigBuf = new Uint8Array(expectedSigRaw.length);
    for (let i = 0; i < expectedSigRaw.length; i++) {
      expectedSigBuf[i] = expectedSigRaw.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify('HMAC', key, expectedSigBuf, dataToVerify);
    if (!isValid) return null;

    const decodedPayload = JSON.parse(base64UrlDecode(payload));
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return decodedPayload;
  } catch (err) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // 1. Allow static assets and login page without authentication
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/login' ||
    pathname === '/favicon.ico' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Retrieve session for protected routes
  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;
  const user = sessionCookie ? await verifyToken(sessionCookie) : null;

  // 3. If not authenticated, redirect to login (or return 401 for API)
  if (!user) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Only allow ADMIN or COUNSELOR roles
  if (user.role !== 'ADMIN' && user.role !== 'COUNSELOR') {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    const homeUrl = new URL('/', request.url);
    homeUrl.searchParams.set('error', 'access_denied');
    return NextResponse.redirect(homeUrl);
  }

  // 5. Authenticated and authorized – allow request to proceed
  return NextResponse.next();
}


export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
