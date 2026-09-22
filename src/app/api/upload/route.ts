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

    if (programs.length > 500) {
      return NextResponse.json({ error: 'Bulk upload supports up to 500 program rows per request.' }, { status: 400 });
    }

    const duplicateNames = programs
      .map((item) => item.title?.trim().toLowerCase())
      .filter((value): value is string => Boolean(value));

    const hasDuplicateRowTitle = duplicateNames.length !== new Set(duplicateNames).size;
    if (hasDuplicateRowTitle) {
      return NextResponse.json({ error: 'Duplicate program titles were detected in the upload. Please remove duplicates and retry.' }, { status: 400 });
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

    const errors: string[] = [];
    const preparedPrograms: Array<{
      item: BulkProgramInput;
      universityId: string;
      rowNumber: number;
    }> = [];

    for (let i = 0; i < programs.length; i++) {
      const item = programs[i];

      if (!item.title || !item.degreeLevel) {
        errors.push(`Row ${i + 1}: Missing required title or degree level.`);
        continue;
      }

      const numericFields = [
        ['tuitionMYR', item.tuitionMYR],
        ['firstYearFeeMYR', item.firstYearFeeMYR],
        ['secondYearFeeMYR', item.secondYearFeeMYR],
        ['thirdYearFeeMYR', item.thirdYearFeeMYR],
        ['fourthYearFeeMYR', item.fourthYearFeeMYR],
        ['emgsFeeMYR', item.emgsFeeMYR],
        ['miscFeesMYR', item.miscFeesMYR],
        ['totalInitialMYR', item.totalInitialMYR],
      ] as const;
      const invalidNumber = numericFields.find(([, value]) => {
        if (value === undefined || value === null) return false;
        const numericValue = Number(value);
        return !Number.isFinite(numericValue) || numericValue < 0;
      });

      if (invalidNumber) {
        errors.push(`Row ${i + 1} (${item.title}): ${invalidNumber[0]} must be a non-negative number.`);
        continue;
      }

      // Match university
      const searchTarget = (item.universityName || '').toLowerCase().trim();
      if (!searchTarget) {
        errors.push(`Row ${i + 1} (${item.title}): University name is required.`);
        continue;
      }

      const matchingUniversities = existingUniversities.filter((u) => {
        const universityName = u.name.toLowerCase();
        const shortName = u.shortName.toLowerCase();
        return (
          universityName === searchTarget ||
          shortName === searchTarget ||
          universityName.includes(searchTarget) ||
          shortName.includes(searchTarget) ||
          searchTarget.includes(shortName)
        );
      });

      if (matchingUniversities.length === 0) {
        errors.push(`Row ${i + 1} (${item.title}): University "${item.universityName}" was not found. No records were imported.`);
        continue;
      }

      if (matchingUniversities.length > 1) {
        errors.push(`Row ${i + 1} (${item.title}): University "${item.universityName}" matched multiple records. Use the exact university name or short name.`);
        continue;
      }

      const matchedUni = matchingUniversities[0];

      const y1 = item.firstYearFeeMYR ? Number(item.firstYearFeeMYR) : undefined;
      const y2 = item.secondYearFeeMYR ? Number(item.secondYearFeeMYR) : undefined;
      const y3 = item.thirdYearFeeMYR ? Number(item.thirdYearFeeMYR) : undefined;
      const y4 = item.fourthYearFeeMYR ? Number(item.fourthYearFeeMYR) : undefined;
      const yearlyTotal = (y1 || 0) + (y2 || 0) + (y3 || 0) + (y4 || 0);
      const statedTuition = Number(item.tuitionMYR) || 0;

      if (yearlyTotal > 0 && statedTuition > 0 && Math.abs(statedTuition - yearlyTotal) > 1) {
        errors.push(
          `Row ${i + 1} (${item.title}): tuitionMYR (${statedTuition}) must equal the sum of the 1st-4th year fees (${yearlyTotal}).`
        );
        continue;
      }

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

      preparedPrograms.push({ item, universityId: matchedUni.id, rowNumber: i + 1 });
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Import validation failed. No records were written to the database.', errors },
        { status: 400 }
      );
    }

    const insertedPrograms = await db.$transaction(async (transaction) => {
      const createdPrograms = [];

      for (const { item, universityId, rowNumber } of preparedPrograms) {
        const y1 = item.firstYearFeeMYR ? Number(item.firstYearFeeMYR) : undefined;
        const y2 = item.secondYearFeeMYR ? Number(item.secondYearFeeMYR) : undefined;
        const y3 = item.thirdYearFeeMYR ? Number(item.thirdYearFeeMYR) : undefined;
        const y4 = item.fourthYearFeeMYR ? Number(item.fourthYearFeeMYR) : undefined;
        let tuition = Number(item.tuitionMYR) || 0;
        if (tuition === 0 && (y1 || y2 || y3 || y4)) {
          tuition = (y1 || 0) + (y2 || 0) + (y3 || 0) + (y4 || 0);
        }

        const emgs = Number(item.emgsFeeMYR) || 3500;
        const misc = Number(item.miscFeesMYR) || 6000;
        const initial = Number(item.totalInitialMYR) || (emgs + misc);
        let parsedYears = 3;
        if (item.duration) {
          const match = item.duration.match(/([\d.]+)\s*(?:year|yr)/i);
          if (match) parsedYears = parseFloat(match[1]);
        }

        const scheduleList: { semester: string; tuitionMYR: number; miscMYR: number }[] = [];
        if (y1 && y1 > 0) scheduleList.push({ semester: 'Year 1', tuitionMYR: y1, miscMYR: misc });
        if (y2 && y2 > 0) scheduleList.push({ semester: 'Year 2', tuitionMYR: y2, miscMYR: 1600 });
        if (y3 && y3 > 0) scheduleList.push({ semester: 'Year 3', tuitionMYR: y3, miscMYR: 1600 });
        if (y4 && y4 > 0) scheduleList.push({ semester: 'Year 4', tuitionMYR: y4, miscMYR: 1600 });

        const uniqueSlug = `${slugify(item.title)}-${Date.now().toString().slice(-4)}-${rowNumber}`;
        const created = await transaction.program.create({
          data: {
            slug: uniqueSlug,
            title: item.title.trim(),
            universityId,
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
        createdPrograms.push(created);
      }

      if (createdPrograms.length > 0) {
        await transaction.auditLog.create({
          data: {
            title: `Bulk Imported ${createdPrograms.length} Courses`,
            action: 'BATCH_IMPORT',
            target: `${createdPrograms.length} Program Records`,
            details: 'Imported courses via Bulk CSV/JSON Uploader.',
          },
        });
      }

      return createdPrograms;
    });

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

