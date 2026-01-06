export const APP_CONFIG = {
  NAME: 'Gereja Digital CMS',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  PAGINATION_LIMIT: 10,
  DATE_FORMAT: 'dd MMMM yyyy',
};

export const ROLES: Record<string, string> = {
  ADMIN: 'Administrator',
  SEKRETARIS: 'Sekretariat',
  BENDAHARA: 'Bendahara',
  GEMBALA: 'Gembala Sidang',
  JEMAAT: 'Jemaat',
};