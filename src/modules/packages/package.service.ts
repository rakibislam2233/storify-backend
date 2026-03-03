import { StatusCodes } from 'http-status-codes';
import ApiError from '../../utils/ApiError';
import { ICreatePackage, IPackage, IPackageFilter, IUpdatePackage } from './packages.interface';
import { PackageRepository } from './packages.repository';
import {
  IPaginationOptions,
  IPaginationResult,
} from '../../shared/interfaces/pagination.interface';

// -- Create Package --
const createPackage = async (packageData: ICreatePackage): Promise<IPackage> => {
  //check if package already exists
  const packageExists = await PackageRepository.getPackageByName(packageData.name);
  if (packageExists) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Package ${packageData.name} already exists! Please try another name.`
    );
  }
  return await PackageRepository.createPackage(packageData);
};

// -- Get All Packages --
const getAllPackages = async (
  filters: IPackageFilter,
  options: IPaginationOptions
): Promise<IPaginationResult<IPackage>> => {
  return await PackageRepository.getAllPackages(filters, options);
};

// -- Get Package By Id --
const getPackageById = async (id: string): Promise<IPackage> => {
  const packageExists = await PackageRepository.getPackageById(id);
  if (!packageExists || packageExists.isDeleted) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Package not found');
  }
  return packageExists;
};

// -- Update Package --
const updatedPackage = async (id: string, packageData: IUpdatePackage): Promise<IPackage> => {
  const packageExists = await PackageRepository.getPackageById(id);
  if (!packageExists || packageExists.isDeleted) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Package not found');
  }
  return await PackageRepository.updatePackage(id, packageData);
};

// -- Delete Package --
const deletedPackage = async (id: string): Promise<IPackage> => {
  const packageExists = await PackageRepository.getPackageById(id);
  if (!packageExists || packageExists.isDeleted) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Package not found');
  }
  return await PackageRepository.deletePackage(id);
};

// -- Export Package Service --
export const PackageService = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatedPackage,
  deletedPackage,
};
