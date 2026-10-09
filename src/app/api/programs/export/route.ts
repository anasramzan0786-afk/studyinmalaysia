import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const universityId = searchParams.get('universityId');
    const degreeLevel = searchParams.get('degreeLevel');
    const search = searchParams.get('search');

    const where: any = {};
    if (universityId && universityId !== 'All') {
      where.universityId = universityId;
    }
    if (degreeLevel && degreeLevel !== 'All') {
      where.degreeLevel = degreeLevel;
    }
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { faculty: { contains: q, mode: 'insensitive' } },
      ];
    }

    const programs = await db.program.findMany({
      where,
      include: {
        university: {
          select: {
            name: true,
            shortName: true,
          },
        },
      },
      orderBy: [
        { university: { name: 'asc' } },
        { title: 'asc' },
      ],
    });

    const headers = [
      'title',
      'universityName',
      'degreeLevel',
      'faculty',
      'duration',
      'intakeMonths',
      'tuitionMYR',
      'firstYearFeeMYR',
      'secondYearFeeMYR',
      'thirdYearFeeMYR',
      'fourthYearFeeMYR',
      'emgsFeeMYR',
      'miscFeesMYR',
      'totalInitialMYR',
      'scholarship',
      'academicReq',
      'englishReq',
      'pakistanNotes',
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvRows = [headers.join(',')];

    for (const p of programs) {
      const row = [
        escapeCsv(p.title),
        escapeCsv(p.university?.name || ''),
        escapeCsv(p.degreeLevel || ''),
        escapeCsv(p.faculty || ''),
        escapeCsv(p.duration || ''),
        escapeCsv(p.intakeMonths || ''),
        escapeCsv(p.tuitionMYR ?? ''),
        escapeCsv(p.firstYearFeeMYR ?? ''),
        escapeCsv(p.secondYearFeeMYR ?? ''),
        escapeCsv(p.thirdYearFeeMYR ?? ''),
        escapeCsv(p.fourthYearFeeMYR ?? ''),
        escapeCsv(p.emgsFeeMYR ?? ''),
        escapeCsv(p.miscFeesMYR ?? ''),
        escapeCsv(p.totalInitialMYR ?? ''),
        escapeCsv(p.scholarship || ''),
        escapeCsv(p.academicReq || ''),
        escapeCsv(p.englishReq || ''),
        escapeCsv(p.pakistanNotes || ''),
      ];
      csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\r\n');
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `studyinmalaysia_programs_export_${timestamp}.csv`;

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json({ error: error.message || 'Export failed' }, { status: 500 });
  }
}

