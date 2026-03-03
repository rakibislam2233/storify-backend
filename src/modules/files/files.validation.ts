import { z } from 'zod';

// -- Create File Validation Schema --
export const createFileValidationSchema = z.object({
  body: z.object({
    originalName: z
      .string({
        message: 'Original file name is required and must be a string',
      })
      .min(1, 'Original file name cannot be empty')
      .max(255, 'Original file name cannot exceed 255 characters'),

    name: z
      .string({
        message: 'File name is required and must be a string',
      })
      .min(1, 'File name cannot be empty')
      .max(255, 'File name cannot exceed 255 characters'),

    type: z
      .string({
        message: 'File type is required and must be a string',
      })
      .min(1, 'File type cannot be empty')
      .max(100, 'File type cannot exceed 100 characters'),

    size: z
      .number({
        message: 'File size is required and must be a number',
      })
      .min(1, 'File size must be at least 1 byte')
      .max(1073741824, 'File size cannot exceed 1GB'),

    url: z
      .string({
        message: 'File URL is required and must be a string',
      })
      .min(1, 'File URL cannot be empty')
      .max(2048, 'File URL cannot exceed 2048 characters'),

    folderId: z
      .string({
        message: 'Folder ID is required and must be a string',
      })
      .min(1, 'Folder ID cannot be empty'),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

// -- Update File Validation Schema --
export const updateFileValidationSchema = z.object({
  body: z.object({
    originalName: z
      .string({
        message: 'Original file name must be a string',
      })
      .min(1, 'Original file name cannot be empty')
      .max(255, 'Original file name cannot exceed 255 characters')
      .optional(),

    name: z
      .string({
        message: 'File name must be a string',
      })
      .min(1, 'File name cannot be empty')
      .max(255, 'File name cannot exceed 255 characters')
      .optional(),

    folderId: z
      .string({
        message: 'Folder ID must be a string',
      })
      .min(1, 'Folder ID cannot be empty')
      .optional(),
  }),
  query: z.any().optional(),
  params: z.object({
    id: z
      .string({
        message: 'File ID is required and must be a string',
      })
      .min(1, 'File ID cannot be empty'),
  }),
});

// -- Get File By Id Validation Schema --
export const getFileByIdValidationSchema = z.object({
  body: z.any().optional(),
  query: z.any().optional(),
  params: z.object({
    id: z
      .string({
        message: 'File ID is required and must be a string',
      })
      .min(1, 'File ID cannot be empty'),
  }),
});

// -- Delete File Validation Schema --
export const deleteFileValidationSchema = z.object({
  body: z.any().optional(),
  query: z.any().optional(),
  params: z.object({
    id: z
      .string({
        message: 'File ID is required and must be a string',
      })
      .min(1, 'File ID cannot be empty'),
  }),
});

// -- Get Files By Folder Id Validation Schema --
export const getFilesByFolderIdValidationSchema = z.object({
  body: z.any().optional(),
  params: z.object({
    id: z
      .string({
        message: 'Folder ID is required and must be a string',
      })
      .min(1, 'Folder ID cannot be empty'),
  }),
  query: z.object({
    searchTerm: z
      .string({
        message: 'Search term must be a string',
      })
      .optional(),

    type: z
      .string({
        message: 'File type must be a string',
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

// -- Get All Files By User Id Validation Schema --
export const getFilesByUserIdValidationSchema = z.object({
  body: z.any().optional(),
  params: z.any().optional(),
  query: z.object({
    searchTerm: z
      .string({
        message: 'Search term must be a string',
      })
      .optional(),

    type: z
      .string({
        message: 'File type must be a string',
      })
      .optional(),

    folderId: z
      .string({
        message: 'Folder ID must be a string',
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

export const FileValidation = {
  createFileValidationSchema,
  updateFileValidationSchema,
  getFileByIdValidationSchema,
  deleteFileValidationSchema,
  getFilesByFolderIdValidationSchema,
  getFilesByUserIdValidationSchema,
};
