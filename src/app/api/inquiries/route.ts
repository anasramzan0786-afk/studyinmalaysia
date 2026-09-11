import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { InquirySchema } from '@/lib/validators';

export async function GET() {
  try {
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

    const inquiry = await db.inquiry.create({
      data: {
        studentName: validatedData.studentName,
        phone: validatedData.phone,
        email: validatedData.email || null,
        city: validatedData.city || null,
        qualification: validatedData.qualification || null,
        programInterest: validatedData.programInterest || null,
        programId: validatedData.programId || null,
        notes: validatedData.notes || null,
      },
    });

    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (error) {
    console.error('Failed to create inquiry:', error);
    return NextResponse.json({ error: 'Invalid inquiry data' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
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

