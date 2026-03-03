export const SUBSCRIPTION_HISTORY_CACHE_KEY = {
  BY_ID: (id: string) => `subscription-history:${id}`,
  BY_USER_ID: (userId: string) => `subscription-history-user:${userId}`,
  ACTIVE_BY_USER_ID: (userId: string) => `active-subscription-user:${userId}`,
  LIST: 'subscription-history-list:*',
  USER_LIST: (userId: string) => `subscription-history-user-list:${userId}:*`,
};

export const SUBSCRIPTION_HISTORY_CACHE_TTL = {
  BY_ID: 30 * 60, // 30 minutes
  BY_USER_ID: 15 * 60, // 15 minutes
  ACTIVE_BY_USER_ID: 5 * 60, // 5 minutes (active subscription changes frequently)
  LIST: 10 * 60, // 10 minutes
  USER_LIST: 10 * 60, // 10 minutes
};
