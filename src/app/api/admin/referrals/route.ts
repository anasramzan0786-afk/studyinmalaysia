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
            bookingDone: true,
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
    const {
      caseId,
      studentName,
      phone,
      email,
      city,
      targetUniversity,
      targetProgram,
      intake,
      fromBranch,
      toBranch,
      referredBy,
      handledBy,
      reason,
      notes,
    } = body;

    if (!fromBranch || !toBranch || !referredBy) {
      return NextResponse.json(
        { error: 'Source branch, destination branch, and referring staff member are required.' },
        { status: 400 }
      );
    }

    let targetCaseId = caseId;
    let newlyCreatedCase = null;

    if (!targetCaseId) {
      // Direct Student Referral (not yet registered in cases)
      if (!studentName || !phone) {
        return NextResponse.json(
          { error: 'Student Name and Phone Number are required to refer a new student.' },
          { status: 400 }
        );
      }

      newlyCreatedCase = await db.studentCase.create({
        data: {
          studentName: studentName.trim(),
          phone: phone.trim(),
          email: email ? email.trim().toLowerCase() : null,
          city: city ? city.trim() : null,
          counselorName: handledBy ? handledBy.trim() : null,
          branch: toBranch,
          targetUniversity: (targetUniversity && targetUniversity.trim()) || 'To Be Decided',
          targetProgram: (targetProgram && targetProgram.trim()) || 'General Inquiry',
          intake: (intake && intake.trim()) || 'Upcoming Intake',
          degreeLevel: "Bachelor's Degree",
          status: 'NEW',
          bookingDone: false, // Prospective student / inquiry
          notes: notes || `Direct referral from ${fromBranch} to ${toBranch}. Referred by ${referredBy}. Reason: ${reason || 'Inquiry'}`,
        },
      });

      targetCaseId = newlyCreatedCase.id;
    } else {
      const studentCase = await db.studentCase.findUnique({
        where: { id: targetCaseId },
      });

      if (!studentCase) {
        return NextResponse.json({ error: 'Student case not found' }, { status: 404 });
      }

      // Update existing case current branch
      await db.studentCase.update({
        where: { id: targetCaseId },
        data: {
          branch: toBranch,
        },
      });
    }

    // Create referral
    const referral = await db.branchReferral.create({
      data: {
        caseId: targetCaseId,
        fromBranch,
        toBranch,
        referredBy,
        handledBy: handledBy || null,
        reason: reason || null,
        notes: notes || null,
        status: 'TRANSFERRED',
      },
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
            bookingDone: true,
          },
        },
      },
    });

    // Record timeline log
    await db.caseTimelineLog.create({
      data: {
        caseId: targetCaseId,
        action: 'REFERRAL',
        title: `Referred from ${fromBranch} to ${toBranch}`,
        details: `Referred by ${referredBy}. Receiving staff: ${handledBy || 'Unassigned'}. Reason: ${reason || 'N/A'}`,
        performedBy: session.username || 'Admin',
      },
    });

    return NextResponse.json({ success: true, referral, newCase: newlyCreatedCase }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create branch referral:', error);
    return NextResponse.json({ error: error.message || 'Failed to create branch referral' }, { status: 500 });
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
      return NextResponse.json({ error: 'Referral ID is required' }, { status: 400 });
    }

    const deleted = await db.branchReferral.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, referral: deleted });
  } catch (error: any) {
    console.error('Failed to delete referral:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete referral' }, { status: 500 });
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
