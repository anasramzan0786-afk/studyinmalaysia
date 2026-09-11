import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createSessionToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Email / Username and Password are required.' },
        { status: 400 }
      );
    }

    const trimmedInput = username.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Query Supabase User table by email or fallback username matching
    let user = await db.user.findFirst({
      where: {
        OR: [
          { email: { equals: trimmedInput, mode: 'insensitive' } },
          // Allow logging in with simple 'admin' or 'counselor' username matching email prefix
          { email: { startsWith: `${trimmedInput}@`, mode: 'insensitive' } },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User account not found. Please check your email or username.' },
        { status: 401 }
      );
    }

    if (!user.active) {
      return NextResponse.json(
        { error: 'Your account has been deactivated by the Administrator.' },
        { status: 403 }
      );
    }

    // Compare bcrypt password hash
    const isPasswordValid = await bcrypt.compare(trimmedPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid password. Please try again.' },
        { status: 401 }
      );
    }

    // Create session token
    const token = await createSessionToken({
      username: user.name || user.email,
      role: user.role as 'COUNSELOR' | 'ADMIN',
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
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
