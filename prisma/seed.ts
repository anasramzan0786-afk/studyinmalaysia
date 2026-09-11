import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { UNIVERSITIES_DATA } from '../src/data/universitiesData';
import { PROGRAMS_DATA } from '../src/data/programsData';

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

async function main() {
  console.log('🌱 Starting Database Seed...');

  // 1. Clear existing records safely
  await prisma.inquiry.deleteMany();
  await prisma.semesterSchedule.deleteMany();
  await prisma.program.deleteMany();
  await prisma.university.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Existing data wiped cleanly.');

  // 1.5. Seed Default Users with bcrypt hashed passwords
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedCounselorPassword = await bcrypt.hash('counselor123', 10);

  await prisma.user.createMany({
    data: [
      {
        email: 'admin@meezab.com',
        name: 'Meezab Administrator',
        password: hashedAdminPassword,
        role: 'ADMIN',
        active: true,
      },
      {
        email: 'counselor@meezab.com',
        name: 'Meezab Admissions Counselor',
        password: hashedCounselorPassword,
        role: 'COUNSELOR',
        active: true,
      },
    ],
  });

  console.log('🔐 Default Admin & Counselor users seeded into Supabase.');

  // 2. Map of original university ID to new DB university ID
  const uniIdMap = new Map<string, string>();

  for (const uni of UNIVERSITIES_DATA) {
    const slug = slugify(uni.shortName || uni.name);
    const createdUni = await prisma.university.create({
      data: {
        slug: slug,
        name: uni.name,
        shortName: uni.shortName || uni.name,
        type: uni.type,
        qsRank: uni.qsRank,
        location: uni.location,
        image: uni.image,
        logo: uni.logo,
        tuitionBachelor: uni.tuitionBachelor,
        tuitionMaster: uni.tuitionMaster,
        tuitionPhd: uni.tuitionPhd,
        hostelMonthly: uni.hostelMonthly,
        emgsYearly: uni.emgsYearly,
        avgTuition3Yr: uni.avgTuition3Yr,
        registrationDeposit: uni.registrationDeposit,
        livingCostTier: uni.livingCostTier,
        livingCostMonthly: uni.livingCostMonthly,
        description: uni.description,
        highlights: JSON.stringify(uni.highlights || []),
        intakeMonths: uni.intakeMonths,
        emgsFeeMYR: uni.emgsFeeMYR,
        miscFeesMYR: uni.miscFeesMYR,
        totalInitialMYR: uni.totalInitialMYR,
        initialBreakdownNotes: uni.initialBreakdownNotes,
        featured: ['lincoln', 'apu', 'ucsi'].includes(uni.id),
      },
    });

    uniIdMap.set(uni.id, createdUni.id);
    uniIdMap.set(uni.name.toLowerCase(), createdUni.id);
  }

  console.log(`✅ Seeded ${UNIVERSITIES_DATA.length} Universities.`);

  // 3. Seed Programs
  let programCount = 0;
  for (const prog of PROGRAMS_DATA) {
    // Lookup matching university ID
    let mappedUniId = uniIdMap.get(prog.universityId);
    if (!mappedUniId) {
      mappedUniId = uniIdMap.get(prog.universityName.toLowerCase());
    }
    // Fallback: search by name
    if (!mappedUniId) {
      const found = Array.from(uniIdMap.entries()).find(([key]) =>
        prog.universityName.toLowerCase().includes(key.toLowerCase())
      );
      if (found) mappedUniId = found[1];
    }

    if (!mappedUniId) {
      // If still not found, link to the first university
      mappedUniId = Array.from(uniIdMap.values())[0];
    }

    const uniqueSlug = `${slugify(prog.title)}-${prog.id}`;

    await prisma.program.create({
      data: {
        slug: uniqueSlug,
        title: prog.title,
        universityId: mappedUniId,
        degreeLevel: prog.degreeLevel,
        faculty: prog.faculty,
        badgeType: prog.badgeType,
        badgeText: prog.badgeText,
        duration: prog.duration,
        intakeMonths: Array.isArray(prog.intakeMonths)
          ? prog.intakeMonths.join(', ')
          : String(prog.intakeMonths || 'January, May, September'),
        scholarship: prog.scholarship,
        tuitionMYR: prog.tuitionMYR,
        tuitionUSD: prog.tuitionUSD,
        emgsFeeMYR: prog.emgsFeeMYR || 3500,
        miscFeesMYR: prog.miscFeesMYR || 6000,
        totalInitialMYR: prog.totalInitialMYR || 9500,
        miscBreakdown: prog.miscBreakdown,
        pakistanNotes: prog.pakistanNotes,
        description: prog.description,
        academicReq: prog.requirements?.academic,
        englishReq: prog.requirements?.english,
        minGpa: prog.requirements?.minGpa,
        documentsReq: JSON.stringify(prog.requirements?.documents || []),
        featured: Boolean(prog.badgeType),
        semesterSchedules: {
          create: (prog.semesterSchedule || []).map((sem) => ({
            semester: sem.semester,
            tuitionMYR: sem.tuitionMYR,
            miscMYR: sem.miscMYR,
          })),
        },
      },
    });
    programCount++;
  }

  console.log(`✅ Seeded ${programCount} Programs with complete fee schedules.`);

  // 4. Initial Audit Log
  await prisma.auditLog.create({
    data: {
      title: 'Initial Database Seed Completed',
      action: 'BATCH_IMPORT',
      target: 'Entire Catalog',
      details: `Initialized database with ${UNIVERSITIES_DATA.length} universities and ${programCount} programs.`,
    },
  });

  console.log('🚀 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

