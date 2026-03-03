import { z } from 'zod';

// -- Create Folder Validation Schema --
export const createFolderValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        message: 'Folder name is required and must be a string',
      })
      .min(1, 'Folder name cannot be empty')
      .max(100, 'Folder name cannot exceed 100 characters'),

    parentId: z
      .string({
        message: 'Parent folder ID must be a string',
      })
      .nullable()
      .optional(),
  }),
});

// -- Update Folder Validation Schema --
export const updateFolderValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        message: 'Folder name must be a string',
      })
      .min(1, 'Folder name cannot be empty')
      .max(100, 'Folder name cannot exceed 100 characters')
      .optional(),

    parentId: z
      .string({
        message: 'Parent folder ID must be a string',
      })
      .nullable()
      .optional(),
  }),
  params: z.object({
    id: z
      .string({
        message: 'Folder ID is required and must be a string',
      })
      .min(1, 'Folder ID cannot be empty'),
  }),
});

// -- Get Folder By Id Validation Schema --
export const getFolderByIdValidationSchema = z.object({
  body: z.any().optional(),
  query: z.any().optional(),
  params: z.object({
    id: z
      .string({
        message: 'Folder ID is required and must be a string',
      })
      .min(1, 'Folder ID cannot be empty'),
  }),
});

// -- Delete Folder Validation Schema --
export const deleteFolderValidationSchema = z.object({
  body: z.any().optional(),
  query: z.any().optional(),
  params: z.object({
    id: z
      .string({
        message: 'Folder ID is required and must be a string',
      })
      .min(1, 'Folder ID cannot be empty'),
  }),
});

// -- Get Child Folders By Parent Id Validation Schema --
export const getChildFoldersByParentIdValidationSchema = z.object({
  body: z.any().optional(),
  query: z.any().optional(),
  params: z.object({
    id: z
      .string({
        message: 'Parent folder ID is required and must be a string',
      })
      .min(1, 'Parent folder ID cannot be empty'),
  }),
});

// -- Get All Folders By User Id Validation Schema --
export const getFoldersByUserIdValidationSchema = z.object({
  body: z.any().optional(),
  params: z.any().optional(),
  query: z.object({
    searchTerm: z
      .string({
        message: 'Search term must be a string',
      })
      .optional(),

    level: z
      .string({
        message: 'Level must be a string',
      })
      .transform(val => (val ? parseInt(val, 10) : undefined))
      .pipe(
        z
          .number()
          .int()
          .min(1, 'Level must be at least 1')
          .max(10, 'Level cannot exceed 10')
          .optional()
      )
      .optional(),

    parentId: z
      .string({
        message: 'Parent folder ID must be a string',
      })
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

// -- Get Root Folders By User Id Validation Schema --
export const getRootFoldersByUserIdValidationSchema = z.object({
  body: z.any().optional(),
  params: z.any().optional(),
  query: z.object({
    searchTerm: z
      .string({
        message: 'Search term must be a string',
      })
      .optional(),

    level: z
      .string({
        message: 'Level must be a string',
      })
      .transform(val => (val ? parseInt(val, 10) : undefined))
      .pipe(
        z
          .number()
          .int()
          .min(1, 'Level must be at least 1')
          .max(10, 'Level cannot exceed 10')
          .optional()
      )
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

export const FolderValidation = {
  createFolderValidationSchema,
  updateFolderValidationSchema,
  getFolderByIdValidationSchema,
  deleteFolderValidationSchema,
  getChildFoldersByParentIdValidationSchema,
  getFoldersByUserIdValidationSchema,
  getRootFoldersByUserIdValidationSchema,
};
