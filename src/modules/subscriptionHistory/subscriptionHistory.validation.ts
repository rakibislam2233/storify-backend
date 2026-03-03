import { z } from 'zod';

// ── Purchase Package Validation Schema ───────────────────────────────────────────────
const purchasePackageValidationSchema = z.object({
  body: z.object({
    packageId: z
      .string({
        message: 'Package ID is required and must be a string',
      })
      .min(1, 'Package ID cannot be empty'),
  }),
});

// ── Get Subscription History By Id Validation Schema ───────────────────────────────────
const getSubscriptionHistoryByIdValidationSchema = z.object({
  params: z.object({
    id: z
      .string({
        message: 'Subscription history ID is required and must be a string',
      })
      .min(1, 'Subscription history ID cannot be empty'),
  }),
});

// ── Get All Subscription Histories Validation Schema ───────────────────────────────────
const getAllSubscriptionHistoriesValidationSchema = z.object({
  query: z.object({
    searchTerm: z
      .string({
        message: 'Search term must be a string',
      })
      .optional(),

    userId: z
      .string({
        message: 'User ID must be a string',
      })
      .min(1, 'User ID cannot be empty')
      .optional(),

    startDate: z
      .string({
        message: 'Start date must be a string',
      })
      .datetime('Start date must be a valid date')
      .optional(),

    endDate: z
      .string({
        message: 'End date must be a string',
      })
      .datetime('End date must be a valid date')
      .optional(),

    page: z
      .string({
        message: 'Page must be a string',
      })
      .transform(val => (val ? parseInt(val, 10) : 1))
      .pipe(z.number().int().min(1, 'Page must be at least 1'))
      .optional(),

    limit: z
      .string({
        message: 'Limit must be a string',
      })
      .transform(val => (val ? parseInt(val, 10) : 10))
      .pipe(z.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100'))
      .optional(),

    sortBy: z
      .string({
        message: 'Sort by must be a string',
      })
      .optional(),

    sortOrder: z
      .enum(['asc', 'desc'], {
        message: 'Sort order must be either asc or desc',
      })
      .optional(),
  }),
});

// ── Get Subscription Histories By User Id Validation Schema ─────────────────────────────
const getSubscriptionHistoriesByUserIdValidationSchema = z.object({
  params: z.object({
    userId: z
      .string({
        message: 'User ID is required and must be a string',
      })
      .min(1, 'User ID cannot be empty'),
  }),
  query: z.object({
    searchTerm: z
      .string({
        message: 'Search term must be a string',
      })
      .optional(),

    startDate: z
      .string({
        message: 'Start date must be a string',
      })
      .datetime('Start date must be a valid date')
      .optional(),

    endDate: z
      .string({
        message: 'End date must be a string',
      })
      .datetime('End date must be a valid date')
      .optional(),

    page: z
      .string({
        message: 'Page must be a string',
      })
      .transform(val => (val ? parseInt(val, 10) : 1))
      .pipe(z.number().int().min(1, 'Page must be at least 1'))
      .optional(),

    limit: z
      .string({
        message: 'Limit must be a string',
      })
      .transform(val => (val ? parseInt(val, 10) : 10))
      .pipe(z.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100'))
      .optional(),

    sortBy: z
      .string({
        message: 'Sort by must be a string',
      })
      .optional(),

    sortOrder: z
      .enum(['asc', 'desc'], {
        message: 'Sort order must be either asc or desc',
      })
      .optional(),
  }),
});

// ── Update Subscription History Validation Schema ─────────────────────────────────────
const updateSubscriptionHistoryValidationSchema = z.object({
  params: z.object({
    id: z
      .string({
        message: 'Subscription history ID is required and must be a string',
      })
      .min(1, 'Subscription history ID cannot be empty'),
  }),
  body: z.object({
    packageName: z
      .string({
        message: 'Package name must be a string',
      })
      .min(1, 'Package name cannot be empty')
      .max(100, 'Package name cannot exceed 100 characters')
      .optional(),

    price: z
      .number({
        message: 'Price must be a number',
      })
      .min(0, 'Price cannot be negative')
      .optional(),

    startDate: z
      .string({
        message: 'Start date must be a string',
      })
      .datetime('Start date must be a valid date')
      .optional(),

    endDate: z
      .string({
        message: 'End date must be a string',
      })
      .datetime('End date must be a valid date')
      .nullable()
      .optional(),
  }),
});

// ── Delete Subscription History Validation Schema ─────────────────────────────────────
const deleteSubscriptionHistoryValidationSchema = z.object({
  params: z.object({
    id: z
      .string({
        message: 'Subscription history ID is required and must be a string',
      })
      .min(1, 'Subscription history ID cannot be empty'),
  }),
});

// ── Get Active Subscription By User Id Validation Schema ─────────────────────────────
const getActiveSubscriptionByUserIdValidationSchema = z.object({
  params: z.object({
    userId: z
      .string({
        message: 'User ID is required and must be a string',
      })
      .min(1, 'User ID cannot be empty'),
  }),
});

// ── Check User Has Active Subscription Validation Schema ───────────────────────────────
const checkUserHasActiveSubscriptionValidationSchema = z.object({
  params: z.object({
    userId: z
      .string({
        message: 'User ID is required and must be a string',
      })
      .min(1, 'User ID cannot be empty'),
  }),
});

// ── Export Subscription History Validation ─────────────────────────────────────────────
export const SubscriptionHistoryValidation = {
  purchasePackageValidationSchema,
  getSubscriptionHistoryByIdValidationSchema,
  getAllSubscriptionHistoriesValidationSchema,
  getSubscriptionHistoriesByUserIdValidationSchema,
  updateSubscriptionHistoryValidationSchema,
  deleteSubscriptionHistoryValidationSchema,
  getActiveSubscriptionByUserIdValidationSchema,
  checkUserHasActiveSubscriptionValidationSchema,
};
