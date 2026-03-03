import { z } from 'zod';

// ── Get Analytics Data Validation Schema ───────────────────────────────────────────────
const getAnalyticsDataValidationSchema = z.object({
  query: z.object({
    days: z
      .string({
        message: 'Days must be a string',
      })
      .transform(val => (val ? parseInt(val, 10) : 30))
      .pipe(z.number().int().min(1, 'Days must be at least 1').max(365, 'Days cannot exceed 365'))
      .optional(),
  }),
});

// ── Refresh Dashboard Cache Validation Schema ───────────────────────────────────────────
const refreshDashboardCacheValidationSchema = z.object({
  query: z.object({
    userId: z
      .string({
        message: 'User ID must be a string',
      })
      .min(1, 'User ID cannot be empty')
      .optional(),
  }),
});

// ── Export Dashboard Validation ───────────────────────────────────────────────────────
export const DashboardValidation = {
  getAnalyticsDataValidationSchema,
  refreshDashboardCacheValidationSchema,
};
