import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DashboardService } from './dashboard.service';

// ── Get Admin Dashboard Statistics ───────────────────────────────────────────────────
const getAdminDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getAdminDashboardStats();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin dashboard statistics fetched successfully',
    data: result,
  });
});

// ── Get User Dashboard Statistics ─────────────────────────────────────────────────────
const getUserDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await DashboardService.getUserDashboardStats(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User dashboard statistics fetched successfully',
    data: result,
  });
});

// ── Get Analytics Data ───────────────────────────────────────────────────────────────
const getAnalyticsData = catchAsync(async (req: Request, res: Response) => {
  const { days = 30 } = req.query;
  const result = await DashboardService.getAnalyticsData(Number(days));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Analytics data fetched successfully',
    data: result,
  });
});

// ── Refresh Dashboard Cache ───────────────────────────────────────────────────────────
const refreshDashboardCache = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.query;
  const result = await DashboardService.refreshDashboardCache(userId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard cache refreshed successfully',
    data: { success: true },
  });
});

// ── Get Admin Chart Data ─────────────────────────────────────────────────────────────
const getAdminChartData = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getAdminChartData();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin chart data fetched successfully',
    data: result,
  });
});

// ── Get User Chart Data ───────────────────────────────────────────────────────────────
const getUserChartData = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await DashboardService.getUserChartData(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User chart data fetched successfully',
    data: result,
  });
});

// ── Export Dashboard Controller ───────────────────────────────────────────────────────
export const DashboardController = {
  getAdminDashboardStats,
  getUserDashboardStats,
  getAnalyticsData,
  getAdminChartData,
  getUserChartData,
  refreshDashboardCache,
};
