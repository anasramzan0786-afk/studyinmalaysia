import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slugify } from '@/lib/utils';
import { getAuthSession } from '@/lib/auth';

interface BulkProgramInput {
  id?: string;
  title: string;
  universityName?: string;
  universityId?: string;
  degreeLevel: string;
  faculty?: string;
  duration?: string;
  intakeMonths?: string;
  tuitionMYR?: number;
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
    const { programs, allowPartial = false } = body as { 
      programs: BulkProgramInput[];
      allowPartial?: boolean;
    };

    if (!Array.isArray(programs) || programs.length === 0) {
      return NextResponse.json({ error: 'No programs provided for upload' }, { status: 400 });
    }

    if (programs.length > 500) {
      return NextResponse.json({ error: 'Bulk upload supports up to 500 program rows per request.' }, { status: 400 });
    }

    // 1. Fetch all existing universities for robust matching
    const existingUniversities = await db.university.findMany({
      select: { id: true, name: true, shortName: true },
    });

    if (existingUniversities.length === 0) {
      return NextResponse.json(
        { error: 'No universities exist in the database. Please add universities first.' },
        { status: 400 }
      );
    }

    // 2. Fetch existing programs for intelligent upsert matching (by ID or by [universityId + normalized title])
    const existingPrograms = await db.program.findMany({
      select: { id: true, universityId: true, title: true, slug: true },
    });

    const existingById = new Map<string, (typeof existingPrograms)[0]>();
    const existingByUniAndTitle = new Map<string, (typeof existingPrograms)[0]>();

    for (const p of existingPrograms) {
      existingById.set(p.id, p);
      const key = `${p.universityId}_${p.title.trim().toLowerCase()}`;
      existingByUniAndTitle.set(key, p);
    }

    const errors: string[] = [];
    const preparedPrograms: Array<{
      item: BulkProgramInput;
      universityId: string;
      rowNumber: number;
      existingProgramId?: string; // If matched, we UPDATE instead of creating duplicate
    }> = [];

    // Helper to normalize strings for comparison
    const cleanStr = (s?: string) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    for (let i = 0; i < programs.length; i++) {
      const item = programs[i];
      const rowNum = i + 1;
      const title = (item.title || '').trim();

      if (!title || !item.degreeLevel) {
        errors.push(`Row ${rowNum}: Title and Degree Level are required.`);
        continue;
      }

      // Check numeric fields
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
        if (value === undefined || value === null || value === ('' as any)) return false;
        const numericValue = Number(value);
        return !Number.isFinite(numericValue) || numericValue < 0;
      });

      if (invalidNumber) {
        errors.push(`Row ${rowNum} (${title}): "${invalidNumber[0]}" must be a non-negative number.`);
        continue;
      }

      // Resolve University
      let matchedUni: { id: string; name: string; shortName: string } | undefined;

      if (item.universityId) {
        matchedUni = existingUniversities.find((u) => u.id === item.universityId);
      }

      if (!matchedUni && item.universityName) {
        const rawTarget = item.universityName.trim();
        const normTarget = cleanStr(rawTarget);

        // A. Exact match by name or shortName (case-insensitive)
        matchedUni = existingUniversities.find(
          (u) =>
            u.name.toLowerCase() === rawTarget.toLowerCase() ||
            u.shortName.toLowerCase() === rawTarget.toLowerCase()
        );

        // B. Normalized alphanumeric match
        if (!matchedUni) {
          matchedUni = existingUniversities.find(
            (u) =>
              cleanStr(u.name) === normTarget ||
              cleanStr(u.shortName) === normTarget
          );
        }

        // C. Substring match
        if (!matchedUni) {
          const substringCandidates = existingUniversities.filter((u) => {
            const uNameClean = cleanStr(u.name);
            const uShortClean = cleanStr(u.shortName);
            return (
              uNameClean.includes(normTarget) ||
              normTarget.includes(uShortClean) ||
              (uShortClean.length >= 3 && normTarget.includes(uShortClean))
            );
          });

          if (substringCandidates.length === 1) {
            matchedUni = substringCandidates[0];
          } else if (substringCandidates.length > 1) {
            matchedUni = substringCandidates.sort(
              (a, b) => Math.abs(a.name.length - rawTarget.length) - Math.abs(b.name.length - rawTarget.length)
            )[0];
          }
        }
      }

      if (!matchedUni) {
        errors.push(
          `Row ${rowNum} (${title}): University "${item.universityName || 'unspecified'}" could not be identified.`
        );
        continue;
      }

      // Calculate fees
      const y1 = item.firstYearFeeMYR !== undefined && item.firstYearFeeMYR !== null ? Number(item.firstYearFeeMYR) : undefined;
      const y2 = item.secondYearFeeMYR !== undefined && item.secondYearFeeMYR !== null ? Number(item.secondYearFeeMYR) : undefined;
      const y3 = item.thirdYearFeeMYR !== undefined && item.thirdYearFeeMYR !== null ? Number(item.thirdYearFeeMYR) : undefined;
      const y4 = item.fourthYearFeeMYR !== undefined && item.fourthYearFeeMYR !== null ? Number(item.fourthYearFeeMYR) : undefined;
      const yearlyTotal = (y1 || 0) + (y2 || 0) + (y3 || 0) + (y4 || 0);
      let statedTuition = Number(item.tuitionMYR) || 0;

      // Smart auto-fix: If tuition is 0 or missing, compute from yearly total
      if (statedTuition === 0 && yearlyTotal > 0) {
        statedTuition = yearlyTotal;
      }

      // Detect if this program already exists:
      // Check 1: direct ID match (from exported CSV)
      // Check 2: same university + same title match
      let existingProgramId: string | undefined;
      if (item.id && existingById.has(item.id.trim())) {
        existingProgramId = item.id.trim();
      } else {
        const lookupKey = `${matchedUni.id}_${title.toLowerCase()}`;
        const found = existingByUniAndTitle.get(lookupKey);
        if (found) {
          existingProgramId = found.id;
        }
      }

      preparedPrograms.push({
        item: {
          ...item,
          tuitionMYR: statedTuition,
        },
        universityId: matchedUni.id,
        rowNumber: rowNum,
        existingProgramId,
      });
    }

    if (errors.length > 0 && !allowPartial) {
      return NextResponse.json(
        { 
          error: `Import validation failed with ${errors.length} issue(s). No records were modified. Fix issues or use "Import Valid Only".`,
          errors,
          validCount: preparedPrograms.length,
          totalCount: programs.length
        },
        { status: 400 }
      );
    }

    if (preparedPrograms.length === 0) {
      return NextResponse.json(
        { error: 'No valid programs to process.', errors },
        { status: 400 }
      );
    }

    // Process all prepared programs in a single database transaction
    const result = await db.$transaction(async (transaction) => {
      let createdCount = 0;
      let updatedCount = 0;
      const touchedProgramSlugs: string[] = [];

      for (const { item, universityId, rowNumber, existingProgramId } of preparedPrograms) {
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

        if (existingProgramId) {
          // UPDATE existing program
          await transaction.semesterSchedule.deleteMany({
            where: { programId: existingProgramId },
          });

          const updated = await transaction.program.update({
            where: { id: existingProgramId },
            data: {
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
          updatedCount++;
          touchedProgramSlugs.push(updated.slug);
        } else {
          // CREATE new program
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
          createdCount++;
          touchedProgramSlugs.push(created.slug);
        }
      }

      await transaction.auditLog.create({
        data: {
          title: `Bulk Sync: ${createdCount} Created, ${updatedCount} Updated`,
          action: 'BATCH_IMPORT',
          target: `${createdCount + updatedCount} Program Records`,
          details: `Smart Upsert executed via Bulk Uploader. Created: ${createdCount}, Updated: ${updatedCount}.`,
        },
      });

      return { createdCount, updatedCount };
    });

    return NextResponse.json({
      success: true,
      importedCount: result.createdCount + result.updatedCount,
      createdCount: result.createdCount,
      updatedCount: result.updatedCount,
      skippedCount: programs.length - (result.createdCount + result.updatedCount),
      errors,
    });
  } catch (error: any) {
    console.error('Bulk upload server error:', error);
    return NextResponse.json({ error: error.message || 'Server error processing bulk upload' }, { status: 500 });
  }
}
