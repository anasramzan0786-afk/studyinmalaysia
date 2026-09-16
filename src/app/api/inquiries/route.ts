import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { InquirySchema } from '@/lib/validators';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required to view student inquiries' }, { status: 401 });
    }

    const inquiries = await db.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        program: {
          select: {
            title: true,
            university: { select: { name: true } },
          },
        },
      },
    });
    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error('Failed to fetch inquiries:', error);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = InquirySchema.parse(body);

    // Verify if programId actually exists in DB to prevent FK constraint failures
    let validProgramId: string | null = null;
    if (validatedData.programId) {
      try {
        const prog = await db.program.findUnique({
          where: { id: validatedData.programId },
          select: { id: true },
        });
        if (prog) validProgramId = prog.id;
      } catch (err) {
        console.warn('Invalid programId lookup, proceeding without linking programId:', err);
      }
    }

    const inquiry = await db.inquiry.create({
      data: {
        studentName: validatedData.studentName,
        phone: validatedData.phone,
        email: validatedData.email || null,
        city: validatedData.city || null,
        qualification: validatedData.qualification || null,
        programInterest: validatedData.programInterest || null,
        programId: validProgramId,
        notes: validatedData.notes || null,
      },
    });

    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create inquiry:', error);
    if (error?.name === 'ZodError' || error?.issues) {
      const issueMessage = error.issues?.[0]?.message || 'Invalid input data';
      return NextResponse.json({ error: issueMessage }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to submit inquiry' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required to update inquiry' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Inquiry ID is required' }, { status: 400 });
    }

    const updated = await db.inquiry.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error) {
    console.error('Failed to update inquiry status:', error);
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}

