export const APP_CONFIG = {
  NAME: 'Gereja Digital CMS',
  API_URL: import.meta.env.VITE_API_URL || '/api',
  PAGINATION_LIMIT: 10,
  DATE_FORMAT: 'dd/MM/yyyy',
};

export const ROLES: Record<string, string> = {
  ADMIN: 'Administrator',
  SEKRETARIS: 'Sekretariat',
  BENDAHARA: 'Bendahara',
  GEMBALA: 'Gembala Sidang',
  JEMAAT: 'Jemaat',
};