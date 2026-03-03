import { StatusCodes } from 'http-status-codes';
import {
  IPaginationOptions,
  IPaginationResult,
} from '../../shared/interfaces/pagination.interface';
import ApiError from '../../utils/ApiError';
import { RedisUtils } from '../../utils/redis.utils';
import { PACKAGE_CACHE_KEY, PACKAGE_CACHE_TTL } from './packages.cache';
import { ICreatePackage, IPackage, IPackageFilter, IUpdatePackage } from './packages.interface';
import { PackageRepository } from './packages.repository';

// -- Create Package --
const createPackage = async (packageData: ICreatePackage): Promise<IPackage> => {
  // Check cache first for existing package
  const cacheKey = PACKAGE_CACHE_KEY.BY_NAME(packageData.name);
  const cachedPackage = await RedisUtils.getCache<IPackage>(cacheKey);

  if (cachedPackage) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Package ${packageData.name} already exists! Please try another name.`
    );
  }

  //check if package already exists in database
  const packageExists = await PackageRepository.getPackageByName(packageData.name);
  if (packageExists) {
    // Cache the existing package
    await RedisUtils.setCache(cacheKey, packageExists, PACKAGE_CACHE_TTL.BY_NAME);
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Package ${packageData.name} already exists! Please try another name.`
    );
  }

  const newPackage = await PackageRepository.createPackage(packageData);

  // Cache the new package
  await RedisUtils.setCache(
    PACKAGE_CACHE_KEY.BY_ID(newPackage.id),
    newPackage,
    PACKAGE_CACHE_TTL.BY_ID
  );
  await RedisUtils.setCache(
    PACKAGE_CACHE_KEY.BY_NAME(newPackage.name),
    newPackage,
    PACKAGE_CACHE_TTL.BY_NAME
  );

  // Clear list caches
  await RedisUtils.deleteCachePattern(PACKAGE_CACHE_KEY.LIST);
  await RedisUtils.deleteCachePattern(PACKAGE_CACHE_KEY.ACTIVE);

  return newPackage;
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
  const cacheKey = PACKAGE_CACHE_KEY.BY_ID(id);
  const cachedPackage = await RedisUtils.getCache<IPackage>(cacheKey);

  if (cachedPackage) {
    if (cachedPackage.isDeleted) {
      await RedisUtils.deleteCache(cacheKey);
      throw new ApiError(StatusCodes.NOT_FOUND, 'Package not found');
    }
    return cachedPackage;
  }

  const packageExists = await PackageRepository.getPackageById(id);
  if (!packageExists || packageExists.isDeleted) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Package not found');
  }

  await RedisUtils.setCache(cacheKey, packageExists, PACKAGE_CACHE_TTL.BY_ID);
  return packageExists;
};

// -- Update Package --
const updatedPackage = async (id: string, packageData: IUpdatePackage): Promise<IPackage> => {
  const packageExists = await PackageRepository.getPackageById(id);
  if (!packageExists || packageExists.isDeleted) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Package not found');
  }

  const updatedPackageData = await PackageRepository.updatePackage(id, packageData);

  // Update cache
  await RedisUtils.setCache(
    PACKAGE_CACHE_KEY.BY_ID(id),
    updatedPackageData,
    PACKAGE_CACHE_TTL.BY_ID
  );

  // If name was updated, clear old name cache and set new one
  if (packageData.name && packageData.name !== packageExists.name) {
    await RedisUtils.deleteCache(PACKAGE_CACHE_KEY.BY_NAME(packageExists.name));
    await RedisUtils.setCache(
      PACKAGE_CACHE_KEY.BY_NAME(updatedPackageData.name),
      updatedPackageData,
      PACKAGE_CACHE_TTL.BY_NAME
    );
  }

  // Clear list caches
  await RedisUtils.deleteCachePattern(PACKAGE_CACHE_KEY.LIST);
  await RedisUtils.deleteCachePattern(PACKAGE_CACHE_KEY.ACTIVE);

  return updatedPackageData;
};

// -- Delete Package --
const deletedPackage = async (id: string): Promise<IPackage> => {
  const packageExists = await PackageRepository.getPackageById(id);
  if (!packageExists || packageExists.isDeleted) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Package not found');
  }

  const deletedPackageData = await PackageRepository.deletePackage(id);

  // Remove from cache
  await RedisUtils.deleteCache(PACKAGE_CACHE_KEY.BY_ID(id));
  await RedisUtils.deleteCache(PACKAGE_CACHE_KEY.BY_NAME(deletedPackageData.name));

  // Clear list caches
  await RedisUtils.deleteCachePattern(PACKAGE_CACHE_KEY.LIST);
  await RedisUtils.deleteCachePattern(PACKAGE_CACHE_KEY.ACTIVE);

  return deletedPackageData;
};

// -- Export Package Service --
export const PackageService = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatedPackage,
  deletedPackage,
};
