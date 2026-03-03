import { z } from 'zod';

// -- Create Package Validation Schema --
export const createPackageValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        message: 'Package name is required and must be a string',
      })
      .min(1, 'Package name cannot be empty')
      .max(100, 'Package name cannot exceed 100 characters'),

    maxFolders: z
      .number({
        message: 'Max folders is required and must be a number',
      })
      .int('Max folders must be an integer')
      .min(1, 'Max folders must be at least 1')
      .max(1000, 'Max folders cannot exceed 1000'),

    maxNestingLevel: z
      .number({
        message: 'Max nesting level is required and must be a number',
      })
      .int('Max nesting level must be an integer')
      .min(1, 'Max nesting level must be at least 1')
      .max(10, 'Max nesting level cannot exceed 10'),

    allowedFileTypes: z
      .array(z.string(), {
        message: 'Allowed file types is required and must be an array of strings',
      })
      .min(1, 'At least one file type must be allowed')
      .max(50, 'Cannot exceed 50 file types'),

    maxFileSize: z
      .number({
        message: 'Max file size is required and must be a number',
      })
      .int('Max file size must be an integer')
      .min(1, 'Max file size must be at least 1 byte'),

    totalFileLimit: z
      .number({
        message: 'Total file limit is required and must be a number',
      })
      .int('Total file limit must be an integer')
      .min(1, 'Total file limit must be at least 1')
      .max(10000, 'Total file limit cannot exceed 10000'),

    filesPerFolder: z
      .number({
        message: 'Files per folder is required and must be a number',
      })
      .int('Files per folder must be an integer')
      .min(1, 'Files per folder must be at least 1')
      .max(1000, 'Files per folder cannot exceed 1000'),
  }),
});

// -- Update Package Validation Schema --
export const updatePackageValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        message: 'Package name must be a string',
      })
      .min(1, 'Package name cannot be empty')
      .max(100, 'Package name cannot exceed 100 characters')
      .optional(),

    maxFolders: z
      .number({
        message: 'Max folders must be a number',
      })
      .int('Max folders must be an integer')
      .min(1, 'Max folders must be at least 1')
      .max(1000, 'Max folders cannot exceed 1000')
      .optional(),

    maxNestingLevel: z
      .number({
        message: 'Max nesting level must be a number',
      })
      .int('Max nesting level must be an integer')
      .min(1, 'Max nesting level must be at least 1')
      .max(10, 'Max nesting level cannot exceed 10')
      .optional(),

    allowedFileTypes: z
      .array(z.string(), {
        message: 'Allowed file types must be an array of strings',
      })
      .min(1, 'At least one file type must be allowed')
      .max(50, 'Cannot exceed 50 file types')
      .optional(),

    maxFileSize: z
      .number({
        message: 'Max file size must be a number',
      })
      .int('Max file size must be an integer')
      .min(1, 'Max file size must be at least 1 byte')
      .optional(),

    totalFileLimit: z
      .number({
        message: 'Total file limit must be a number',
      })
      .int('Total file limit must be an integer')
      .min(1, 'Total file limit must be at least 1')
      .max(10000, 'Total file limit cannot exceed 10000')
      .optional(),

    filesPerFolder: z
      .number({
        message: 'Files per folder must be a number',
      })
      .int('Files per folder must be an integer')
      .min(1, 'Files per folder must be at least 1')
      .max(1000, 'Files per folder cannot exceed 1000')
      .optional(),
  }),
});

// -- Get Package By Id Validation Schema --
export const getPackageByIdValidationSchema = z.object({
  params: z.object({
    id: z
      .string({
        message: 'Package ID is required and must be a string',
      })
      .min(1, 'Package ID cannot be empty'),
  }),
});

// -- Delete Package Validation Schema --
export const deletePackageValidationSchema = z.object({
  params: z.object({
    id: z
      .string({
        message: 'Package ID is required and must be a string',
      })
      .min(1, 'Package ID cannot be empty'),
  }),
});

// -- Get All Packages Validation Schema --
export const getAllPackagesValidationSchema = z.object({
  query: z.object({
    searchTerm: z
      .string({
        message: 'Search term must be a string',
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

export const PackageValidation = {
  createPackageValidationSchema,
  updatePackageValidationSchema,
  getPackageByIdValidationSchema,
  deletePackageValidationSchema,
  getAllPackagesValidationSchema,
};
