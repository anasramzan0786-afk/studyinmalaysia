/**
 * Meezab Portal Configuration
 * Safely accesses client environment variables with intelligent fallbacks.
 * These can be configured in Netlify's Environment Variables panel.
 */

const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};

export const APP_CONFIG = {
  companyName: env.VITE_COMPANY_NAME || 'Meezab Future Consulting',
  contactEmail: env.VITE_CONTACT_EMAIL || 'anas.studyinmalaysiabymeezab@gmail.com',
  whatsappNumber: env.VITE_WHATSAPP_NUMBER || '923346596725',
  supportHours: 'Monday - Saturday: 9:00 AM - 7:00 PM (MYT / UTC+8)',
  officeLocation: 'Kuala Lumpur, Malaysia & Lahore, Pakistan',
  storageKeys: {
    programs: 'meezab_programs_v1',
    auditLogs: 'meezab_audit_logs_v1',
    visaSettings: 'meezab_visa_settings_v1',
    currency: 'meezab_currency_preference'
  }
} as const;
