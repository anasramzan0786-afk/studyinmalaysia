import { cookies } from 'next/headers';
import { getAuthCredentialValue, getJwtSecret } from '@/lib/runtime-config';

export interface AuthUser {
  username: string;
  role: 'COUNSELOR' | 'ADMIN';
}

const JWT_SECRET = getJwtSecret();
const COOKIE_NAME = 'meezab_session';

// Helper to generate HMAC SHA-256 signature using Web Crypto API (Edge & Node.js compatible)
async function getCryptoKey() {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function base64UrlEncode(str: string): string {
  const b64 = btoa(str);
  return b64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) {
    b64 += '=';
  }
  return atob(b64);
}

export async function createSessionToken(user: AuthUser, expiresInDays = 30): Promise<string> {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60;
  const payload = base64UrlEncode(JSON.stringify({ ...user, exp }));

  const dataToSign = new TextEncoder().encode(`${header}.${payload}`);
  const key = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, dataToSign);
  
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureStr = String.fromCharCode(...signatureArray);
  const signature = base64UrlEncode(signatureStr);

  return `${header}.${payload}.${signature}`;
}

export async function verifySessionToken(token: string): Promise<AuthUser | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const key = await getCryptoKey();
    const dataToVerify = new TextEncoder().encode(`${header}.${payload}`);

    const expectedSigRaw = base64UrlDecode(signature);
    const expectedSigBuf = new Uint8Array(expectedSigRaw.length);
    for (let i = 0; i < expectedSigRaw.length; i++) {
      expectedSigBuf[i] = expectedSigRaw.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify('HMAC', key, expectedSigBuf, dataToVerify);
    if (!isValid) return null;

    const decodedPayload = JSON.parse(base64UrlDecode(payload));
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return {
      username: decodedPayload.username,
      role: decodedPayload.role,
    };
  } catch (error) {
    return null;
  }
}

export async function getAuthSession(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionToken) return null;
  return await verifySessionToken(sessionToken);
}

export const AUTH_CREDENTIALS = {
  counselor: {
    username: getAuthCredentialValue('COUNSELOR_USERNAME', 'counselor'),
    email: getAuthCredentialValue('COUNSELOR_EMAIL', 'counselor@meezab.com'),
    password: getAuthCredentialValue('COUNSELOR_PASSWORD', 'counselor123'),
    role: 'COUNSELOR' as const,
  },
  admin: {
    username: getAuthCredentialValue('ADMIN_USERNAME', 'admin'),
    email: getAuthCredentialValue('ADMIN_EMAIL', 'admin@meezab.com'),
    password: getAuthCredentialValue('ADMIN_PASSWORD', 'admin123'),
    role: 'ADMIN' as const,
  },
};
