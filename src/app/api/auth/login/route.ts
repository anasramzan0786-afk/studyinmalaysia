import { NextResponse } from 'next/server';
import { AUTH_CREDENTIALS, createSessionToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username/Email and Password are required.' },
        { status: 400 }
      );
    }

    const trimmedInput = username.trim().toLowerCase();
    const trimmedPassword = password.trim();

    let matchedRole: 'COUNSELOR' | 'ADMIN' | null = null;
    let loggedInUsername = '';

    // Check Counselor Credentials
    const counselorUser = AUTH_CREDENTIALS.counselor.username.toLowerCase();
    const counselorEmail = AUTH_CREDENTIALS.counselor.email.toLowerCase();
    if (
      (trimmedInput === counselorUser || trimmedInput === counselorEmail) &&
      trimmedPassword === AUTH_CREDENTIALS.counselor.password
    ) {
      matchedRole = 'COUNSELOR';
      loggedInUsername = 'Meezab Counselor';
    }

    // Check Admin Credentials
    const adminUser = AUTH_CREDENTIALS.admin.username.toLowerCase();
    const adminEmail = AUTH_CREDENTIALS.admin.email.toLowerCase();
    if (
      (trimmedInput === adminUser || trimmedInput === adminEmail) &&
      trimmedPassword === AUTH_CREDENTIALS.admin.password
    ) {
      matchedRole = 'ADMIN';
      loggedInUsername = 'Meezab Administrator';
    }

    if (!matchedRole) {
      return NextResponse.json(
        { error: 'Invalid Username/Email or Password. Please try again.' },
        { status: 401 }
      );
    }

    const token = await createSessionToken({
      username: loggedInUsername,
      role: matchedRole,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        username: loggedInUsername,
        role: matchedRole,
      },
    });

    // Set HTTP-Only Cookie
    response.cookies.set('meezab_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during authentication.' },
      { status: 500 }
    );
  }
}
