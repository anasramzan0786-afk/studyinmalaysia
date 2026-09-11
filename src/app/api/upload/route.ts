import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slugify } from '@/lib/utils';

interface BulkProgramInput {
  title: string;
  universityName: string;
  degreeLevel: string;
  faculty?: string;
  duration?: string;
  intakeMonths?: string;
  tuitionMYR: number;
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

      const tuition = Number(item.tuitionMYR) || 0;
      const emgs = Number(item.emgsFeeMYR) || 3500;
      const misc = Number(item.miscFeesMYR) || 6000;
      const initial = Number(item.totalInitialMYR) || (emgs + misc);

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
            durationYears: 3,
            intakeMonths: item.intakeMonths || 'January, May, September',
            scholarship: item.scholarship || 'Standard Pricing',
            tuitionMYR: tuition,
            tuitionUSD: Math.round(tuition / 4.45),
            emgsFeeMYR: emgs,
            miscFeesMYR: misc,
            totalInitialMYR: initial,
            academicReq: item.academicReq || 'Standard academic entry requirements apply.',
            englishReq: item.englishReq || 'IELTS 5.5 - 6.0 or English placement certificate.',
            pakistanNotes: item.pakistanNotes || `Upfront initial package: RM ${initial.toLocaleString()}.`,
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

