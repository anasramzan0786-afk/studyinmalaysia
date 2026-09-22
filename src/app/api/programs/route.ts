import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ProgramSchema } from '@/lib/validators';
import { slugify } from '@/lib/utils';
import { getAuthSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const degree = searchParams.get('degree');
    const universityId = searchParams.get('universityId');
    const search = searchParams.get('search');

    const programs = await db.program.findMany({
      where: {
        ...(degree && degree !== 'All' ? { degreeLevel: degree } : {}),
        ...(universityId && universityId !== 'All' ? { universityId } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { faculty: { contains: search, mode: 'insensitive' } },
                { university: { name: { contains: search, mode: 'insensitive' } } },
              ],
            }
          : {}),
      },
      include: {
        university: {
          select: {
            id: true,
            name: true,
            shortName: true,
            logo: true,
            location: true,
          },
        },
        semesterSchedules: true,
      },
      orderBy: { tuitionMYR: 'asc' },
    });

    return NextResponse.json({ programs });
  } catch (error) {
    console.error('Failed to query programs:', error);
    return NextResponse.json({ error: 'Failed to query programs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required to create programs' }, { status: 403 });
    }

    const body = await request.json();
    const validated = ProgramSchema.parse(body);

    const generatedSlug = `${slugify(validated.title)}-${Date.now().toString().slice(-4)}`;

    const program = await db.program.create({
      data: {
        slug: generatedSlug,
        title: validated.title,
        universityId: validated.universityId,
        degreeLevel: validated.degreeLevel,
        faculty: validated.faculty,
        badgeType: validated.badgeType || null,
        badgeText: validated.badgeText || null,
        duration: validated.duration,
        durationYears: validated.durationYears || 3,
        intakeMonths: validated.intakeMonths,
        scholarship: validated.scholarship || null,
        tuitionMYR: validated.tuitionMYR,
        firstYearFeeMYR: validated.firstYearFeeMYR || null,
        secondYearFeeMYR: validated.secondYearFeeMYR || null,
        thirdYearFeeMYR: validated.thirdYearFeeMYR || null,
        fourthYearFeeMYR: validated.fourthYearFeeMYR || null,
        tuitionUSD: Math.round(validated.tuitionMYR / 4.45),
        emgsFeeMYR: validated.emgsFeeMYR || 3500,
        miscFeesMYR: validated.miscFeesMYR || 6000,
        totalInitialMYR: (validated.emgsFeeMYR || 3500) + (validated.miscFeesMYR || 6000),
        miscBreakdown: validated.miscBreakdown || null,
        pakistanNotes: validated.pakistanNotes || null,
        description: validated.description || null,
        academicReq: validated.academicReq || null,
        englishReq: validated.englishReq || null,
        minGpa: validated.minGpa || null,
        documentsReq: validated.documentsReq ? JSON.stringify(validated.documentsReq) : null,
        ...(validated.firstYearFeeMYR
          ? {
              semesterSchedules: {
                create: [
                  { semester: 'Year 1', tuitionMYR: validated.firstYearFeeMYR, miscMYR: validated.miscFeesMYR || 6000 },
                  ...(validated.secondYearFeeMYR ? [{ semester: 'Year 2', tuitionMYR: validated.secondYearFeeMYR, miscMYR: 1600 }] : []),
                  ...(validated.thirdYearFeeMYR ? [{ semester: 'Year 3', tuitionMYR: validated.thirdYearFeeMYR, miscMYR: 1600 }] : []),
                  ...(validated.fourthYearFeeMYR ? [{ semester: 'Year 4', tuitionMYR: validated.fourthYearFeeMYR, miscMYR: 1600 }] : []),
                ],
              },
            }
          : {}),
      },
      include: { university: true },
    });

    // Create Audit Log
    await db.auditLog.create({
      data: {
        title: `Added Course: ${program.title}`,
        action: 'CREATE',
        target: program.title,
        details: `Created new ${program.degreeLevel} at ${program.university.name}`,
      },
    });

    return NextResponse.json({ success: true, program }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create program:', error);
    return NextResponse.json({ error: error.message || 'Validation failed' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required to update programs' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Program ID is required' }, { status: 400 });
    }

    const y1 = data.firstYearFeeMYR !== undefined ? (Number(data.firstYearFeeMYR) || null) : undefined;
    const y2 = data.secondYearFeeMYR !== undefined ? (Number(data.secondYearFeeMYR) || null) : undefined;
    const y3 = data.thirdYearFeeMYR !== undefined ? (Number(data.thirdYearFeeMYR) || null) : undefined;
    const y4 = data.fourthYearFeeMYR !== undefined ? (Number(data.fourthYearFeeMYR) || null) : undefined;

    const updated = await db.program.update({
      where: { id },
      data: {
        title: data.title,
        degreeLevel: data.degreeLevel,
        faculty: data.faculty,
        duration: data.duration,
        intakeMonths: data.intakeMonths,
        tuitionMYR: data.tuitionMYR,
        firstYearFeeMYR: y1,
        secondYearFeeMYR: y2,
        thirdYearFeeMYR: y3,
        fourthYearFeeMYR: y4,
        emgsFeeMYR: data.emgsFeeMYR,
        miscFeesMYR: data.miscFeesMYR,
        totalInitialMYR: (data.emgsFeeMYR || 3500) + (data.miscFeesMYR || 6000),
        scholarship: data.scholarship,
        academicReq: data.academicReq,
        englishReq: data.englishReq,
        description: data.description,
      },
      include: { university: true },
    });

    await db.auditLog.create({
      data: {
        title: `Updated: ${updated.title}`,
        action: 'UPDATE',
        target: updated.title,
        details: `Updated fee parameters for ${updated.university.name}`,
      },
    });

    return NextResponse.json({ success: true, program: updated });
  } catch (error) {
    console.error('Failed to update program:', error);
    return NextResponse.json({ error: 'Failed to update program' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required to delete programs' }, { status: 403 });
    }

    const adminConfirmed = request.headers.get('x-admin-confirm') === 'true';
    if (!adminConfirmed) {
      return NextResponse.json({ error: 'Admin confirmation required for destructive actions.' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const all = searchParams.get('all');

    if (all === 'true' || id === 'all') {
      await db.semesterSchedule.deleteMany({});
      const result = await db.program.deleteMany({});

      await db.auditLog.create({
        data: {
          title: `Cleared All Courses (${result.count})`,
          action: 'DELETE',
          target: 'All Programs',
          details: `Removed all ${result.count} programs from catalog.`,
        },
      });

      return NextResponse.json({ success: true, count: result.count });
    }

    if (!id) {
      return NextResponse.json({ error: 'Program ID required' }, { status: 400 });
    }

    const program = await db.program.delete({
      where: { id },
    });

    await db.auditLog.create({
      data: {
        title: `Deleted: ${program.title}`,
        action: 'DELETE',
        target: program.title,
        details: `Removed listing from catalog.`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete program:', error);
    return NextResponse.json({ error: 'Failed to delete program' }, { status: 500 });
  }
}

