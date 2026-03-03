import { database } from '../../config/database.config';
import {
  IPaginationOptions,
  IPaginationResult,
} from '../../shared/interfaces/pagination.interface';
import {
  createPaginationQuery,
  createPaginationResult,
  parsePaginationOptions,
} from '../../utils/pagination.utils';
import { ICreatePackage, IPackage, IPackageFilter, IUpdatePackage } from './packages.interface';

// -- Create Package --
const createPackage = async (packageData: ICreatePackage): Promise<IPackage> => {
  const newPackage = await database.package.create({
    data: packageData,
  });
  return newPackage;
};

// -- Get All Packages --
const getAllPackages = async (
  filters: IPackageFilter,
  options: IPaginationOptions
): Promise<IPaginationResult<IPackage>> => {
  const pagination = parsePaginationOptions(options);
  const { skip, take, orderBy } = createPaginationQuery(pagination);
  const where: any = { isDeleted: false };
  if (filters.searchTerm) {
    where.OR = [{ name: { contains: filters.searchTerm } }];
  }
  const [subPackages, total] = await Promise.all([
    database.package.findMany({
      where,
      select: {
        id: true,
        name: true,
        maxFolders: true,
        maxFileSize: true,
        maxNestingLevel: true,
        totalFileLimit: true,
        filesPerFolder: true,
        allowedFileTypes: true,
        createdAt: true,
        updatedAt: true,
      },
      skip,
      take,
      orderBy,
    }),
    database.package.count({
      where,
    }),
  ]);
  return createPaginationResult(subPackages, total, pagination);
};

// -- Get Package By Id --
const getPackageById = async (id: string) => {
  const subPackage = await database.package.findUnique({
    where: { id },
  });
  return subPackage;
};

// -- Get Package By Name --
const getPackageByName = async (name: string) => {
  const subPackage = await database.package.findUnique({
    where: { name },
  });
  return subPackage;
};

// -- Update Package --
const updatePackage = async (id: string, packageData: IUpdatePackage) => {
  const updatedPackage = await database.package.update({
    where: { id },
    data: packageData,
  });
  return updatedPackage;
};

// -- Delete Package --
const deletePackage = async (id: string) => {
  const deletedPackage = await database.package.update({
    where: { id },
    data: { isDeleted: true },
  });
  return deletedPackage;
};

// -- Export Package Repository --
export const PackageRepository = {
  createPackage,
  getAllPackages,
  getPackageById,
  getPackageByName,
  updatePackage,
  deletePackage,
};
