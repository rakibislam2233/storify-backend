import { Router } from 'express';
import { UserRole } from '../../../prisma/generated/enums';
import { auth } from '../../middleware/auth.middleware';
import validateRequest from '../../middleware/validation.middleware';
import upload from '../../utils/fileUpload.utils';
import { FileController } from './file.controller';
import { FileValidation } from './files.validation';

const router = Router();

// -- Create File (Single) --
router.post(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  upload.single('file'),
  validateRequest(FileValidation.createFileValidationSchema),
  FileController.createFile
);

// -- Create Multiple Files --
router.post(
  '/multiple',
  auth(UserRole.USER, UserRole.ADMIN),
  upload.array('files', 10),
  validateRequest(FileValidation.createFileValidationSchema),
  FileController.createMultipleFiles
);

// -- Get All Files By User Id --
router.get(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(FileValidation.getFilesByUserIdValidationSchema),
  FileController.getFilesByUserId
);

// -- Get File By Id --
router.get(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(FileValidation.getFileByIdValidationSchema),
  FileController.getFileById
);

// -- Get Files By Folder Id --
router.get(
  '/:id/files',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(FileValidation.getFilesByFolderIdValidationSchema),
  FileController.getFilesByFolderId
);

// -- Update File --
router.patch(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(FileValidation.updateFileValidationSchema),
  FileController.updateFile
);

// -- Delete File --
router.delete(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(FileValidation.deleteFileValidationSchema),
  FileController.deleteFile
);

export const FileRoutes = router;
