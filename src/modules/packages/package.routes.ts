import { Router } from 'express';
import { PackageController } from './package.controller';

const router = Router();

// -- Create Package --
router.post('/', PackageController.createPackage);

// -- Get All Packages --
router.get('/', PackageController.getAllPackages);

// -- Get Package By Id --
router.get('/:id', PackageController.getPackageById);

// -- Update Package --
router.patch('/:id', PackageController.updatedPackage);

// -- Delete Package --
router.delete('/:id', PackageController.deletedPackage);

export const PackageRoutes = router;
