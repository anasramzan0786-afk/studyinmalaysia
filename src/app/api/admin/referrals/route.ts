import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

// Strict Admin-only API for Branch Referrals
export async function GET(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied: Admin role required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const fromBranch = searchParams.get('fromBranch');
    const toBranch = searchParams.get('toBranch');

    const whereClause: any = {};
    if (fromBranch && fromBranch !== 'ALL') whereClause.fromBranch = fromBranch;
    if (toBranch && toBranch !== 'ALL') whereClause.toBranch = toBranch;

    const referrals = await db.branchReferral.findMany({
      where: whereClause,
      include: {
        studentCase: {
          select: {
            id: true,
            studentName: true,
            phone: true,
            targetUniversity: true,
            targetProgram: true,
            status: true,
            counselorName: true,
          },
        },
      },
      orderBy: { transferDate: 'desc' },
    });

    return NextResponse.json({ referrals });
  } catch (error: any) {
    console.error('Failed to fetch referrals:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch referrals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied: Admin role required' }, { status: 403 });
    }

    const body = await request.json();
    const { caseId, fromBranch, toBranch, referredBy, handledBy, reason, notes } = body;

    if (!caseId || !fromBranch || !toBranch || !referredBy) {
      return NextResponse.json(
        { error: 'Case ID, source branch, destination branch, and referring staff member are required.' },
        { status: 400 }
      );
    }

    const studentCase = await db.studentCase.findUnique({
      where: { id: caseId },
    });

    if (!studentCase) {
      return NextResponse.json({ error: 'Student case not found' }, { status: 404 });
    }

    // Create referral
    const referral = await db.branchReferral.create({
      data: {
        caseId,
        fromBranch,
        toBranch,
        referredBy,
        handledBy: handledBy || null,
        reason: reason || null,
        notes: notes || null,
        status: 'TRANSFERRED',
      },
    });

    // Update case current branch
    await db.studentCase.update({
      where: { id: caseId },
      data: {
        branch: toBranch,
      },
    });

    // Record timeline log
    await db.caseTimelineLog.create({
      data: {
        caseId,
        action: 'REFERRAL',
        title: `Referred from ${fromBranch} to ${toBranch}`,
        details: `Referred by ${referredBy}. Receiving staff: ${handledBy || 'Unassigned'}. Reason: ${reason || 'N/A'}`,
        performedBy: session.username || 'Admin',
      },
    });

    return NextResponse.json({ success: true, referral }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create branch referral:', error);
    return NextResponse.json({ error: error.message || 'Failed to create branch referral' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied: Admin role required' }, { status: 403 });
    }

    const body = await request.json();
    const { id, handledBy, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Referral ID is required' }, { status: 400 });
    }

    const updated = await db.branchReferral.update({
      where: { id },
      data: {
        ...(handledBy !== undefined && { handledBy }),
        ...(status !== undefined && { status }),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json({ success: true, referral: updated });
  } catch (error: any) {
    console.error('Failed to update referral:', error);
    return NextResponse.json({ error: error.message || 'Failed to update referral' }, { status: 500 });
  }
}
