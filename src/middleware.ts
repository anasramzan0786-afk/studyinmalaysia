import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'meezab-malaysia-portal-secret-key-2026';
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

  // 1. Always allow static files, Next.js assets, and SEO files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/login' ||
    pathname === '/favicon.ico' ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Allow public consumer pages
  const isPublicPage =
    pathname === '/' ||
    pathname.startsWith('/programs') ||
    pathname.startsWith('/universities') ||
    pathname.startsWith('/calculator');

  // 3. Allow public API operations
  const isPublicApi =
    (pathname === '/api/inquiries' && method === 'POST') ||
    (pathname === '/api/programs' && method === 'GET') ||
    (pathname === '/api/universities' && method === 'GET');

  if (isPublicPage || isPublicApi) {
    return NextResponse.next();
  }

  // 4. Check user session for protected routes (Admin console, internal APIs, and mutations)
  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;
  const user = sessionCookie ? await verifyToken(sessionCookie) : null;

  // 4a. Unauthenticated access handling
  if (!user) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4b. Protected admin pages & admin APIs require ADMIN role
  const isAdminPath =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/admin') ||
    pathname.startsWith('/api/upload') ||
    ((pathname === '/api/programs' || pathname === '/api/universities') && method !== 'GET');

  if (isAdminPath && user.role !== 'ADMIN') {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    const homeUrl = new URL('/', request.url);
    homeUrl.searchParams.set('error', 'admin_access_denied');
    return NextResponse.redirect(homeUrl);
  }

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
