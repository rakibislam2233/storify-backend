export const PACKAGE_CACHE_KEY = {
  BY_ID: (id: string) => `package:${id}`,
  BY_NAME: (name: string) => `package-name:${name}`,
  LIST: 'package-list:*',
  ACTIVE: 'active-packages:*',
};

export const PACKAGE_CACHE_TTL = {
  BY_ID: 60 * 60, // 1 hour (packages don't change frequently)
  BY_NAME: 60 * 60, // 1 hour
  LIST: 30 * 60, // 30 minutes
  ACTIVE: 15 * 60, // 15 minutes (active packages may change more often)
};
