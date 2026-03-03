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
import { ICreateFile, IFile, IFileFilter, IUpdateFile } from './files.interface';

// -- Create File --
const createFile = async (userId: string, payload: ICreateFile) => {
  return database.file.create({
    data: {
      ...payload,
      userId,
    },
  });
};

// -- Get File By Id --
const getFileById = async (id: string): Promise<IFile | null> => {
  return database.file.findUnique({
    where: { id, isDeleted: false },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
      folder: {
        select: {
          id: true,
          name: true,
          level: true,
        },
      },
    },
  });
};

// -- Get Files By User Id --
const getFilesByUserId = async (
  userId: string,
  filters: IFileFilter,
  options: IPaginationOptions
): Promise<IPaginationResult<IFile>> => {
  const pagination = parsePaginationOptions(options);
  const { skip, take, orderBy } = createPaginationQuery(pagination);
  const where: any = { 
    userId, 
    isDeleted: false 
  };
  
  if (filters.searchTerm) {
    where.OR = [
      { name: { contains: filters.searchTerm, mode: 'insensitive' } },
      { type: { contains: filters.searchTerm, mode: 'insensitive' } },
    ];
  }
  
  if (filters.type) {
    where.type = { contains: filters.type, mode: 'insensitive' };
  }
  
  if (filters.folderId) {
    where.folderId = filters.folderId;
  }

  const [files, total] = await Promise.all([
    database.file.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        folder: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
      },
      skip,
      take,
      orderBy,
    }),
    database.file.count({
      where,
    }),
  ]);
  
  return createPaginationResult(files, total, pagination);
};

// -- Get Files By Folder Id --
const getFilesByFolderId = async (
  folderId: string,
  filters: IFileFilter,
  options: IPaginationOptions
): Promise<IPaginationResult<IFile>> => {
  const pagination = parsePaginationOptions(options);
  const { skip, take, orderBy } = createPaginationQuery(pagination);
  const where: any = { 
    folderId,
    isDeleted: false,
  };
  
  if (filters.searchTerm) {
    where.OR = [
      { name: { contains: filters.searchTerm, mode: 'insensitive' } },
      { type: { contains: filters.searchTerm, mode: 'insensitive' } },
    ];
  }
  
  if (filters.type) {
    where.type = { contains: filters.type, mode: 'insensitive' };
  }

  const [files, total] = await Promise.all([
    database.file.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        folder: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
      },
      skip,
      take,
      orderBy,
    }),
    database.file.count({
      where,
    }),
  ]);
  
  return createPaginationResult(files, total, pagination);
};

// -- Update File --
const updateFile = async (
  id: string,
  userId: string,
  payload: IUpdateFile
): Promise<IFile> => {
  return database.file.update({
    where: { id },
    data: payload,
  });
};

// -- Delete File (Soft Delete) --
const deleteFile = async (id: string, userId: string): Promise<IFile> => {
  return database.file.update({
    where: { id },
    data: { isDeleted: true },
  });
};

// -- Check File Exists --
const checkFileExists = async (id: string, userId: string): Promise<boolean> => {
  const file = await database.file.findFirst({
    where: { 
      id,
      userId,
      isDeleted: false,
    },
  });
  return !!file;
};

// -- Check File Name Exists in Folder --
const checkFileNameExists = async (name: string, userId: string, folderId: string): Promise<boolean> => {
  const file = await database.file.findFirst({
    where: { 
      name,
      userId,
      folderId,
      isDeleted: false,
    },
  });
  return !!file;
};

// -- Get Files Count By Folder Id --
const getFilesCountByFolderId = async (folderId: string): Promise<number> => {
  return database.file.count({
    where: {
      folderId,
      isDeleted: false,
    },
  });
};

// -- Get Total Files Size By User Id --
const getTotalFilesSizeByUserId = async (userId: string): Promise<number> => {
  const result = await database.file.aggregate({
    where: {
      userId,
      isDeleted: false,
    },
    _sum: {
      size: true,
    },
  });
  
  return result._sum.size || 0;
};

// -- Export File Repository --
export const FileRepository = {
  createFile,
  getFileById,
  getFilesByUserId,
  getFilesByFolderId,
  updateFile,
  deleteFile,
  checkFileExists,
  checkFileNameExists,
  getFilesCountByFolderId,
  getTotalFilesSizeByUserId,
};
