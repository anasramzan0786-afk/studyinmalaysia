import { Program } from '../types';

export const PROGRAMS_DATA: Program[] = [
  // ==================== LINCOLN UNIVERSITY COLLEGE (LUC) ====================
  {
    id: 'luc-md-1',
    title: 'Doctor of Medicine (MD) - 5 Years Full Course',
    universityId: 'lincoln',
    universityName: 'Lincoln University College (LUC)',
    universityLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVmpFbiGR3zk5YkmJnpg8hmiNYdgPKB5QSGacVccI8rGonNfJ2ti1bJgkfmvfDmvMaig6rL1bMr3j-hVIwpSV1an0nDvT4rrDaKXb-3U7sRtUL4FA7laLIhQ0IY9b-pOLgXQt9O9MOo8TqHDCOcm_Qg8TLb6kYGyHrHScodiye6BjhqSOO9MFlDAGPJb3GHaQkW7DuG3vvMbBvGnmzMX_LPlc9NNUqL5C1jxp8mnDmKE-3xMApVzw',
    location: 'Petaling Jaya, Selangor',
    degreeLevel: "Bachelor's Degree",
    badgeType: 'verified',
    badgeText: 'WHO & PMDC Recognized',
    duration: '5 Years (Full-time)',
    intakeMonths: ['March', 'September'],
    scholarship: 'Affordable Clinical Track',
    tuitionMYR: 360000,
    tuitionUSD: 79100,
    faculty: 'Faculty of Medicine',
    description: 'Premier medical program with extensive clinical hospital rotations across Malaysia. 5-year full curriculum covers preclinical sciences, hospital clinical rotations, surgery, and pathology. Total tuition RM 360,000 (Year 1 RM 72,000).',
    requirements: {
      academic: 'FSc Pre-Medical: Minimum 70% or B grades in Biology, Chemistry, and Physics; or A-Levels BBB in Bio, Chem, Physics/Math.',
      english: 'IELTS 6.0 overall (minimum 5.5 in each component) or TOEFL iBT 60.',
      minGpa: '3.00 / 70% FSc',
      documents: ['Matric & FSc Pre-Medical Transcripts', 'Passport Full Scan (all pages)', 'Medical Fitness Certificate', 'Passport Photo (White BG)']
    },
    semesterSchedule: [
      { semester: 'Year 1 (Tuition + Initial)', tuitionMYR: 72000, miscMYR: 11000 },
      { semester: 'Year 2 (Tuition + Visa)', tuitionMYR: 72000, miscMYR: 1600 },
      { semester: 'Year 3 (Tuition + Visa)', tuitionMYR: 72000, miscMYR: 1600 },
      { semester: 'Year 4 (Tuition + Visa)', tuitionMYR: 72000, miscMYR: 1600 },
      { semester: 'Year 5 (Tuition + Visa)', tuitionMYR: 72000, miscMYR: 1600 }
    ],
    emgsFeeMYR: 3500,
    miscFeesMYR: 7500,
    totalInitialMYR: 11000,
    miscBreakdown: 'EMGS & Visa Fee: RM 3,500 | Registration & Admin Fee: RM 6,000 | Security Bond: RM 1,500',
    pakistanNotes: 'Total initial non-tuition payment is RM 11,000. Subsequent year visa renewal is RM 1,600.'
  },
  {
    id: 'luc-cs-2',
    title: 'Bachelor of Computer Science (Hons) (Cyber Security & AI)',
    universityId: 'lincoln',
    universityName: 'Lincoln University College (LUC)',
    universityLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVmpFbiGR3zk5YkmJnpg8hmiNYdgPKB5QSGacVccI8rGonNfJ2ti1bJgkfmvfDmvMaig6rL1bMr3j-hVIwpSV1an0nDvT4rrDaKXb-3U7sRtUL4FA7laLIhQ0IY9b-pOLgXQt9O9MOo8TqHDCOcm_Qg8TLb6kYGyHrHScodiye6BjhqSOO9MFlDAGPJb3GHaQkW7DuG3vvMbBvGnmzMX_LPlc9NNUqL5C1jxp8mnDmKE-3xMApVzw',
    location: 'Petaling Jaya, Selangor',
    degreeLevel: "Bachelor's Degree",
    badgeType: 'verified',
    badgeText: 'MQA Full Accreditation',
    duration: '3 Years (Full-time)',
    intakeMonths: ['January', 'May', 'September'],
    scholarship: 'Merit Discount Available',
    tuitionMYR: 60000,
    tuitionUSD: 13180,
    faculty: 'Faculty of AI Computing and Multimedia',
    description: 'Hands-on curriculum focusing on ethical hacking, defensive security, network forensic analysis, machine learning pipelines, and cloud computing. Total program cost RM 74,200 (including all 3 years visa renewals & admin).',
    requirements: {
      academic: 'FSc (Pre-Engineering/ICS) / A-Levels / DAE with minimum 50% or C grade in Mathematics.',
      english: 'IELTS 5.5 or equivalent English placement certificate.',
      minGpa: '2.50 / 50%',
      documents: ['Intermediate / A-Level Marksheets', 'Passport Copy (All Pages)', 'White Background Photograph']
    },
    semesterSchedule: [
      { semester: 'Year 1', tuitionMYR: 20000, miscMYR: 11000 },
      { semester: 'Year 2', tuitionMYR: 20000, miscMYR: 1600 },
      { semester: 'Year 3', tuitionMYR: 20000, miscMYR: 1600 }
    ],
    emgsFeeMYR: 3500,
    miscFeesMYR: 7500,
    totalInitialMYR: 11000,
    miscBreakdown: 'EMGS & Visa Fee: RM 3,500 | Registration & Admin Fee: RM 6,000 | Security Bond: RM 1,500',
    pakistanNotes: 'Initial payment upon eVAL approval: RM 11,000 (EMGS + Admin + Bond) + Year 1 Sem 1 tuition.'
  },
  {
    id: 'luc-bba-3',
    title: 'Bachelor of Business Administration (Hons) in Accounting & Finance',
    universityId: 'lincoln',
    universityName: 'Lincoln University College (LUC)',
    universityLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVmpFbiGR3zk5YkmJnpg8hmiNYdgPKB5QSGacVccI8rGonNfJ2ti1bJgkfmvfDmvMaig6rL1bMr3j-hVIwpSV1an0nDvT4rrDaKXb-3U7sRtUL4FA7laLIhQ0IY9b-pOLgXQt9O9MOo8TqHDCOcm_Qg8TLb6kYGyHrHScodiye6BjhqSOO9MFlDAGPJb3GHaQkW7DuG3vvMbBvGnmzMX_LPlc9NNUqL5C1jxp8mnDmKE-3xMApVzw',
    location: 'Petaling Jaya, Selangor',
    degreeLevel: "Bachelor's Degree",
    badgeType: 'flagship',
    badgeText: 'MQA & ACCA Exemptions',
    duration: '3 Years (Full-time)',
    intakeMonths: ['January', 'May', 'September'],
    scholarship: 'Corporate Fee Waiver',
    tuitionMYR: 60000,
    tuitionUSD: 13180,
    faculty: 'Faculty of Business',
    description: 'Comprehensive business administration degree with specialized pathways in corporate financial management, forensic accounting, and managerial economics.',
    requirements: {
      academic: 'Intermediate (FA/FSc/I.Com) or A-Levels with at least 50% aggregate.',
      english: 'IELTS 5.5 or English medium certificate.',
      minGpa: '2.50 / 50%',
      documents: ['Matric & Inter Certificates', 'Valid Passport Scan', 'CV for mature students']
    },
    semesterSchedule: [
      { semester: 'Year 1', tuitionMYR: 20000, miscMYR: 11000 },
      { semester: 'Year 2', tuitionMYR: 20000, miscMYR: 1600 },
      { semester: 'Year 3', tuitionMYR: 20000, miscMYR: 1600 }
    ],
    emgsFeeMYR: 3500,
    miscFeesMYR: 7500,
    totalInitialMYR: 11000,
    miscBreakdown: 'EMGS Fee: RM 3,500 | Admin & Reg: RM 6,000 | Security Bond: RM 1,500',
    pakistanNotes: 'Total initial upfront non-tuition: RM 11,000. Annual visa renewal RM 1,600.'
  },
  {
    id: 'luc-mba-4',
    title: 'Master of Business Administration (MBA - Global Business)',
    universityId: 'lincoln',
    universityName: 'Lincoln University College (LUC)',
    universityLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVmpFbiGR3zk5YkmJnpg8hmiNYdgPKB5QSGacVccI8rGonNfJ2ti1bJgkfmvfDmvMaig6rL1bMr3j-hVIwpSV1an0nDvT4rrDaKXb-3U7sRtUL4FA7laLIhQ0IY9b-pOLgXQt9O9MOo8TqHDCOcm_Qg8TLb6kYGyHrHScodiye6BjhqSOO9MFlDAGPJb3GHaQkW7DuG3vvMbBvGnmzMX_LPlc9NNUqL5C1jxp8mnDmKE-3xMApVzw',
    location: 'Petaling Jaya, Selangor',
    degreeLevel: "Master's (Postgraduate)",
    badgeType: 'verified',
    badgeText: 'Fast-Track 1.5 Years',
    duration: '1.5 Years (Full-time)',
    intakeMonths: ['January', 'May', 'September'],
    scholarship: 'Special Regional Grant',
    tuitionMYR: 40000,
    tuitionUSD: 8790,
    faculty: 'Faculty of Business',
    description: 'Designed for working professionals and aspiring executives. Covers international trade, strategic corporate finance, digital leadership, and operations management. Total program cost RM 52,600.',
    requirements: {
      academic: 'Recognized Bachelor degree (16-year education from HEC recognized university) with minimum CGPA 2.50.',
      english: 'IELTS 6.0 or verified English instruction letter.',
      minGpa: '2.50 / 4.00',
      documents: ['HEC Attested Degree & Transcript', 'Letter of Intent', '2 Academic References', 'Passport Scan']
    },
    semesterSchedule: [
      { semester: 'Year 1', tuitionMYR: 26667, miscMYR: 11000 },
      { semester: 'Year 2 (0.5 yr)', tuitionMYR: 13333, miscMYR: 1600 }
    ],
    emgsFeeMYR: 3500,
    miscFeesMYR: 7500,
    totalInitialMYR: 11000,
    miscBreakdown: 'EMGS & Visa Processing: RM 3,500 | Registration & Admin: RM 6,000 | Security Bond: RM 1,500',
    pakistanNotes: 'Upfront non-tuition payment is RM 11,000. Postgraduate students settle initial + Sem 1 prior to departure.'
  },
  {
    id: 'luc-phd-5',
    title: 'Doctor of Philosophy (PhD) in Information Technology',
    universityId: 'lincoln',
    universityName: 'Lincoln University College (LUC)',
    universityLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVmpFbiGR3zk5YkmJnpg8hmiNYdgPKB5QSGacVccI8rGonNfJ2ti1bJgkfmvfDmvMaig6rL1bMr3j-hVIwpSV1an0nDvT4rrDaKXb-3U7sRtUL4FA7laLIhQ0IY9b-pOLgXQt9O9MOo8TqHDCOcm_Qg8TLb6kYGyHrHScodiye6BjhqSOO9MFlDAGPJb3GHaQkW7DuG3vvMbBvGnmzMX_LPlc9NNUqL5C1jxp8mnDmKE-3xMApVzw',
    location: 'Petaling Jaya, Selangor',
    degreeLevel: "Ph.D & Doctorate",
    badgeType: 'verified',
    badgeText: 'MQA Research Level 8',
    duration: '3 Years (Research)',
    intakeMonths: ['Every Month (Rolling Intakes)'],
    scholarship: 'Research Supervisor Grant',
    tuitionMYR: 60000,
    tuitionUSD: 13180,
    faculty: 'Faculty of AI Computing and Multimedia',
    description: 'Doctoral research degree enabling publication in Scopus-indexed journals and cutting-edge thesis defense. Total program cost RM 74,200.',
    requirements: {
      academic: 'Recognized Master Degree (MS/MPhil 18 years) in Computing/IT with CGPA 3.0+ from HEC recognized university.',
      english: 'IELTS 6.0 or proof of English medium Master degree.',
      minGpa: '3.00 / 4.00',
      documents: ['Master Degree & Transcripts', 'Research Proposal (1,500-2,000 words)', '2 Recommendation Letters']
    },
    semesterSchedule: [
      { semester: 'Year 1', tuitionMYR: 20000, miscMYR: 11000 },
      { semester: 'Year 2', tuitionMYR: 20000, miscMYR: 1600 },
      { semester: 'Year 3', tuitionMYR: 20000, miscMYR: 1600 }
    ],
    emgsFeeMYR: 3500,
    miscFeesMYR: 7500,
    totalInitialMYR: 11000,
    miscBreakdown: 'EMGS Fee: RM 3,500 | Admin & Registration: RM 6,000 | Security Bond: RM 1,500',
    pakistanNotes: 'Initial EMGS & Misc fee: RM 11,000. Dependent visas allowed for spouse and children.'
  },

  // ==================== ASIA PACIFIC UNIVERSITY (APU) ====================
  {
    id: 'apu-ai-1',
    title: 'BSc (Hons) in Computer Science (Artificial Intelligence)',
    universityId: 'apu',
    universityName: 'Asia Pacific University (APU)',
    universityLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEW89PJ2U1EtFB0NbV7HXaYLspzLRijXQrRavCpeAdjNeMQ-kF1nVrzR6Wpnqt8gYkHG8lDlW_spA7aTqD5RUi2RghJqf0XWodcNhObv_im8omJ-6sFGm24jyfo6LaQudfaMp3elEiaEzbrB-OnM6CNh4qcYhnFFTRN8qptrewsxZEmFbbu098v2dsWHFIRZulx7qXPu_NfZwSD78NXhJ3KUMuL8ieHMdN6z5HfWVJx6DqGWQuJp4',
    location: 'Bukit Jalil, Kuala Lumpur',
    degreeLevel: "Bachelor's Degree",
    badgeType: 'topuk',
    badgeText: 'Dual Degree with DMU (UK)',
    duration: '3 Years (Full-time)',
    intakeMonths: ['January', 'May', 'September', 'November'],
    scholarship: 'Merit Scholarship 10-30%',
    tuitionMYR: 108500,
    tuitionUSD: 23840,
    faculty: 'School of Computing',
    description: 'Premier AI degree certified with UK Dual Awards from De Montfort University (Leicester, UK). Deep learning, neural networks, computer vision, natural language processing, and advanced robotics.',
    requirements: {
      academic: 'FSc (Pre-Engineering/ICS) with 60% or A-Levels with 2 C passes including Mathematics.',
      english: 'IELTS 5.5 or APU English Placement Test.',
      minGpa: '2.75 / 60%',
      documents: ['Intermediate / A-Level Certificates', 'Passport Scan', 'Passport Size Photos']
    },
    semesterSchedule: [
      { semester: 'Degree Level 1', tuitionMYR: 34900, miscMYR: 11900 },
      { semester: 'Degree Level 2', tuitionMYR: 36100, miscMYR: 1450 },
      { semester: 'Degree Level 3', tuitionMYR: 37500, miscMYR: 1450 }
    ],
    emgsFeeMYR: 5400,
    miscFeesMYR: 6500,
    totalInitialMYR: 11900,
    miscBreakdown: 'Stage 1 EMGS & Processing: RM 3,400 | Stage 2 Visa, i-Kad & Medical: RM 2,000 | Reg & Admin: RM 5,000 | Bond & Deposit: RM 1,500',
    pakistanNotes: 'Payable upon offer acceptance: Stage 1 EMGS (RM 3,400). Payable upon VAL approval: Stage 2 + Misc Fees (RM 8,500).'
  },
  {
    id: 'apu-cyber-2',
    title: 'BSc (Hons) in Computer Science (Cyber Security)',
    universityId: 'apu',
    universityName: 'Asia Pacific University (APU)',
    universityLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEW89PJ2U1EtFB0NbV7HXaYLspzLRijXQrRavCpeAdjNeMQ-kF1nVrzR6Wpnqt8gYkHG8lDlW_spA7aTqD5RUi2RghJqf0XWodcNhObv_im8omJ-6sFGm24jyfo6LaQudfaMp3elEiaEzbrB-OnM6CNh4qcYhnFFTRN8qptrewsxZEmFbbu098v2dsWHFIRZulx7qXPu_NfZwSD78NXhJ3KUMuL8ieHMdN6z5HfWVJx6DqGWQuJp4',
    location: 'Bukit Jalil, Kuala Lumpur',
    degreeLevel: "Bachelor's Degree",
    badgeType: 'topuk',
    badgeText: 'CyberSecurity Malaysia Partner',
    duration: '3 Years (Full-time)',
    intakeMonths: ['January', 'May', 'September', 'November'],
    scholarship: 'Tech Talent Grant',
    tuitionMYR: 108500,
    tuitionUSD: 23840,
    faculty: 'School of Technology & Cyber Security',
    description: 'Accredited cybersecurity program equipped with full Cyber Security Operations Centre (CSOC) on campus, simulating state-level attack defenses and penetration testing.',
    requirements: {
      academic: 'FSc (Pre-Engineering/ICS) with 60% or A-Levels with Mathematics credit.',
      english: 'IELTS 5.5 or equivalent.',
      minGpa: '2.75 / 60%',
      documents: ['Intermediate / A-Level Marksheet', 'Passport Full Scan']
    },
    semesterSchedule: [
      { semester: 'Degree Level 1', tuitionMYR: 34900, miscMYR: 11900 },
      { semester: 'Degree Level 2', tuitionMYR: 36100, miscMYR: 1450 },
      { semester: 'Degree Level 3', tuitionMYR: 37500, miscMYR: 1450 }
    ],
    emgsFeeMYR: 5400,
    miscFeesMYR: 6500,
    totalInitialMYR: 11900,
    miscBreakdown: 'EMGS Stage 1 (RM 3,400) + Stage 2 (RM 2,000) + Reg/Admin (RM 5,000) + Bond/Library (RM 1,500)',
    pakistanNotes: 'Includes airport transfer and reception in Malaysia. Total upfront arrival fee RM 11,900.'
  },
  {
    id: 'apu-msc-ai-3',
    title: 'Master of Science in Artificial Intelligence / Data Science',
    universityId: 'apu',
    universityName: 'Asia Pacific University (APU)',
    universityLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEW89PJ2U1EtFB0NbV7HXaYLspzLRijXQrRavCpeAdjNeMQ-kF1nVrzR6Wpnqt8gYkHG8lDlW_spA7aTqD5RUi2RghJqf0XWodcNhObv_im8omJ-6sFGm24jyfo6LaQudfaMp3elEiaEzbrB-OnM6CNh4qcYhnFFTRN8qptrewsxZEmFbbu098v2dsWHFIRZulx7qXPu_NfZwSD78NXhJ3KUMuL8ieHMdN6z5HfWVJx6DqGWQuJp4',
    location: 'Bukit Jalil, Kuala Lumpur',
    degreeLevel: "Master's (Postgraduate)",
    badgeType: 'topuk',
    badgeText: 'DMU UK Dual Award',
    duration: '1.5 Years (Full-time)',
    intakeMonths: ['January', 'April', 'July', 'October'],
    scholarship: 'Alumni & Merit Aid',
    tuitionMYR: 45800,
    tuitionUSD: 10065,
    faculty: 'Graduate School of Technology',
    description: 'Advanced postgraduate degree in AI, machine learning architectures, statistical learning, and big data engineering with DMU UK dual certificate.',
    requirements: {
      academic: 'Bachelor degree in Computing, IT, Engineering, or quantitative discipline with minimum CGPA 2.50.',
      english: 'IELTS 6.0 or proof of English medium Bachelor degree.',
      minGpa: '2.50 / 4.00',
      documents: ['HEC Attested Degree & Transcripts', 'Statement of Purpose', 'Passport Scan']
    },
    semesterSchedule: [
      { semester: 'Semester 1', tuitionMYR: 15920, miscMYR: 11900 },
      { semester: 'Semester 2', tuitionMYR: 15920, miscMYR: 0 },
      { semester: 'Semester 3', tuitionMYR: 15920, miscMYR: 1450 }
    ],
    emgsFeeMYR: 5400,
    miscFeesMYR: 6500,
    totalInitialMYR: 11900,
    miscBreakdown: 'EMGS Stage 1 (RM 3,400) + Stage 2 (RM 2,000) + Int. Registration & Admin (RM 5,000) + Personal Bond (RM 1,000) + Library (RM 500)',
    pakistanNotes: 'Full package covers all student pass issuance, eVAL, medical screening, and airport assistance.'
  },

  // ==================== UCSI UNIVERSITY ====================
  {
    id: 'ucsi-cs-1',
    title: 'Bachelor of Computer Science (Hons) in Artificial Intelligence',
    universityId: 'ucsi',
    universityName: 'UCSI University',
    universityLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVmpFbiGR3zk5YkmJnpg8hmiNYdgPKB5QSGacVccI8rGonNfJ2ti1bJgkfmvfDmvMaig6rL1bMr3j-hVIwpSV1an0nDvT4rrDaKXb-3U7sRtUL4FA7laLIhQ0IY9b-pOLgXQt9O9MOo8TqHDCOcm_Qg8TLb6kYGyHrHScodiye6BjhqSOO9MFlDAGPJb3GHaQkW7DuG3vvMbBvGnmzMX_LPlc9NNUqL5C1jxp8mnDmKE-3xMApVzw',
    location: 'Cheras, Kuala Lumpur',
    degreeLevel: "Bachelor's Degree",
    badgeType: 'qs300',
    badgeText: 'QS #300 Worldwide',
    duration: '3 Years (Full-time)',
    intakeMonths: ['January', 'May', 'September'],
    scholarship: 'Merit Scholarship Available',
    tuitionMYR: 102600,
    tuitionUSD: 22550,
    faculty: 'Institute of Computer Science and Digital Innovation',
    description: 'High-ranking computing degree recognized across the Commonwealth and global tech companies. Total fee RM 125,993 inclusive of university facilities and administration.',
    requirements: {
      academic: 'FSc (Pre-Eng/ICS) / A-Levels / DAE with minimum 60% or Grade C in Mathematics.',
      english: 'IELTS 5.5 or Cambridge English equivalent.',
      minGpa: '2.50 / 60%',
      documents: ['Intermediate / A-Level Certificates', 'Passport Scan', 'Application Fee slip']
    },
    semesterSchedule: [
      { semester: 'Year 1', tuitionMYR: 34432, miscMYR: 10566 },
      { semester: 'Year 2', tuitionMYR: 34846, miscMYR: 2010 },
      { semester: 'Year 3', tuitionMYR: 33322, miscMYR: 2010 }
    ],
    emgsFeeMYR: 4916,
    miscFeesMYR: 5650,
    totalInitialMYR: 10566,
    miscBreakdown: 'App Fees + Visa (EMGS): RM 4,916 | International Administration: RM 4,200 | Registration Fee: RM 450 | Refundable Deposit: RM 1,000',
    pakistanNotes: 'Total initial administration and visa payment: RM 10,566. Semester facilities fee ~RM 670/sem.'
  },
  {
    id: 'ucsi-pharm-2',
    title: 'Bachelor of Pharmacy (Hons) - 4 Years',
    universityId: 'ucsi',
    universityName: 'UCSI University',
    universityLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVmpFbiGR3zk5YkmJnpg8hmiNYdgPKB5QSGacVccI8rGonNfJ2ti1bJgkfmvfDmvMaig6rL1bMr3j-hVIwpSV1an0nDvT4rrDaKXb-3U7sRtUL4FA7laLIhQ0IY9b-pOLgXQt9O9MOo8TqHDCOcm_Qg8TLb6kYGyHrHScodiye6BjhqSOO9MFlDAGPJb3GHaQkW7DuG3vvMbBvGnmzMX_LPlc9NNUqL5C1jxp8mnDmKE-3xMApVzw',
    location: 'Cheras, Kuala Lumpur',
    degreeLevel: "Bachelor's Degree",
    badgeType: 'flagship',
    badgeText: 'Pharmacy Board Certified',
    duration: '4 Years (Full-time)',
    intakeMonths: ['January', 'September'],
    scholarship: 'Faculty Excellence Aid',
    tuitionMYR: 173862,
    tuitionUSD: 38200,
    faculty: 'Faculty of Pharmaceutical Sciences',
    description: 'Renowned professional pharmacy qualification with specialized labs, clinical patient care, hospital pharmacotherapy, and drug delivery systems. Total course cost RM 232,726 (including 8 semesters lab & facility fees).',
    requirements: {
      academic: 'FSc Pre-Medical: Minimum 65% with B in Chemistry and Biology; or A-Levels BBB in Chem, Bio, Physics/Math.',
      english: 'IELTS 6.0 (minimum 5.5 in each band).',
      minGpa: '3.00 / 65%',
      documents: ['Pre-Medical Transcripts', 'Passport Full Scan', 'Medical Health Declaration']
    },
    semesterSchedule: [
      { semester: 'Year 1', tuitionMYR: 44628, miscMYR: 10566 },
      { semester: 'Year 2', tuitionMYR: 43428, miscMYR: 2010 },
      { semester: 'Year 3', tuitionMYR: 43503, miscMYR: 2010 },
      { semester: 'Year 4', tuitionMYR: 42303, miscMYR: 2010 }
    ],
    emgsFeeMYR: 4916,
    miscFeesMYR: 5650,
    totalInitialMYR: 10566,
    miscBreakdown: 'App Fees + Visa (EMGS): RM 4,916 | International Administration: RM 4,200 | Registration Fee: RM 450 | Refundable Deposit: RM 1,000',
    pakistanNotes: 'Initial administration & visa total: RM 10,566. Pharmacy lab fees: RM 3,400/semester.'
  },

  // ==================== ALFA UNIVERSITY COLLEGE ====================
  {
    id: 'alfa-cs-1',
    title: 'Bachelor in Computer Science (Cyber Security & Networks)',
    universityId: 'alfa',
    universityName: 'ALFA University College',
    universityLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEW89PJ2U1EtFB0NbV7HXaYLspzLRijXQrRavCpeAdjNeMQ-kF1nVrzR6Wpnqt8gYkHG8lDlW_spA7aTqD5RUi2RghJqf0XWodcNhObv_im8omJ-6sFGm24jyfo6LaQudfaMp3elEiaEzbrB-OnM6CNh4qcYhnFFTRN8qptrewsxZEmFbbu098v2dsWHFIRZulx7qXPu_NfZwSD78NXhJ3KUMuL8ieHMdN6z5HfWVJx6DqGWQuJp4',
    location: 'Subang Jaya, Selangor',
    degreeLevel: "Bachelor's Degree",
    badgeType: 'verified',
    badgeText: 'Affordable Tech Hub',
    duration: '3 Years (Full-time)',
    intakeMonths: ['January', 'April', 'August', 'October'],
    scholarship: 'South Asia Fee Waiver',
    tuitionMYR: 48000,
    tuitionUSD: 10550,
    faculty: 'Faculty of Business, Management, Technology & Accounting',
    description: 'High value-for-money degree in networking and cyber protection. Resource fees RM 2,000. Year 1: RM 16,000, Year 2: RM 15,000, Year 3: RM 15,000.',
    requirements: {
      academic: 'FSc (Pre-Eng/ICS/General) with minimum 50% or A-Levels 2 passes.',
      english: 'IELTS 5.0 or university English course.',
      minGpa: '2.00 / 50%',
      documents: ['Intermediate Certificate', 'Passport Scan', 'White Background Photo']
    },
    semesterSchedule: [
      { semester: 'Year 1', tuitionMYR: 16000, miscMYR: 6000 },
      { semester: 'Year 2', tuitionMYR: 15000, miscMYR: 1000 },
      { semester: 'Year 3', tuitionMYR: 15000, miscMYR: 1000 }
    ],
    emgsFeeMYR: 3500,
    miscFeesMYR: 2500,
    totalInitialMYR: 6000,
    miscBreakdown: 'EMGS & Visa Processing Fee: RM 3,500 | Registration Fee: RM 1,000 | International Student Fee: RM 1,500',
    pakistanNotes: 'One of the lowest upfront arrival fees in Malaysia: RM 6,000 total initial package. Visa renewal is RM 1,000/yr.'
  },
  {
    id: 'alfa-mba-2',
    title: 'Master of Business Administration (MBA - Coursework)',
    universityId: 'alfa',
    universityName: 'ALFA University College',
    universityLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEW89PJ2U1EtFB0NbV7HXaYLspzLRijXQrRavCpeAdjNeMQ-kF1nVrzR6Wpnqt8gYkHG8lDlW_spA7aTqD5RUi2RghJqf0XWodcNhObv_im8omJ-6sFGm24jyfo6LaQudfaMp3elEiaEzbrB-OnM6CNh4qcYhnFFTRN8qptrewsxZEmFbbu098v2dsWHFIRZulx7qXPu_NfZwSD78NXhJ3KUMuL8ieHMdN6z5HfWVJx6DqGWQuJp4',
    location: 'Subang Jaya, Selangor',
    degreeLevel: "Master's (Postgraduate)",
    badgeType: 'verified',
    badgeText: 'Low Tuition MBA',
    duration: '1.3 Years (Full-time)',
    intakeMonths: ['January', 'April', 'August', 'October'],
    scholarship: 'Flexible Installments',
    tuitionMYR: 27500,
    tuitionUSD: 6040,
    faculty: 'Faculty of Business',
    description: 'MQA-accredited MBA covering international management, marketing, financial reporting, and entrepreneurship. Resource fee RM 1,500. Total tuition RM 27,500.',
    requirements: {
      academic: 'Bachelor degree (16 years education) with minimum CGPA 2.50.',
      english: 'IELTS 6.0 or English medium verification letter.',
      minGpa: '2.50 / 4.00',
      documents: ['Bachelor Degree & Transcript', 'Passport Full Scan', 'CV']
    },
    semesterSchedule: [
      { semester: 'Year 1', tuitionMYR: 13500, miscMYR: 6000 },
      { semester: 'Year 2 (4 months)', tuitionMYR: 12500, miscMYR: 1000 }
    ],
    emgsFeeMYR: 3500,
    miscFeesMYR: 2500,
    totalInitialMYR: 6000,
    miscBreakdown: 'EMGS and Visa Processing: RM 3,500 | Registration: RM 1,000 | International Student Fee: RM 1,500',
    pakistanNotes: 'Total initial non-tuition fees: RM 6,000. Low total program cost ideal for Pakistani postgraduate applicants.'
  },

  // ==================== INNOVATIVE UNIVERSITY COLLEGE (IUC) ====================
  {
    id: 'iuc-phd-1',
    title: 'Doctor of Philosophy (PhD) in Management',
    universityId: 'iuc',
    universityName: 'Innovative University College (IUC)',
    universityLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnKvybNSWi1NrP1Kq2CKTd_EyOrEX9_YdBWJi0GFtITF7a7z1Cej18n0s48VZFV13T-sHrrEkJER4VqTWCV-pD4aXtSD-wUcbyFB5h8DTe9RFxZpCxjoRN542Xbn5iupiq8xUgHbV29CpLeCn6Hqfnahu2dhmmNvz43ubd7ccUXStqaIVhNYNYG1rrKziYDvfXynkFPFrIaO40Qw6I461g_FREroSC9YABzsdJPub1IH0xzMXE5gc',
    location: 'Kelana Jaya, Petaling Jaya',
    degreeLevel: "Ph.D & Doctorate",
    badgeType: 'verified',
    badgeText: 'Lowest PhD Tuition RM 19,980',
    duration: '3 Years (Full-time)',
    intakeMonths: ['January', 'April', 'July', 'October'],
    scholarship: 'Lumpsum Discount Option',
    tuitionMYR: 19980,
    tuitionUSD: 4390,
    faculty: 'School of Postgraduate Studies',
    description: 'The most cost-effective doctoral program in Malaysia. Total tuition is only RM 19,980 for the entire 3 years (payable RM 6,660 per year or RM 19,980 lumpsum). Includes research methodology and supervisor guidance.',
    requirements: {
      academic: 'Recognized Master Degree (MS/MPhil 18 years) in Management, Business, or related discipline.',
      english: 'IELTS 6.0 or proof of English medium education.',
      minGpa: '2.75 / 4.00',
      documents: ['Master Degree & Transcripts', 'Research Proposal Brief', 'Passport Scan', 'Academic CV']
    },
    semesterSchedule: [
      { semester: 'Year 1', tuitionMYR: 6660, miscMYR: 7950 },
      { semester: 'Year 2', tuitionMYR: 6660, miscMYR: 1200 },
      { semester: 'Year 3', tuitionMYR: 6660, miscMYR: 1200 }
    ],
    emgsFeeMYR: 3200,
    miscFeesMYR: 4750,
    totalInitialMYR: 7950,
    miscBreakdown: 'EMGS & Visa Processing: RM 3,200 | Registration Fee: RM 4,000 | Application Fee: RM 500 | Airport Transfer: RM 250',
    pakistanNotes: 'Total initial arrival fees: RM 7,950. Highly favored by Pakistani lecturers, managers, and researchers seeking recognized PhD credentials.'
  },
  {
    id: 'iuc-bba-2',
    title: 'Bachelor of Business Administration with Honours',
    universityId: 'iuc',
    universityName: 'Innovative University College (IUC)',
    universityLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnKvybNSWi1NrP1Kq2CKTd_EyOrEX9_YdBWJi0GFtITF7a7z1Cej18n0s48VZFV13T-sHrrEkJER4VqTWCV-pD4aXtSD-wUcbyFB5h8DTe9RFxZpCxjoRN542Xbn5iupiq8xUgHbV29CpLeCn6Hqfnahu2dhmmNvz43ubd7ccUXStqaIVhNYNYG1rrKziYDvfXynkFPFrIaO40Qw6I461g_FREroSC9YABzsdJPub1IH0xzMXE5gc',
    location: 'Kelana Jaya, Petaling Jaya',
    degreeLevel: "Bachelor's Degree",
    badgeType: 'verified',
    badgeText: 'Total Tuition RM 28,000',
    duration: '3 Years (Full-time)',
    intakeMonths: ['January', 'April', 'July', 'October'],
    scholarship: 'Affordable Fixed Rate',
    tuitionMYR: 28000,
    tuitionUSD: 6150,
    faculty: 'School of Business',
    description: 'Affordable 3-year bachelor degree with practical business management curriculum. Year 1: RM 10,000, Year 2: RM 9,000, Year 3: RM 9,000. Total tuition RM 28,000.',
    requirements: {
      academic: 'Intermediate (FA/FSc/I.Com) or A-Levels with at least 50% marks.',
      english: 'IELTS 5.5 or English assessment.',
      minGpa: '2.00 / 50%',
      documents: ['Intermediate Certificate', 'Passport Scan', 'Photographs']
    },
    semesterSchedule: [
      { semester: 'Year 1', tuitionMYR: 10000, miscMYR: 7950 },
      { semester: 'Year 2', tuitionMYR: 9000, miscMYR: 1200 },
      { semester: 'Year 3', tuitionMYR: 9000, miscMYR: 1200 }
    ],
    emgsFeeMYR: 3200,
    miscFeesMYR: 4750,
    totalInitialMYR: 7950,
    miscBreakdown: 'EMGS & Visa Processing: RM 3,200 | Registration Fee: RM 4,000 | Application Fee: RM 500 | Airport Transfer: RM 250',
    pakistanNotes: 'Initial fees upon acceptance: RM 7,950. Annual visa renewal RM 1,200.'
  },

  // ==================== INTI INTERNATIONAL UNIVERSITY ====================
  {
    id: 'inti-cs-1',
    title: 'Bachelor of Computer Science (Hons)',
    universityId: 'inti',
    universityName: 'INTI International University',
    universityLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnKvybNSWi1NrP1Kq2CKTd_EyOrEX9_YdBWJi0GFtITF7a7z1Cej18n0s48VZFV13T-sHrrEkJER4VqTWCV-pD4aXtSD-wUcbyFB5h8DTe9RFxZpCxjoRN542Xbn5iupiq8xUgHbV29CpLeCn6Hqfnahu2dhmmNvz43ubd7ccUXStqaIVhNYNYG1rrKziYDvfXynkFPFrIaO40Qw6I461g_FREroSC9YABzsdJPub1IH0xzMXE5gc',
    location: 'Nilai, Negeri Sembilan',
    degreeLevel: "Bachelor's Degree",
    badgeType: 'verified',
    badgeText: 'MQA & Industry Endorsed',
    duration: '3 Years (Full-time)',
    intakeMonths: ['January', 'May', 'August'],
    scholarship: 'High Achiever Scholarship',
    tuitionMYR: 85848,
    tuitionUSD: 18870,
    faculty: 'Faculty of Information Technology',
    description: 'Comprehensive computer science education on INTI flagship 82-acre Nilai university campus. Total tuition RM 85,848.',
    requirements: {
      academic: 'FSc (Pre-Eng/ICS) with 60% or A-Levels 2 passes with Mathematics.',
      english: 'IELTS 5.5 or equivalent.',
      minGpa: '2.50 / 60%',
      documents: ['Intermediate Marksheet', 'Passport Full Scan', 'Admission Form']
    },
    semesterSchedule: [
      { semester: 'Year 1', tuitionMYR: 28616, miscMYR: 10447 },
      { semester: 'Year 2', tuitionMYR: 28616, miscMYR: 4977 },
      { semester: 'Year 3', tuitionMYR: 28616, miscMYR: 4977 }
    ],
    emgsFeeMYR: 2847,
    miscFeesMYR: 7600,
    totalInitialMYR: 10447,
    miscBreakdown: 'EMGS Processing Fee: RM 2,847 | First Year Admin Fee: RM 4,000 | Registration Fee: RM 2,400 | Application: RM 600 | General Deposit: RM 600',
    pakistanNotes: 'Initial non-tuition package: RM 10,447. Subsequent years administration fee is RM 4,000/yr + EMGS renewal RM 977.'
  },

  // ==================== KINGS UNIVERSITY COLLEGE ====================
  {
    id: 'kings-ai-1',
    title: 'Bachelor of Science in Artificial Intelligence (Honours)',
    universityId: 'kings',
    universityName: 'Kings University College',
    universityLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEW89PJ2U1EtFB0NbV7HXaYLspzLRijXQrRavCpeAdjNeMQ-kF1nVrzR6Wpnqt8gYkHG8lDlW_spA7aTqD5RUi2RghJqf0XWodcNhObv_im8omJ-6sFGm24jyfo6LaQudfaMp3elEiaEzbrB-OnM6CNh4qcYhnFFTRN8qptrewsxZEmFbbu098v2dsWHFIRZulx7qXPu_NfZwSD78NXhJ3KUMuL8ieHMdN6z5HfWVJx6DqGWQuJp4',
    location: 'Kuala Lumpur',
    degreeLevel: "Bachelor's Degree",
    badgeType: 'verified',
    badgeText: 'MQA Ref: MQA/PA 18396',
    duration: '3 Years (Full-time)',
    intakeMonths: ['January', 'May', 'September'],
    scholarship: 'Scholarship Rate Fixed',
    tuitionMYR: 41700,
    tuitionUSD: 9160,
    faculty: 'Faculty of Computing and Information Technology',
    description: 'Accredited AI honors degree in Kuala Lumpur. Total tuition RM 41,700 (Year 1 RM 12,500; Year 2 RM 16,500; Year 3 RM 11,500). Transparent schedule with zero hidden costs.',
    requirements: {
      academic: 'FSc (Pre-Eng/ICS) / A-Levels / DAE with minimum 50% or C in Math.',
      english: 'IELTS 5.5 or Kings internal placement test.',
      minGpa: '2.50 / 50%',
      documents: ['Intermediate / A-Level Certificates', 'Passport Copy']
    },
    semesterSchedule: [
      { semester: 'Year 1', tuitionMYR: 12500, miscMYR: 4200 },
      { semester: 'Year 2', tuitionMYR: 16500, miscMYR: 1300 },
      { semester: 'Year 3', tuitionMYR: 11500, miscMYR: 1300 }
    ],
    emgsFeeMYR: 3000,
    miscFeesMYR: 1200,
    totalInitialMYR: 4200,
    miscBreakdown: 'EMGS Fee: RM 3,000 | Registration Fee: RM 1,200',
    pakistanNotes: 'Total initial non-tuition fees: RM 4,200 only! Annual visa renewal: RM 1,300/yr.'
  },

  // ==================== BRICKFIELDS ASIA COLLEGE (BAC) ====================
  {
    id: 'bac-llb-1',
    title: 'University of London International Programmes LLB (3+0)',
    universityId: 'bac',
    universityName: 'Brickfields Asia College (BAC)',
    universityLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnKvybNSWi1NrP1Kq2CKTd_EyOrEX9_YdBWJi0GFtITF7a7z1Cej18n0s48VZFV13T-sHrrEkJER4VqTWCV-pD4aXtSD-wUcbyFB5h8DTe9RFxZpCxjoRN542Xbn5iupiq8xUgHbV29CpLeCn6Hqfnahu2dhmmNvz43ubd7ccUXStqaIVhNYNYG1rrKziYDvfXynkFPFrIaO40Qw6I461g_FREroSC9YABzsdJPub1IH0xzMXE5gc',
    location: 'Kuala Lumpur & Petaling Jaya',
    degreeLevel: "Bachelor's Degree",
    badgeType: 'topuk',
    badgeText: 'University of London Award',
    duration: '3 Years (Full-time)',
    intakeMonths: ['September'],
    scholarship: 'BAC Legal Excellence Aid',
    tuitionMYR: 60000,
    tuitionUSD: 13180,
    faculty: 'School of Law',
    description: "World-renowned legal education leading directly to the prestigious University of London LLB degree. BAC has produced the highest number of First Class degrees and world prizes.",
    requirements: {
      academic: 'A-Levels minimum 2 passes or Intermediate with recognized foundation or diploma.',
      english: 'IELTS 6.0 overall with no band below 5.5.',
      minGpa: '3.00 / 60%',
      documents: ['A-Level / Inter Marksheet', 'Passport Scan', 'National ID Card Scan']
    },
    semesterSchedule: [
      { semester: 'Year 1', tuitionMYR: 20000, miscMYR: 5800 },
      { semester: 'Year 2', tuitionMYR: 20000, miscMYR: 2200 },
      { semester: 'Year 3', tuitionMYR: 20000, miscMYR: 2200 }
    ],
    emgsFeeMYR: 2800,
    miscFeesMYR: 3000,
    totalInitialMYR: 5800,
    miscBreakdown: 'Visa Processing Fee: RM 2,800 | Registration Fee: RM 1,000 | Resource Fee (Yr 1): RM 1,000 | Personal Bond (Pakistan): RM 1,000',
    pakistanNotes: 'Initial non-tuition fees: RM 5,800. Excludes external UK examination and registration fees paid to University of London.'
  },

  // ==================== YPC INTERNATIONAL COLLEGE (LJMU UK) ====================
  {
    id: 'ypc-cs-1',
    title: 'BSc (Hons) Multimedia Computing (Liverpool John Moores Univ UK)',
    universityId: 'ypc',
    universityName: 'YPC International College (LJMU UK)',
    universityLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEW89PJ2U1EtFB0NbV7HXaYLspzLRijXQrRavCpeAdjNeMQ-kF1nVrzR6Wpnqt8gYkHG8lDlW_spA7aTqD5RUi2RghJqf0XWodcNhObv_im8omJ-6sFGm24jyfo6LaQudfaMp3elEiaEzbrB-OnM6CNh4qcYhnFFTRN8qptrewsxZEmFbbu098v2dsWHFIRZulx7qXPu_NfZwSD78NXhJ3KUMuL8ieHMdN6z5HfWVJx6DqGWQuJp4',
    location: 'Cheras, Kuala Lumpur',
    degreeLevel: "Bachelor's Degree",
    badgeType: 'topuk',
    badgeText: '100% LJMU UK Degree (3+0)',
    duration: '3 Years (Full-time)',
    intakeMonths: ['January', 'April', 'September'],
    scholarship: 'Fixed Rate Package RM 60k',
    tuitionMYR: 60000,
    tuitionUSD: 13180,
    faculty: 'School of Technology & Computing',
    description: '3+0 UK Degree delivered entirely in Malaysia with authentic graduation and certificate from Liverpool John Moores University (UK). Total tuition is strictly RM 60,000 (RM 20,000/yr).',
    requirements: {
      academic: 'FSc (Pre-Eng/ICS/General) 50% or A-Levels with 2 passes.',
      english: 'IELTS 5.5 or MUET certificate.',
      minGpa: '2.50 / 50%',
      documents: ['Intermediate Certificates', 'Passport Scan', 'Photos']
    },
    semesterSchedule: [
      { semester: 'Year 1', tuitionMYR: 20000, miscMYR: 4300 },
      { semester: 'Year 2', tuitionMYR: 20000, miscMYR: 1200 },
      { semester: 'Year 3', tuitionMYR: 20000, miscMYR: 1200 }
    ],
    emgsFeeMYR: 2800,
    miscFeesMYR: 1500,
    totalInitialMYR: 4300,
    miscBreakdown: 'EMGS Fees: RM 2,800 | Registration Fees: RM 1,500',
    pakistanNotes: 'Total initial payment to begin visa process: RM 4,300 only. Total all-in cost for 3-year UK degree is RM 64,300.'
  },

  // ==================== MULTIMEDIA UNIVERSITY (MMU) ====================
  {
    id: 'mmu-mba-1',
    title: 'Master of Business Administration (MBA - Coursework)',
    universityId: 'mmu',
    universityName: 'Multimedia University (MMU)',
    universityLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnKvybNSWi1NrP1Kq2CKTd_EyOrEX9_YdBWJi0GFtITF7a7z1Cej18n0s48VZFV13T-sHrrEkJER4VqTWCV-pD4aXtSD-wUcbyFB5h8DTe9RFxZpCxjoRN542Xbn5iupiq8xUgHbV29CpLeCn6Hqfnahu2dhmmNvz43ubd7ccUXStqaIVhNYNYG1rrKziYDvfXynkFPFrIaO40Qw6I461g_FREroSC9YABzsdJPub1IH0xzMXE5gc',
    location: 'Cyberjaya & Melaka',
    degreeLevel: "Master's (Postgraduate)",
    badgeType: 'verified',
    badgeText: 'GLC Telecom Powerhouse',
    duration: '1 Year (Full-time)',
    intakeMonths: ['March', 'July', 'October'],
    scholarship: 'New Effective Fee 2026',
    tuitionMYR: 23600,
    tuitionUSD: 5180,
    faculty: 'Faculty of Management (Cyberjaya)',
    description: 'Premier Malaysian MBA backed by Telekom Malaysia. 1-year fast-track program with revised promotional tuition of RM 23,600.',
    requirements: {
      academic: 'Bachelor degree (16 years) with minimum CGPA 2.50.',
      english: 'IELTS 6.0 or verified English medium degree.',
      minGpa: '2.50 / 4.00',
      documents: ['HEC Attested Transcript & Degree', 'Passport Scan', '2 Academic References']
    },
    semesterSchedule: [
      { semester: 'Trimester 1', tuitionMYR: 11800, miscMYR: 10100 },
      { semester: 'Trimester 2 & 3', tuitionMYR: 11800, miscMYR: 200 }
    ],
    emgsFeeMYR: 3600,
    miscFeesMYR: 6500,
    totalInitialMYR: 10100,
    miscBreakdown: 'International Processing Fee (Visa/EMGS): RM 3,600 | Registration Fee: RM 2,000 | Deposit: RM 1,500 | Advance Programme Fee: RM 3,000',
    pakistanNotes: 'One-time initial payment upon acceptance is RM 10,100 (covers Visa processing, registration, security deposit & advance tuition).'
  },

  // ==================== UNIVERSITY OF CYBERJAYA (UoC) ====================
  {
    id: 'uoc-mbbs-1',
    title: 'Bachelor of Medicine & Bachelor of Surgery (MBBS)',
    universityId: 'cyberjaya',
    universityName: 'University of Cyberjaya (UoC)',
    universityLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnKvybNSWi1NrP1Kq2CKTd_EyOrEX9_YdBWJi0GFtITF7a7z1Cej18n0s48VZFV13T-sHrrEkJER4VqTWCV-pD4aXtSD-wUcbyFB5h8DTe9RFxZpCxjoRN542Xbn5iupiq8xUgHbV29CpLeCn6Hqfnahu2dhmmNvz43ubd7ccUXStqaIVhNYNYG1rrKziYDvfXynkFPFrIaO40Qw6I461g_FREroSC9YABzsdJPub1IH0xzMXE5gc',
    location: 'Cyberjaya, Selangor',
    degreeLevel: "Bachelor's Degree",
    badgeType: 'flagship',
    badgeText: 'RM 75k Fee Waiver Included',
    duration: '5 Years (Full-time)',
    intakeMonths: ['October'],
    scholarship: 'RM 75,000 Automatic Waiver',
    tuitionMYR: 379650,
    tuitionUSD: 83440,
    faculty: 'Faculty of Medicine',
    description: 'Premier Malaysian medical school with full Malaysian Medical Council (MMC) and PMDC recognition. Total payable fees reduced to RM 379,650 after the RM 75,000 intake waiver.',
    requirements: {
      academic: 'FSc Pre-Medical: Minimum 70% in Biology, Chemistry, and Physics; or A-Levels with BBB.',
      english: 'IELTS 6.0 (minimum 5.5 in each band).',
      minGpa: '3.00 / 70%',
      documents: ['Matric & FSc Transcripts', 'Passport Full Scan', 'Medical Examination Report']
    },
    semesterSchedule: [
      { semester: 'Year 1', tuitionMYR: 75930, miscMYR: 7000 },
      { semester: 'Year 2', tuitionMYR: 75930, miscMYR: 1500 },
      { semester: 'Year 3', tuitionMYR: 75930, miscMYR: 1500 },
      { semester: 'Year 4', tuitionMYR: 75930, miscMYR: 1500 },
      { semester: 'Year 5', tuitionMYR: 75930, miscMYR: 1500 }
    ],
    emgsFeeMYR: 3500,
    miscFeesMYR: 3500,
    totalInitialMYR: 7000,
    miscBreakdown: 'EMGS & Visa Processing: RM 3,500 | Registration Fee: RM 1,500 | Resource Fee & Admin: RM 2,000',
    pakistanNotes: 'Initial visa & admin package: RM 7,000. Non-refundable RM 10,000 commitment fee is offset against tuition.'
  },

  // ==================== UNISHAMS ====================
  {
    id: 'unishams-it-1',
    title: 'Bachelor of Information Technology (Networking) (Honours)',
    universityId: 'unishams',
    universityName: "Sultan Abdul Halim Mu'adzam Shah International Islamic University (UniSHAMS)",
    universityLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVmpFbiGR3zk5YkmJnpg8hmiNYdgPKB5QSGacVccI8rGonNfJ2ti1bJgkfmvfDmvMaig6rL1bMr3j-hVIwpSV1an0nDvT4rrDaKXb-3U7sRtUL4FA7laLIhQ0IY9b-pOLgXQt9O9MOo8TqHDCOcm_Qg8TLb6kYGyHrHScodiye6BjhqSOO9MFlDAGPJb3GHaQkW7DuG3vvMbBvGnmzMX_LPlc9NNUqL5C1jxp8mnDmKE-3xMApVzw',
    location: 'Kuala Ketil, Kedah',
    degreeLevel: "Bachelor's Degree",
    badgeType: 'verified',
    badgeText: 'State Government University',
    duration: '3.5 Years (42 Months)',
    intakeMonths: ['February', 'September'],
    scholarship: 'Ultra-Low Living Cost Kedah',
    tuitionMYR: 47590,
    tuitionUSD: 10460,
    faculty: 'Kulliyyah of Information Technology and Multimedia',
    description: 'Specialized Cisco networking, cloud infrastructure, and network defense degree with the lowest student living costs in Malaysia (~RM 900/month). Total tuition RM 47,590.',
    requirements: {
      academic: 'Intermediate (FSc/ICS/DAE) with 50% or A-Levels with Mathematics.',
      english: 'IELTS 5.5 or English preparation course.',
      minGpa: '2.50 / 50%',
      documents: ['Intermediate Certificates', 'Passport Scan', 'Passport Photo']
    },
    semesterSchedule: [
      { semester: 'Year 1', tuitionMYR: 13597, miscMYR: 11000 },
      { semester: 'Year 2', tuitionMYR: 13597, miscMYR: 1200 },
      { semester: 'Year 3', tuitionMYR: 13597, miscMYR: 1200 },
      { semester: 'Year 4 (0.5 yr)', tuitionMYR: 6799, miscMYR: 600 }
    ],
    emgsFeeMYR: 3500,
    miscFeesMYR: 7500,
    totalInitialMYR: 11000,
    miscBreakdown: 'EMGS Fee: RM 3,500 | Service Charge: RM 4,000 | Administrative Fees: RM 3,500',
    pakistanNotes: 'Initial non-tuition package: RM 11,000 (EMGS RM 3,500 + Service Charge RM 4,000 + Admin RM 3,500).'
  },

  // ==================== UNIVERSITI MALAYA (UM) ====================
  {
    id: 'um-cs-1',
    title: 'Bachelor of Computer Science (Artificial Intelligence)',
    universityId: 'um',
    universityName: 'Universiti Malaya (UM)',
    universityLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnKvybNSWi1NrP1Kq2CKTd_EyOrEX9_YdBWJi0GFtITF7a7z1Cej18n0s48VZFV13T-sHrrEkJER4VqTWCV-pD4aXtSD-wUcbyFB5h8DTe9RFxZpCxjoRN542Xbn5iupiq8xUgHbV29CpLeCn6Hqfnahu2dhmmNvz43ubd7ccUXStqaIVhNYNYG1rrKziYDvfXynkFPFrIaO40Qw6I461g_FREroSC9YABzsdJPub1IH0xzMXE5gc',
    location: 'Kuala Lumpur',
    degreeLevel: "Bachelor's Degree",
    badgeType: 'flagship',
    badgeText: 'QS #65 Worldwide',
    duration: '3.5 Years (Full-time)',
    intakeMonths: ['October', 'March'],
    scholarship: 'Government Subsidized Rates',
    tuitionMYR: 42000,
    tuitionUSD: 9230,
    faculty: 'Faculty of Computer Science & Information Technology',
    description: "Malaysia's top-ranked public university computing program with competitive international admission and world-leading research labs in natural language processing and computer vision.",
    requirements: {
      academic: 'FSc (Pre-Engineering) / A-Levels with at least 80% marks / AAA grades.',
      english: 'IELTS 6.0 or TOEFL iBT 60.',
      minGpa: '3.50 / 80%',
      documents: ['Intermediate Certificates', 'Passport Scan', 'Extracurricular Portfolio']
    },
    semesterSchedule: [
      { semester: 'Year 1', tuitionMYR: 12000, miscMYR: 4750 },
      { semester: 'Year 2', tuitionMYR: 12000, miscMYR: 1200 },
      { semester: 'Year 3', tuitionMYR: 12000, miscMYR: 1200 },
      { semester: 'Year 4 (0.5 yr)', tuitionMYR: 6000, miscMYR: 600 }
    ],
    emgsFeeMYR: 2550,
    miscFeesMYR: 2200,
    totalInitialMYR: 4750,
    miscBreakdown: 'Public University EMGS Processing: RM 2,550 | Registration & Deposit: RM 2,200',
    pakistanNotes: 'Public research university rates. Upfront initial processing fee is RM 4,750.'
  }
];
