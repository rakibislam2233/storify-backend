import { Router } from 'express';
import { UserRole } from '../../../prisma/generated/enums';
import { auth } from '../../middleware/auth.middleware';
import validateRequest from '../../middleware/validation.middleware';
import { DashboardController } from './dashboard.controller';
import { DashboardValidation } from './dashboard.validation';

const router = Router();

// ── Get Admin Dashboard Statistics ───────────────────────────────────────────────────
router.get('/admin', auth(UserRole.ADMIN), DashboardController.getAdminDashboardStats);

// ── Get User Dashboard Statistics ─────────────────────────────────────────────────────
router.get('/user', auth(UserRole.USER, UserRole.ADMIN), DashboardController.getUserDashboardStats);

// ── Get Admin Chart Data ───────────────────────────────────────────────────────────
router.get('/admin/charts', auth(UserRole.ADMIN), DashboardController.getAdminChartData);

// ── Get User Chart Data ─────────────────────────────────────────────────────────────
router.get(
  '/user/charts',
  auth(UserRole.USER, UserRole.ADMIN),
  DashboardController.getUserChartData
);

// ── Get Analytics Data ───────────────────────────────────────────────────────────────
router.get(
  '/analytics',
  auth(UserRole.ADMIN),
  validateRequest(DashboardValidation.getAnalyticsDataValidationSchema),
  DashboardController.getAnalyticsData
);

// ── Refresh Dashboard Cache ───────────────────────────────────────────────────────────
router.post(
  '/refresh-cache',
  auth(UserRole.ADMIN),
  validateRequest(DashboardValidation.refreshDashboardCacheValidationSchema),
  DashboardController.refreshDashboardCache
);

export const DashboardRoutes = router;
