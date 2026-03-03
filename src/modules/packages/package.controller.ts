import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick.utils';
import sendResponse from '../../utils/sendResponse';
import { PackageService } from './package.service';

// -- Create Package --
const createPackage = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await PackageService.createPackage(payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Package created successfully',
    data: result,
  });
});

// -- Get All Packages --
const getAllPackages = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await PackageService.getAllPackages(filters, options);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    meta: result.meta,
    message: 'Packages retrieved successfully',
    data: result.data,
  });
});

// -- Get Package By Id --
const getPackageById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await PackageService.getPackageById(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Package retrieved successfully',
    data: result,
  });
});

// -- Update Package --
const updatedPackage = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const payload = req.body;
  const result = await PackageService.updatedPackage(id, payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Package updated successfully',
    data: result,
  });
});

// -- Delete Package --
const deletedPackage = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await PackageService.deletedPackage(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Package deleted successfully',
  });
});

// -- Export Package Controller --
export const PackageController = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatedPackage,
  deletedPackage,
};
