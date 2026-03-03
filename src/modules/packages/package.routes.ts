import { Router } from 'express';
import { PackageController } from './package.controller';
import { PackageValidation } from './packages.validation';
import validateRequest from '../../middleware/validation.middleware';
import { auth } from '../../middleware/auth.middleware';
import { UserRole } from '../../../prisma/generated/enums';

const router = Router();

// -- Create Package --
router.post(
  '/',
  auth(UserRole.ADMIN),
  validateRequest(PackageValidation.createPackageValidationSchema),
  PackageController.createPackage
);

// -- Get All Packages --
router.get(
  '/',
  validateRequest(PackageValidation.getAllPackagesValidationSchema),
  PackageController.getAllPackages
);

router
  .route('/:id')
  //   -- Get Package By Id --
  .get(
    auth(UserRole.ADMIN),
    validateRequest(PackageValidation.getPackageByIdValidationSchema),
    PackageController.getPackageById
  )
  //   -- Update Package --
  .patch(
    auth(UserRole.ADMIN),
    validateRequest(PackageValidation.updatePackageValidationSchema),
    PackageController.updatedPackage
  )
  //   -- Delete Package --
  .delete(
    auth(UserRole.ADMIN),
    validateRequest(PackageValidation.deletePackageValidationSchema),
    PackageController.deletedPackage
  );

export const PackageRoutes = router;
