import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

// Strict Admin-only API for Case Management
export async function GET(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied: Admin role required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const counselorId = searchParams.get('counselorId');
    const branch = searchParams.get('branch');
    const status = searchParams.get('status');
    const search = searchParams.get('q');

    const whereClause: any = {};
    if (counselorId && counselorId !== 'ALL') {
      whereClause.counselorId = counselorId;
    }
    if (branch && branch !== 'ALL') {
      whereClause.branch = branch;
    }
    if (status && status !== 'ALL') {
      whereClause.status = status;
    }
    if (search) {
      whereClause.OR = [
        { studentName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { passportNumber: { contains: search, mode: 'insensitive' } },
        { targetUniversity: { contains: search, mode: 'insensitive' } },
        { targetProgram: { contains: search, mode: 'insensitive' } },
        { counselorName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const cases = await db.studentCase.findMany({
      where: whereClause,
      include: {
        counselor: {
          select: { id: true, name: true, email: true },
        },
        referrals: {
          orderBy: { createdAt: 'desc' },
        },
        timelineLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ cases });
  } catch (error: any) {
    console.error('Failed to fetch student cases:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch cases' }, { status: 500 });
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
      studentName,
      passportNumber,
      phone,
      email,
      city,
      counselorId,
      counselorName,
      branch,
      targetUniversity,
      targetProgram,
      intake,
      degreeLevel,
      status,
      offerLetterStatus,
      emgsPaid,
      emgsPaymentDate,
      emgsRefNumber,
      valPercentage,
      valStatus,
      valIssuedDate,
      visaStatus,
      visaDate,
      travelDate,
      caseClosedDate,
      notes,
    } = body;

    if (!studentName || !phone || !targetUniversity || !targetProgram || !intake) {
      return NextResponse.json(
        { error: 'Student name, phone, university, program, and intake are required fields.' },
        { status: 400 }
      );
    }

    // Determine counselor name if counselorId is provided
    let finalCounselorName = counselorName || '';
    if (counselorId && !finalCounselorName) {
      const counselorObj = await db.user.findUnique({
        where: { id: counselorId },
        select: { name: true },
      });
      if (counselorObj) finalCounselorName = counselorObj.name;
    }

    const newCase = await db.studentCase.create({
      data: {
        studentName: studentName.trim(),
        passportNumber: passportNumber ? passportNumber.trim().toUpperCase() : null,
        phone: phone.trim(),
        email: email ? email.trim().toLowerCase() : null,
        city: city ? city.trim() : null,
        counselorId: counselorId || null,
        counselorName: finalCounselorName || null,
        branch: branch || 'Lahore (Head Office)',
        targetUniversity: targetUniversity.trim(),
        targetProgram: targetProgram.trim(),
        intake: intake.trim(),
        degreeLevel: degreeLevel || "Bachelor's Degree",
        status: status || 'APPLICATION_SUBMITTED',
        offerLetterStatus: offerLetterStatus || 'PENDING',
        emgsPaid: Boolean(emgsPaid),
        emgsPaymentDate: emgsPaymentDate ? new Date(emgsPaymentDate) : null,
        emgsRefNumber: emgsRefNumber || null,
        valPercentage: typeof valPercentage === 'number' ? valPercentage : 0,
        valStatus: valStatus || 'NOT_APPLIED',
        valIssuedDate: valIssuedDate ? new Date(valIssuedDate) : null,
        visaStatus: visaStatus || 'NOT_APPLIED',
        visaDate: visaDate ? new Date(visaDate) : null,
        travelDate: travelDate ? new Date(travelDate) : null,
        caseClosedDate: status === 'CASE_CLOSED' ? (caseClosedDate ? new Date(caseClosedDate) : new Date()) : null,
        notes: notes || null,
      },
    });

    // Record initial timeline log
    await db.caseTimelineLog.create({
      data: {
        caseId: newCase.id,
        action: 'STATUS_CHANGE',
        title: 'Case Created',
        details: `Case registered for ${newCase.studentName} (${newCase.targetUniversity}) assigned to ${finalCounselorName || 'Team'}. Status: ${newCase.status}.`,
        performedBy: session.username || 'Admin',
      },
    });

    await db.auditLog.create({
      data: {
        title: `Created Student Case: ${newCase.studentName}`,
        action: 'CREATE',
        target: newCase.studentName,
        details: `University: ${newCase.targetUniversity}, Counselor: ${finalCounselorName || 'Unassigned'}`,
        user: session.username || 'Admin',
      },
    });

    return NextResponse.json({ success: true, case: newCase }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create student case:', error);
    return NextResponse.json({ error: error.message || 'Failed to create student case' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied: Admin role required' }, { status: 403 });
    }

    const body = await request.json();
    const { id, updateType, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Case ID is required' }, { status: 400 });
    }

    const currentCase = await db.studentCase.findUnique({
      where: { id },
    });

    if (!currentCase) {
      return NextResponse.json({ error: 'Student case not found' }, { status: 404 });
    }

    const patchData: any = {};

    if (updates.studentName !== undefined) patchData.studentName = updates.studentName.trim();
    if (updates.passportNumber !== undefined) patchData.passportNumber = updates.passportNumber ? updates.passportNumber.trim().toUpperCase() : null;
    if (updates.phone !== undefined) patchData.phone = updates.phone.trim();
    if (updates.email !== undefined) patchData.email = updates.email ? updates.email.trim().toLowerCase() : null;
    if (updates.city !== undefined) patchData.city = updates.city;
    if (updates.branch !== undefined) patchData.branch = updates.branch;
    if (updates.targetUniversity !== undefined) patchData.targetUniversity = updates.targetUniversity.trim();
    if (updates.targetProgram !== undefined) patchData.targetProgram = updates.targetProgram.trim();
    if (updates.intake !== undefined) patchData.intake = updates.intake.trim();
    if (updates.degreeLevel !== undefined) patchData.degreeLevel = updates.degreeLevel;
    if (updates.notes !== undefined) patchData.notes = updates.notes;

    // Counselor assignment
    if (updates.counselorId !== undefined) {
      patchData.counselorId = updates.counselorId || null;
      if (updates.counselorName !== undefined) {
        patchData.counselorName = updates.counselorName;
      } else if (updates.counselorId) {
        const counselorObj = await db.user.findUnique({
          where: { id: updates.counselorId },
          select: { name: true },
        });
        patchData.counselorName = counselorObj?.name || null;
      } else {
        patchData.counselorName = null;
      }
    }

    // Milestones
    if (updates.status !== undefined) {
      patchData.status = updates.status;
      if (updates.status === 'CASE_CLOSED' && !currentCase.caseClosedDate) {
        patchData.caseClosedDate = new Date();
      }
    }
    if (updates.offerLetterStatus !== undefined) patchData.offerLetterStatus = updates.offerLetterStatus;
    if (updates.emgsPaid !== undefined) {
      patchData.emgsPaid = Boolean(updates.emgsPaid);
      if (updates.emgsPaid && !currentCase.emgsPaymentDate) {
        patchData.emgsPaymentDate = updates.emgsPaymentDate ? new Date(updates.emgsPaymentDate) : new Date();
      }
    }
    if (updates.emgsPaymentDate !== undefined) {
      patchData.emgsPaymentDate = updates.emgsPaymentDate ? new Date(updates.emgsPaymentDate) : null;
    }
    if (updates.emgsRefNumber !== undefined) patchData.emgsRefNumber = updates.emgsRefNumber;

    if (updates.valPercentage !== undefined) patchData.valPercentage = Number(updates.valPercentage);
    if (updates.valStatus !== undefined) patchData.valStatus = updates.valStatus;
    if (updates.valIssuedDate !== undefined) {
      patchData.valIssuedDate = updates.valIssuedDate ? new Date(updates.valIssuedDate) : null;
    }

    if (updates.visaStatus !== undefined) patchData.visaStatus = updates.visaStatus;
    if (updates.visaDate !== undefined) {
      patchData.visaDate = updates.visaDate ? new Date(updates.visaDate) : null;
    }
    if (updates.travelDate !== undefined) {
      patchData.travelDate = updates.travelDate ? new Date(updates.travelDate) : null;
    }
    if (updates.caseClosedDate !== undefined) {
      patchData.caseClosedDate = updates.caseClosedDate ? new Date(updates.caseClosedDate) : null;
    }

    const updatedCase = await db.studentCase.update({
      where: { id },
      data: patchData,
      include: {
        counselor: { select: { id: true, name: true, email: true } },
      },
    });

    // Determine timeline action
    let timelineTitle = 'Case Updated';
    let timelineDetails = updates.timelineNote || `Case details updated by Admin.`;

    if (updates.status && updates.status !== currentCase.status) {
      timelineTitle = `Status Changed: ${updates.status}`;
      timelineDetails = `Status changed from ${currentCase.status} to ${updates.status}. ${updates.timelineNote || ''}`;
    } else if (updates.emgsPaid !== undefined && updates.emgsPaid !== currentCase.emgsPaid) {
      timelineTitle = updates.emgsPaid ? 'EMGS Fee Marked as Paid' : 'EMGS Fee Status Reset';
      timelineDetails = `EMGS ref: ${updates.emgsRefNumber || currentCase.emgsRefNumber || 'N/A'}`;
    } else if (updates.valPercentage !== undefined && updates.valPercentage !== currentCase.valPercentage) {
      timelineTitle = `VAL Progress Updated to ${updates.valPercentage}%`;
      timelineDetails = `VAL status: ${updates.valStatus || currentCase.valStatus || 'In Progress'}`;
    }

    await db.caseTimelineLog.create({
      data: {
        caseId: id,
        action: 'STATUS_CHANGE',
        title: timelineTitle,
        details: timelineDetails,
        performedBy: session.username || 'Admin',
      },
    });

    return NextResponse.json({ success: true, case: updatedCase });
  } catch (error: any) {
    console.error('Failed to update student case:', error);
    return NextResponse.json({ error: error.message || 'Failed to update student case' }, { status: 500 });
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
      return NextResponse.json({ error: 'Case ID is required' }, { status: 400 });
    }

    const deletedCase = await db.studentCase.delete({
      where: { id },
    });

    await db.auditLog.create({
      data: {
        title: `Deleted Student Case: ${deletedCase.studentName}`,
        action: 'DELETE',
        target: deletedCase.studentName,
        details: `Removed case from system. University: ${deletedCase.targetUniversity}`,
        user: session.username || 'Admin',
      },
    });

    return NextResponse.json({ success: true, case: deletedCase });
  } catch (error: any) {
    console.error('Failed to delete student case:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete student case' }, { status: 500 });
  }
}
