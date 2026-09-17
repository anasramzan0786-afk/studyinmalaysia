import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slugify } from '@/lib/utils';
import { getAuthSession } from '@/lib/auth';

interface BulkProgramInput {
  title: string;
  universityName: string;
  degreeLevel: string;
  faculty?: string;
  duration?: string;
  intakeMonths?: string;
  tuitionMYR: number;
  firstYearFeeMYR?: number;
  secondYearFeeMYR?: number;
  thirdYearFeeMYR?: number;
  fourthYearFeeMYR?: number;
  emgsFeeMYR?: number;
  miscFeesMYR?: number;
  totalInitialMYR?: number;
  scholarship?: string;
  academicReq?: string;
  englishReq?: string;
  pakistanNotes?: string;
}

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required for bulk upload' }, { status: 403 });
    }

    const body = await request.json();
    const { programs } = body as { programs: BulkProgramInput[] };

    if (!Array.isArray(programs) || programs.length === 0) {
      return NextResponse.json({ error: 'No programs provided for upload' }, { status: 400 });
    }

    // 1. Fetch all existing universities for fuzzy matching
    const existingUniversities = await db.university.findMany({
      select: { id: true, name: true, shortName: true },
    });

    if (existingUniversities.length === 0) {
      return NextResponse.json(
        { error: 'No universities exist in the database. Please add universities first.' },
        { status: 400 }
      );
    }

    const defaultUni = existingUniversities[0];
    const insertedPrograms = [];
    const errors = [];

    for (let i = 0; i < programs.length; i++) {
      const item = programs[i];

      if (!item.title || !item.degreeLevel) {
        errors.push(`Row ${i + 1}: Missing required title or degree level.`);
        continue;
      }

      // Match university
      const searchTarget = (item.universityName || '').toLowerCase().trim();
      let matchedUni = existingUniversities.find(
        (u) =>
          u.name.toLowerCase().includes(searchTarget) ||
          u.shortName.toLowerCase().includes(searchTarget) ||
          searchTarget.includes(u.shortName.toLowerCase())
      );

      if (!matchedUni) {
        matchedUni = defaultUni;
      }

      const y1 = item.firstYearFeeMYR ? Number(item.firstYearFeeMYR) : undefined;
      const y2 = item.secondYearFeeMYR ? Number(item.secondYearFeeMYR) : undefined;
      const y3 = item.thirdYearFeeMYR ? Number(item.thirdYearFeeMYR) : undefined;
      const y4 = item.fourthYearFeeMYR ? Number(item.fourthYearFeeMYR) : undefined;

      let tuition = Number(item.tuitionMYR) || 0;
      if (tuition === 0 && (y1 || y2 || y3)) {
        tuition = (y1 || 0) + (y2 || 0) + (y3 || 0) + (y4 || 0);
      }

      const emgs = Number(item.emgsFeeMYR) || 3500;
      const misc = Number(item.miscFeesMYR) || 6000;
      const initial = Number(item.totalInitialMYR) || (emgs + misc);

      // Parse duration in years
      let parsedYears = 3;
      if (item.duration) {
        const match = item.duration.match(/([\d.]+)\s*(?:year|yr)/i);
        if (match) {
          parsedYears = parseFloat(match[1]);
        }
      }

      // Prepare semester/year schedules if yearly fee breakdown exists
      const scheduleList: { semester: string; tuitionMYR: number; miscMYR: number }[] = [];
      if (y1 && y1 > 0) {
        scheduleList.push({ semester: 'Year 1', tuitionMYR: y1, miscMYR: misc });
      }
      if (y2 && y2 > 0) {
        scheduleList.push({ semester: 'Year 2', tuitionMYR: y2, miscMYR: 1600 });
      }
      if (y3 && y3 > 0) {
        scheduleList.push({ semester: 'Year 3', tuitionMYR: y3, miscMYR: 1600 });
      }
      if (y4 && y4 > 0) {
        scheduleList.push({ semester: 'Year 4', tuitionMYR: y4, miscMYR: 1600 });
      }

      const uniqueSlug = `${slugify(item.title)}-${Date.now().toString().slice(-4)}-${i}`;

      try {
        const created = await db.program.create({
          data: {
            slug: uniqueSlug,
            title: item.title.trim(),
            universityId: matchedUni.id,
            degreeLevel: item.degreeLevel.trim(),
            faculty: item.faculty || 'General Studies',
            duration: item.duration || '3 Years (Full-time)',
            durationYears: parsedYears,
            intakeMonths: item.intakeMonths || 'January, May, September',
            scholarship: item.scholarship || 'Standard Pricing',
            tuitionMYR: tuition,
            firstYearFeeMYR: y1 || null,
            secondYearFeeMYR: y2 || null,
            thirdYearFeeMYR: y3 || null,
            fourthYearFeeMYR: y4 || null,
            tuitionUSD: Math.round(tuition / 4.45),
            emgsFeeMYR: emgs,
            miscFeesMYR: misc,
            totalInitialMYR: initial,
            academicReq: item.academicReq || 'Standard academic entry requirements apply.',
            englishReq: item.englishReq || 'IELTS 5.5 - 6.0 or English placement certificate.',
            pakistanNotes: item.pakistanNotes || `Upfront initial package: RM ${initial.toLocaleString()}.`,
            ...(scheduleList.length > 0
              ? {
                  semesterSchedules: {
                    create: scheduleList,
                  },
                }
              : {}),
          },
        });
        insertedPrograms.push(created);
      } catch (err: any) {
        errors.push(`Row ${i + 1} (${item.title}): ${err.message}`);
      }
    }

    // Create Audit Log entry for the bulk import
    if (insertedPrograms.length > 0) {
      await db.auditLog.create({
        data: {
          title: `Bulk Imported ${insertedPrograms.length} Courses`,
          action: 'BATCH_IMPORT',
          target: `${insertedPrograms.length} Program Records`,
          details: `Imported courses via Bulk CSV/JSON Uploader. Errors encountered: ${errors.length}.`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      importedCount: insertedPrograms.length,
      errors,
      sample: insertedPrograms.slice(0, 5),
    });
  } catch (error: any) {
    console.error('Bulk upload server error:', error);
    return NextResponse.json({ error: error.message || 'Server error processing bulk upload' }, { status: 500 });
  }
}

