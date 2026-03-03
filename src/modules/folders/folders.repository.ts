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
import { ICreateFolder, IFolder, IFolderFilter, IUpdateFolder } from './folders.interface';

// -- Create Folder --
const createFolder = async (userId: string, payload: ICreateFolder) => {
  return database.folder.create({
    data: {
      ...payload,
      userId,
    },
  });
};

// -- Get Folder By Id --
const getFolderById = async (id: string): Promise<IFolder | null> => {
  return database.folder.findUnique({
    where: { id },
    include: {
      children: true,
      parent: true,
    },
  });
};

// -- Get Folders By User Id --
const getFoldersByUserId = async (
  userId: string,
  filters: IFolderFilter,
  options: IPaginationOptions
): Promise<IPaginationResult<IFolder>> => {
  const pagination = parsePaginationOptions(options);
  const { skip, take, orderBy } = createPaginationQuery(pagination);
  const where: any = { userId };

  if (filters.searchTerm) {
    where.OR = [{ name: { contains: filters.searchTerm, mode: 'insensitive' } }];
  }

  if (filters.level !== undefined) {
    where.level = filters.level;
  }

  if (filters.parentId !== undefined) {
    where.parentId = filters.parentId;
  }

  const [folders, total] = await Promise.all([
    database.folder.findMany({
      where,
      include: {
        children: true,
        parent: true,
      },
      skip,
      take,
      orderBy,
    }),
    database.folder.count({
      where,
    }),
  ]);

  return createPaginationResult(folders, total, pagination);
};

// -- Get Root Folders By User Id (folders without parent) --
const getRootFoldersByUserId = async (
  userId: string,
  filters: IFolderFilter,
  options: IPaginationOptions
): Promise<IPaginationResult<IFolder>> => {
  const pagination = parsePaginationOptions(options);
  const { skip, take, orderBy } = createPaginationQuery(pagination);
  const where: any = {
    userId,
    parentId: null,
  };

  if (filters.searchTerm) {
    where.OR = [{ name: { contains: filters.searchTerm, mode: 'insensitive' } }];
  }

  if (filters.level !== undefined) {
    where.level = filters.level;
  }

  const [folders, total] = await Promise.all([
    database.folder.findMany({
      where,
      include: {
        children: true,
      },
      skip,
      take,
      orderBy,
    }),
    database.folder.count({
      where,
    }),
  ]);

  return createPaginationResult(folders, total, pagination);
};

// -- Get Child Folders By Parent Id --
const getChildFoldersByParentId = async (parentId: string, userId: string): Promise<IFolder[]> => {
  return database.folder.findMany({
    where: {
      parentId,
      userId,
    },
    include: {
      children: true,
      parent: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

// -- Update Folder --
const updateFolder = async (
  id: string,
  userId: string,
  payload: IUpdateFolder
): Promise<IFolder> => {
  return database.folder.update({
    where: { id },
    data: payload,
  });
};

// -- Delete Folder --
const deleteFolder = async (id: string, userId: string): Promise<IFolder> => {
  return database.folder.delete({
    where: { id },
  });
};

// -- Check Folder Exists --
const checkFolderExists = async (id: string, userId: string): Promise<boolean> => {
  const folder = await database.folder.findFirst({
    where: {
      id,
      userId,
    },
  });
  return !!folder;
};

// -- Check Folder Name Exists in Parent --
const checkFolderNameExists = async (
  name: string,
  userId: string,
  parentId?: string
): Promise<boolean> => {
  const folder = await database.folder.findFirst({
    where: {
      name,
      userId,
      parentId: parentId || null,
    },
  });
  return !!folder;
};

// -- Get Folder Level --
const getFolderLevel = async (id: string): Promise<number> => {
  const folder = await database.folder.findUnique({
    where: { id },
    select: { level: true },
  });
  return folder?.level || 0;
};

// -- Export Folder Repository --
export const FolderRepository = {
  createFolder,
  getFolderById,
  getFoldersByUserId,
  getRootFoldersByUserId,
  getChildFoldersByParentId,
  updateFolder,
  deleteFolder,
  checkFolderExists,
  checkFolderNameExists,
  getFolderLevel,
};
