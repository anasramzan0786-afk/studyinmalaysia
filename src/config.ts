/**
 * Meezab Portal Configuration
 * Safely accesses client environment variables with intelligent fallbacks.
 * In Next.js, public client environment variables are prefixed with NEXT_PUBLIC_.
 */

export const APP_CONFIG = {
  companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Meezab Future Consulting',
  portalName: process.env.NEXT_PUBLIC_PORTAL_NAME || 'Study In Malaysia By Meezab',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'anas.studyinmalaysiabymeezab@gmail.com',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923346596725',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.studyinmalaysia.vercel.app',
  supportHours: 'Monday - Saturday: 9:00 AM - 7:00 PM (MYT / UTC+8)',
  officeLocation: 'Kuala Lumpur, Malaysia & Lahore, Pakistan',
  storageKeys: {
    programs: 'meezab_programs_v1',
    auditLogs: 'meezab_audit_logs_v1',
    visaSettings: 'meezab_visa_settings_v1',
    currency: 'meezab_currency_preference',
  },
} as const;

