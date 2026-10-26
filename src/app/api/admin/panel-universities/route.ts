import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';
import { DEFAULT_DIRECT_PANEL_UNIVERSITIES } from '@/lib/team-config';

// Strict Admin-only API for Direct Panel Universities
export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied: Admin role required' }, { status: 403 });
    }

    let universities = await db.directPanelUniversity.findMany({
      orderBy: { name: 'asc' },
    });

    // Auto-seed if empty
    if (universities.length === 0) {
      for (const uni of DEFAULT_DIRECT_PANEL_UNIVERSITIES) {
        await db.directPanelUniversity.create({
          data: uni,
        }).catch(() => {});
      }
      universities = await db.directPanelUniversity.findMany({
        orderBy: { name: 'asc' },
      });
    }

    return NextResponse.json({ universities });
  } catch (error: any) {
    console.error('Failed to fetch direct panel universities:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch panel universities' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied: Admin role required' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      shortName,
      contractType,
      contractStatus,
      directPortalUrl,
      focalPersonName,
      focalPersonEmail,
      focalPersonPhone,
      supportedIntakes,
      specialNotes,
      active,
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'University name is required.' }, { status: 400 });
    }

    const created = await db.directPanelUniversity.create({
      data: {
        name: name.trim(),
        shortName: shortName?.trim() || null,
        contractType: contractType || 'Direct Agreement',
        contractStatus: contractStatus || 'Active',
        directPortalUrl: directPortalUrl?.trim() || null,
        focalPersonName: focalPersonName?.trim() || null,
        focalPersonEmail: focalPersonEmail?.trim() || null,
        focalPersonPhone: focalPersonPhone?.trim() || null,
        supportedIntakes: supportedIntakes?.trim() || null,
        specialNotes: specialNotes || null,
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    await db.auditLog.create({
      data: {
        title: `Added Direct Panel University: ${created.name}`,
        action: 'CREATE',
        target: created.name,
        details: `Contract: ${created.contractType}, Status: ${created.contractStatus}`,
        user: session.username || 'Admin',
      },
    });

    return NextResponse.json({ success: true, university: created }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create direct panel university:', error);
    return NextResponse.json({ error: error.message || 'Failed to create panel university' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied: Admin role required' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'University ID is required' }, { status: 400 });
    }

    const updated = await db.directPanelUniversity.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ success: true, university: updated });
  } catch (error: any) {
    console.error('Failed to update direct panel university:', error);
    return NextResponse.json({ error: error.message || 'Failed to update panel university' }, { status: 500 });
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
      return NextResponse.json({ error: 'University ID is required' }, { status: 400 });
    }

    const deleted = await db.directPanelUniversity.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, university: deleted });
  } catch (error: any) {
    console.error('Failed to delete direct panel university:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete panel university' }, { status: 500 });
  }
}
