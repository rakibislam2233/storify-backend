import { StatusCodes } from 'http-status-codes';
import ApiError from '../../utils/ApiError';
import { ICreatePackage, IPackage, IPackageFilter } from './packages.interface';
import { PackageRepository } from './packages.repository';
import {
  IPaginationOptions,
  IPaginationResult,
} from '../../shared/interfaces/pagination.interface';

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

const getAllPackages = async (
  filters: IPackageFilter,
  options: IPaginationOptions
): Promise<IPaginationResult<IPackage>> => {
  return await PackageRepository.getAllPackages(filters, options);
};
