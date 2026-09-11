import { EmgsFeeItem, AuditLogItem } from '../types';
import { UNIVERSITIES_DATA } from './universitiesData';
import { PROGRAMS_DATA } from './programsData';

export { UNIVERSITIES_DATA, PROGRAMS_DATA };

export const EMGS_FEES_SCHEDULE: EmgsFeeItem[] = [
  {
    id: 'emgs-1',
    title: 'EMGS Application & Processing Fee',
    category: 'Administrative',
    publicMYR: 1000,
    privateMYR: 1500,
    mandatory: true,
    notes: 'Statutory fee payable directly to Education Malaysia Global Services'
  },
  {
    id: 'emgs-2',
    title: 'Visa Approval Letter (VAL) Processing',
    category: 'Immigration',
    publicMYR: 300,
    privateMYR: 300,
    mandatory: true,
    notes: 'Immigration Department of Malaysia processing charge'
  },
  {
    id: 'emgs-3',
    title: 'Annual Health Insurance (AXA / AIA / Great Eastern)',
    category: 'Medical',
    publicMYR: 800,
    privateMYR: 850,
    mandatory: true,
    notes: 'Hospitalization, surgical & emergency outpatient coverage per year'
  },
  {
    id: 'emgs-4',
    title: 'Post-Arrival Medical Screening',
    category: 'Medical',
    publicMYR: 250,
    privateMYR: 250,
    mandatory: true,
    notes: 'Mandatory in-clinic screening within 7 days of entering Malaysia'
  },
  {
    id: 'emgs-5',
    title: 'Student Pass Sticker & Multiple Entry Visa (MEV)',
    category: 'Immigration',
    publicMYR: 120,
    privateMYR: 120,
    mandatory: true,
    notes: 'Endorsed directly into passport upon arrival clearance'
  },
  {
    id: 'emgs-6',
    title: 'I-Kad (Smart Student Identification Card)',
    category: 'Identification',
    publicMYR: 100,
    privateMYR: 100,
    mandatory: true,
    notes: 'Biometric identification card for international students in Malaysia'
  },
  {
    id: 'emgs-7',
    title: 'Annual Student Pass Renewal',
    category: 'Immigration',
    publicMYR: 140,
    privateMYR: 140,
    mandatory: true,
    notes: 'Required for multi-year degrees before end of 12-month period'
  },
  {
    id: 'emgs-8',
    title: 'Dependent Pass Processing (Per Person / Spouse / Child)',
    category: 'Dependent',
    publicMYR: 500,
    privateMYR: 500,
    mandatory: false,
    notes: 'Applicable for postgraduate Master/PhD students bringing dependents'
  },
  {
    id: 'emgs-9',
    title: 'Special Pass (Overstay / Flight Extension if needed)',
    category: 'Immigration',
    publicMYR: 150,
    privateMYR: 150,
    mandatory: false,
    notes: 'Issued if student entry timing requires interim visa regularization'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'audit-1',
    title: "Lincoln University College Fee Sync",
    description: 'Updated 2026 fee structure: EMGS RM 3,500 + Registration & Admin RM 6,000 + Bond RM 1,500 = Total RM 11,000.',
    timeAgo: '10m ago',
    category: 'EMGS & Misc Package',
    verifiedBy: 'Meezab Admissions Team',
    initials: 'MZ',
    type: 'user'
  },
  {
    id: 'audit-2',
    title: 'APU Stage 1 & Stage 2 Visa Sync',
    description: 'Stage 1 EMGS RM 3,400 + Stage 2 RM 2,000 + Admin & Bond RM 6,500 (Total RM 11,900) verified.',
    timeAgo: '25m ago',
    category: 'Fee Structure',
    verifiedBy: 'Verified by Admin',
    initials: 'AP',
    type: 'user'
  },
  {
    id: 'audit-3',
    title: 'UCSI 2026 International Schedule Integrated',
    description: 'Undergraduate Initial RM 10,566 / Postgraduate RM 11,596 updated with 6% SST notes.',
    timeAgo: '1hr ago',
    category: 'Fee Structure',
    verifiedBy: 'Verified by Sarah K.',
    initials: 'SK',
    type: 'user'
  },
  {
    id: 'audit-4',
    title: 'ALFA & IUC Budget Postgraduate Tracks Added',
    description: 'IUC PhD in Management (RM 19,980) and ALFA MBA (RM 27,500) integrated for Pakistani students.',
    timeAgo: '3hrs ago',
    category: 'Program Entry',
    verifiedBy: 'Admissions Director',
    initials: 'AD',
    type: 'system'
  }
];
