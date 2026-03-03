import { Router } from 'express';
import { UserRole } from '../../../prisma/generated/enums';
import { auth } from '../../middleware/auth.middleware';
import validateRequest from '../../middleware/validation.middleware';
import { FolderController } from './folder.controller';
import { FolderValidation } from './folders.validation';

const router = Router();

// -- Create Folder --
router.post(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(FolderValidation.createFolderValidationSchema),
  FolderController.createFolder
);

// -- Get All Folders By User Id --
router.get(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(FolderValidation.getFoldersByUserIdValidationSchema),
  FolderController.getFoldersByUserId
);

// -- Get Root Folders By User Id --
router.get(
  '/root',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(FolderValidation.getRootFoldersByUserIdValidationSchema),
  FolderController.getRootFoldersByUserId
);

// -- Folder By Id Routes --
router
  .route('/:id')
  // -- Get Folder By Id --
  .get(
    auth(UserRole.USER, UserRole.ADMIN),
    validateRequest(FolderValidation.getFolderByIdValidationSchema),
    FolderController.getFolderById
  )
  // -- Update Folder --
  .patch(
    auth(UserRole.USER, UserRole.ADMIN),
    validateRequest(FolderValidation.updateFolderValidationSchema),
    FolderController.updateFolder
  )
  // -- Delete Folder --
  .delete(
    auth(UserRole.USER, UserRole.ADMIN),
    validateRequest(FolderValidation.deleteFolderValidationSchema),
    FolderController.deleteFolder
  );

// -- Get Child Folders By Parent Id --
router.get(
  '/:id/children',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(FolderValidation.getChildFoldersByParentIdValidationSchema),
  FolderController.getChildFoldersByParentId
);

export const FolderRoutes = router;
