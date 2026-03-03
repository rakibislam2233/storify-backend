import { RedisUtils } from '../../utils/redis.utils';
import { DASHBOARD_CACHE_KEY, DASHBOARD_CACHE_TTL } from './dashboard.cache';
import { IAdminDashboardStats, IAnalyticsData, IUserDashboardStats } from './dashboard.interface';
import { DashboardRepository } from './dashboard.repository';

// ── Get Admin Dashboard Statistics ───────────────────────────────────────────────────
const getAdminDashboardStats = async (): Promise<IAdminDashboardStats> => {
  const cacheKey = DASHBOARD_CACHE_KEY.ADMIN_STATS;
  const cachedStats = await RedisUtils.getCache<IAdminDashboardStats>(cacheKey);

  if (cachedStats) {
    return cachedStats;
  }

  const stats = await DashboardRepository.getAdminDashboardStats();

  await RedisUtils.setCache(cacheKey, stats, DASHBOARD_CACHE_TTL.ADMIN_STATS);
  return stats;
};

// ── Get User Dashboard Statistics ─────────────────────────────────────────────────────
const getUserDashboardStats = async (userId: string): Promise<IUserDashboardStats> => {
  const cacheKey = DASHBOARD_CACHE_KEY.USER_STATS(userId);
  const cachedStats = await RedisUtils.getCache<IUserDashboardStats>(cacheKey);

  if (cachedStats) {
    return cachedStats;
  }

  const stats = await DashboardRepository.getUserDashboardStats(userId);

  await RedisUtils.setCache(cacheKey, stats, DASHBOARD_CACHE_TTL.USER_STATS);
  return stats;
};

// ── Get Analytics Data ───────────────────────────────────────────────────────────────
const getAnalyticsData = async (days: number = 30): Promise<IAnalyticsData> => {
  const cacheKey = `${DASHBOARD_CACHE_KEY.ANALYTICS}:${days}`;
  const cachedAnalytics = await RedisUtils.getCache<IAnalyticsData>(cacheKey);

  if (cachedAnalytics) {
    return cachedAnalytics;
  }

  const analytics = await DashboardRepository.getAnalyticsData(days);

  await RedisUtils.setCache(cacheKey, analytics, DASHBOARD_CACHE_TTL.ANALYTICS);
  return analytics;
};

// ── Refresh Dashboard Cache ───────────────────────────────────────────────────────────
const refreshDashboardCache = async (userId?: string): Promise<void> => {
  if (userId) {
    // Clear specific user dashboard cache
    await RedisUtils.deleteCache(DASHBOARD_CACHE_KEY.USER_STATS(userId));
    await RedisUtils.deleteCache(`${DASHBOARD_CACHE_KEY.USER_ANALYTICS}:${userId}`);
  } else {
    // Clear admin dashboard cache
    await RedisUtils.deleteCache(DASHBOARD_CACHE_KEY.ADMIN_STATS);
    await RedisUtils.deleteCache(DASHBOARD_CACHE_KEY.ANALYTICS);
  }
};

// ── Get Admin Chart Data ─────────────────────────────────────────────────────────────
const getAdminChartData = async () => {
  const cacheKey = `${DASHBOARD_CACHE_KEY.ADMIN_STATS}:charts`;
  const cachedCharts = await RedisUtils.getCache(cacheKey);

  if (cachedCharts) {
    return cachedCharts;
  }

  const charts = await DashboardRepository.getAdminChartData();

  await RedisUtils.setCache(cacheKey, charts, DASHBOARD_CACHE_TTL.ADMIN_STATS);
  return charts;
};

// ── Get User Chart Data ───────────────────────────────────────────────────────────────
const getUserChartData = async (userId: string) => {
  const cacheKey = `${DASHBOARD_CACHE_KEY.USER_STATS(userId)}:charts`;
  const cachedCharts = await RedisUtils.getCache(cacheKey);

  if (cachedCharts) {
    return cachedCharts;
  }

  const charts = await DashboardRepository.getUserChartData(userId);

  await RedisUtils.setCache(cacheKey, charts, DASHBOARD_CACHE_TTL.USER_STATS);
  return charts;
};

// ── Export Dashboard Service ───────────────────────────────────────────────────────────
export const DashboardService = {
  getAdminDashboardStats,
  getUserDashboardStats,
  getAnalyticsData,
  getAdminChartData,
  getUserChartData,
  refreshDashboardCache,
};
