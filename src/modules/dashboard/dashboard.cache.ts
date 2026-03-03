export const DASHBOARD_CACHE_KEY = {
  ADMIN_STATS: 'admin-dashboard-stats',
  USER_STATS: (userId: string) => `user-dashboard-stats:${userId}`,
  ANALYTICS: 'dashboard-analytics',
  USER_ANALYTICS: (userId: string) => `user-analytics:${userId}`,
};

export const DASHBOARD_CACHE_TTL = {
  ADMIN_STATS: 5 * 60, // 5 minutes - admin stats change frequently
  USER_STATS: 10 * 60, // 10 minutes - user stats change moderately
  ANALYTICS: 30 * 60, // 30 minutes - analytics data changes slowly
  USER_ANALYTICS: 15 * 60, // 15 minutes - user analytics
};
