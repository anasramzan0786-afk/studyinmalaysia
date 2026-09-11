export type TabType = 'program-search' | 'university-fees' | 'emgs-visa' | 'admin-entry';

export type DegreeLevel = 'Foundation / Diploma' | "Bachelor's Degree" | "Master's (Postgraduate)" | "Ph.D & Doctorate";

export type UniversityType = 'Public Research' | 'Private Premier' | 'International Branch';

export interface Program {
  id: string;
  title: string;
  universityId: string;
  universityName: string;
  universityLogo: string;
  location: string;
  degreeLevel: DegreeLevel;
  badgeType?: 'verified' | 'flagship' | 'australian' | 'qs300' | 'topuk';
  badgeText: string;
  duration: string;
  intakeMonths: string[];
  scholarship: string;
  tuitionMYR: number;
  tuitionUSD: number;
  faculty: string;
  description: string;
  requirements: {
    academic: string;
    english: string;
    minGpa: string;
    documents: string[];
  };
  semesterSchedule: {
    semester: string;
    tuitionMYR: number;
    miscMYR: number;
  }[];
  bookmarked?: boolean;
  // Official EMGS & Miscellaneous Initial fees for Pakistani / International students
  emgsFeeMYR?: number;
  miscFeesMYR?: number;
  totalInitialMYR?: number;
  miscBreakdown?: string;
  pakistanNotes?: string;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  type: UniversityType;
  qsRank: string;
  location: string;
  image: string;
  logo: string;
  tuitionBachelor: string;
  tuitionMaster: string;
  tuitionPhd: string;
  hostelMonthly: string;
  emgsYearly: string;
  avgTuition3Yr: number;
  registrationDeposit: number;
  livingCostTier: 'Low-Mod' | 'Moderate' | 'High';
  livingCostMonthly: number;
  description: string;
  highlights: string[];
  intakeMonths: string;
  emgsFeeMYR?: number;
  miscFeesMYR?: number;
  totalInitialMYR?: number;
  initialBreakdownNotes?: string;
}

export interface EmgsFeeItem {
  id: string;
  title: string;
  category: 'Administrative' | 'Immigration' | 'Medical' | 'Identification' | 'Dependent';
  publicMYR: number;
  privateMYR: number;
  mandatory: boolean;
  notes?: string;
}

export interface AuditLogItem {
  id: string;
  title: string;
  description?: string;
  timeAgo: string;
  category?: string;
  verifiedBy?: string;
  initials?: string;
  type?: 'user' | 'system';
  user?: string;
  action?: string;
  target?: string;
  details?: string;
  timestamp?: string;
}

export interface VisaCalculationSettings {
  instType: 'public' | 'private';
  durationYears: number;
  insuranceTier: 'standard' | 'premium';
  dependentsCount: number;
  expeditedProcessing?: boolean;
}
