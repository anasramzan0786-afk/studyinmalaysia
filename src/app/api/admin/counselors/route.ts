import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

// Strict Admin-only API for Counselors tracked in Team Management
export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied: Admin role required' }, { status: 403 });
    }

    const counselors = await db.trackedCounselor.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ counselors });
  } catch (error: any) {
    console.error('Failed to fetch tracked counselors:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch counselors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied: Admin role required' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, phone, branch } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Counselor name is required.' }, { status: 400 });
    }

    const trimmedName = name.trim();

    // Check if counselor already tracked
    const existing = await db.trackedCounselor.findUnique({
      where: { name: trimmedName },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'This counselor is already added to Team Management.' },
        { status: 400 }
      );
    }

    const created = await db.trackedCounselor.create({
      data: {
        name: trimmedName,
        email: email ? email.trim().toLowerCase() : null,
        phone: phone ? phone.trim() : null,
        branch: branch || 'Lahore (Head Office)',
        active: true,
      },
    });

    await db.auditLog.create({
      data: {
        title: `Added Counselor to Team Management: ${created.name}`,
        action: 'CREATE',
        target: created.name,
        details: `Branch: ${created.branch}`,
        user: session.username || 'Admin',
      },
    });

    return NextResponse.json({ success: true, counselor: created }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create tracked counselor:', error);
    return NextResponse.json({ error: error.message || 'Failed to add counselor' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied: Admin role required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Counselor ID is required' }, { status: 400 });
    }

    const deleted = await db.trackedCounselor.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, counselor: deleted });
  } catch (error: any) {
    console.error('Failed to delete counselor:', error);
    return NextResponse.json({ error: error.message || 'Failed to remove counselor' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied: Admin role required' }, { status: 403 });
    }

    const body = await request.json();
    const { id, active, branch } = body;

    if (!id) {
      return NextResponse.json({ error: 'Counselor ID is required' }, { status: 400 });
    }

    const updated = await db.trackedCounselor.update({
      where: { id },
      data: {
        ...(typeof active === 'boolean' && { active }),
        ...(branch && { branch }),
      },
    });

    return NextResponse.json({ success: true, counselor: updated });
  } catch (error: any) {
    console.error('Failed to update counselor:', error);
    return NextResponse.json({ error: error.message || 'Failed to update counselor' }, { status: 500 });
  }
}
