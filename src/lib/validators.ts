import { z } from 'zod';

export const UniversitySchema = z.object({
  name: z.string().min(2, 'University name is required'),
  shortName: z.string().min(1, 'Short name is required'),
  type: z.enum(['Public Research', 'Private Premier', 'International Branch']),
  qsRank: z.string().optional().nullable(),
  location: z.string().min(2, 'Location is required'),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  image: z.string().url().optional().or(z.literal('')),
  logo: z.string().url().optional().or(z.literal('')),
  tuitionBachelor: z.string().optional().nullable(),
  tuitionMaster: z.string().optional().nullable(),
  tuitionPhd: z.string().optional().nullable(),
  hostelMonthly: z.string().optional().nullable(),
  emgsYearly: z.string().optional().nullable(),
  avgTuition3Yr: z.number().optional().nullable(),
  registrationDeposit: z.number().optional().nullable(),
  livingCostTier: z.enum(['Low-Mod', 'Moderate', 'High']).optional().nullable(),
  livingCostMonthly: z.number().optional().nullable(),
  description: z.string().optional().nullable(),
  highlights: z.array(z.string()).optional().nullable(),
  intakeMonths: z.string().optional().nullable(),
  emgsFeeMYR: z.number().optional().nullable(),
  miscFeesMYR: z.number().optional().nullable(),
  totalInitialMYR: z.number().optional().nullable(),
  initialBreakdownNotes: z.string().optional().nullable(),
  websiteUrl: z.string().url().optional().or(z.literal('')),
});

export const ProgramSchema = z.object({
  title: z.string().min(2, 'Program title is required'),
  universityId: z.string().min(1, 'University selection is required'),
  degreeLevel: z.string().min(1, 'Degree level is required'),
  faculty: z.string().min(2, 'Faculty is required'),
  badgeType: z.enum(['verified', 'flagship', 'australian', 'qs300', 'topuk']).optional().nullable(),
  badgeText: z.string().optional().nullable(),
  duration: z.string().min(1, 'Duration is required'),
  durationYears: z.number().optional().nullable(),
  intakeMonths: z.string().min(1, 'Intake months are required'),
  scholarship: z.string().optional().nullable(),
  tuitionMYR: z.number().min(0, 'Tuition must be a non-negative number'),
  firstYearFeeMYR: z.number().nonnegative().optional().nullable(),
  secondYearFeeMYR: z.number().nonnegative().optional().nullable(),
  thirdYearFeeMYR: z.number().nonnegative().optional().nullable(),
  fourthYearFeeMYR: z.number().nonnegative().optional().nullable(),
  emgsFeeMYR: z.number().nonnegative().optional().nullable(),
  miscFeesMYR: z.number().nonnegative().optional().nullable(),
  totalInitialMYR: z.number().nonnegative().optional().nullable(),
  miscBreakdown: z.string().optional().nullable(),
  pakistanNotes: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  academicReq: z.string().optional().nullable(),
  englishReq: z.string().optional().nullable(),
  minGpa: z.string().optional().nullable(),
  documentsReq: z.array(z.string()).optional().nullable(),
}).superRefine((program, context) => {
  const yearlyTotal =
    (program.firstYearFeeMYR || 0) +
    (program.secondYearFeeMYR || 0) +
    (program.thirdYearFeeMYR || 0) +
    (program.fourthYearFeeMYR || 0);

  if (yearlyTotal > 0 && program.tuitionMYR > 0 && Math.abs(yearlyTotal - program.tuitionMYR) > 1) {
    context.addIssue({
      code: 'custom',
      path: ['tuitionMYR'],
      message: 'Total tuition must equal the sum of the yearly fees.',
    });
  }
});

export const InquirySchema = z.object({
  studentName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(3, 'WhatsApp / Phone number is required'),
  email: z.string().email().optional().or(z.literal('')),
  city: z.string().optional().nullable(),
  qualification: z.string().optional().nullable(),
  programInterest: z.string().optional().nullable(),
  programId: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type UserRole = 'ADMIN' | 'COUNSELOR';

export function normalizeRole(value: unknown): UserRole | null {
  if (value === 'ADMIN' || value === 'COUNSELOR') {
    return value;
  }

  return null;
}

export function validateUserPayload(payload: {
  name?: unknown;
  email?: unknown;
  password?: unknown;
  role?: unknown;
}) {
  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const password = typeof payload.password === 'string' ? payload.password.trim() : '';
  const normalizedRole = normalizeRole(payload.role) ?? 'COUNSELOR';

  if (name.length < 2) {
    throw new Error('User name must be at least 2 characters long.');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('A valid email address is required.');
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }

  return {
    name,
    email,
    password,
    role: normalizedRole,
  };
}

export const BulkProgramRowSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  universityName: z.string().min(1, 'University Name is required'),
  degreeLevel: z.string().min(1, 'Degree Level is required'),
  faculty: z.string().default('General'),
  duration: z.string().default('3 Years'),
  intakeMonths: z.string().default('January, May, September'),
  tuitionMYR: z.coerce.number().default(0),
  emgsFeeMYR: z.coerce.number().default(3500),
  miscFeesMYR: z.coerce.number().default(6000),
  totalInitialMYR: z.coerce.number().default(9500),
  scholarship: z.string().optional(),
  academicReq: z.string().optional(),
  englishReq: z.string().optional(),
});

