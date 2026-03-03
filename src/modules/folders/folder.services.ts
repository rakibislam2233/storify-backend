import { StatusCodes } from 'http-status-codes';
import { UserStatus } from '../../../prisma/generated/enums';
import ApiError from '../../utils/ApiError';
import { RedisUtils } from '../../utils/redis.utils';
import { UserRepository } from '../user/user.repository';
import { FOLDER_CACHE_KEY, FOLDER_CACHE_TTL } from './folder.cache';
import { IFolderFilter, IUpdateFolder } from './folders.interface';
import { FolderRepository } from './folders.repository';

// -- Create Folder --
const createFolder = async (userId: string, payload: any) => {
  // Check user exists and active package
  const user = await UserRepository.getUserById(userId);
  if (!user || user.status === UserStatus.DELETED) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  if (!user.activePackage) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'No active package found');
  }

  // Check user max folders limit
  const foldersCount = await FolderRepository.getFoldersByUserId(userId, {}, {});
  if (foldersCount?.data?.length >= user?.activePackage?.maxFolders) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Max folders reached for your plan.');
  }

  // Check Nested level
  let currentLevel = 1;
  if (payload.parentId) {
    const parentFolder = await FolderRepository.getFolderById(payload.parentId);
    if (!parentFolder) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Parent folder not found');
    }
    if (parentFolder.userId !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You can only create folders in your own folders');
    }
    currentLevel = (parentFolder?.level || 1) + 1;
    if (currentLevel > user.activePackage.maxNestingLevel) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Maximum nesting level reached.');
    }
  }

  // Check folder name exists in parent
  const folderNameExists = await FolderRepository.checkFolderNameExists(
    payload.name,
    userId,
    payload.parentId
  );
  if (folderNameExists) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Folder with this name already exists in this location'
    );
  }
  const result = await FolderRepository.createFolder(userId, payload);
  // Clear cache
  await RedisUtils.deleteCache(FOLDER_CACHE_KEY.USER_FOLDERS(userId));
  await RedisUtils.deleteCache(FOLDER_CACHE_KEY.ROOT_FOLDERS(userId));

  return result;
};

// -- Get Folder By Id --
const getFolderById = async (id: string, userId: string) => {
  const cacheKey = FOLDER_CACHE_KEY.FOLDER(id);
  const cachedFolder = await RedisUtils.getCache<any>(cacheKey);

  if (cachedFolder) {
    // Check if user owns this folder
    if (cachedFolder.userId !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to access this folder');
    }
    return cachedFolder;
  }

  const folder = await FolderRepository.getFolderById(id);

  if (!folder) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Folder not found');
  }
  // Check if user owns this folder
  if (folder.userId !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to access this folder');
  }
  await RedisUtils.setCache(cacheKey, folder, FOLDER_CACHE_TTL.FOLDER);

  return folder;
};

// -- Get All Folders By User Id --
const getFoldersByUserId = async (userId: string, filters: IFolderFilter, options: any) => {
  const cacheKey = FOLDER_CACHE_KEY.USER_FOLDERS(userId);
  const cachedFolders = await RedisUtils.getCache<any>(cacheKey);
  if (cachedFolders && !filters.searchTerm && !filters.level && !filters.parentId) {
    return cachedFolders;
  }
  // Check user exists
  const user = await UserRepository.getUserById(userId);
  if (!user || user.status === UserStatus.DELETED) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  const result = await FolderRepository.getFoldersByUserId(userId, filters, options);

  // Only cache if no filters applied
  if (!filters.searchTerm && !filters.level && !filters.parentId) {
    await RedisUtils.setCache(cacheKey, result, FOLDER_CACHE_TTL.USER_FOLDERS);
  }

  return result;
};

// -- Get Root Folders By User Id --
const getRootFoldersByUserId = async (userId: string, filters: IFolderFilter, options: any) => {
  const cacheKey = FOLDER_CACHE_KEY.ROOT_FOLDERS(userId);

  const cachedFolders = await RedisUtils.getCache<any>(cacheKey);

  if (cachedFolders && !filters.searchTerm && !filters.level) {
    return cachedFolders;
  }

  // Check user exists

  const user = await UserRepository.getUserById(userId);

  if (!user || user.status === UserStatus.DELETED) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const result = await FolderRepository.getRootFoldersByUserId(userId, filters, options);

  // Only cache if no filters applied

  if (!filters.searchTerm && !filters.level) {
    await RedisUtils.setCache(cacheKey, result, FOLDER_CACHE_TTL.ROOT_FOLDERS);
  }

  return result;
};

// -- Get Child Folders By Parent Id --
const getChildFoldersByParentId = async (parentId: string, userId: string) => {
  // Check parent folder exists and user owns it

  const parentFolder = await FolderRepository.getFolderById(parentId);

  if (!parentFolder) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Parent folder not found');
  }

  if (parentFolder.userId !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Access denied');
  }

  return await FolderRepository.getChildFoldersByParentId(parentId, userId);
};

// -- Update Folder --
const updateFolder = async (id: string, userId: string, payload: IUpdateFolder) => {
  // Check folder exists and user owns it
  const existingFolder = await FolderRepository.getFolderById(id);

  if (!existingFolder) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Folder not found');
  }

  if (existingFolder.userId !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Access denied');
  }

  // If updating parent, check nesting level and ownership
  if (payload.parentId !== undefined) {
    if (payload.parentId && payload.parentId !== existingFolder.parentId) {
      const newParentFolder = await FolderRepository.getFolderById(payload.parentId);

      if (!newParentFolder) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'New parent folder not found');
      }

      if (newParentFolder.userId !== userId) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'You can only move folders to your own folders');
      }

      if (newParentFolder.id === existingFolder.id) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot move folder to itself');
      }

      // Check if this would create a circular reference

      const isCircular = await checkCircularReference(existingFolder.id, payload.parentId);

      if (isCircular) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,

          'Cannot move folder: would create circular reference'
        );
      }

      // Check nesting level

      const user = await UserRepository.getUserById(userId);

      if (!user || !user.activePackage) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'User or active package not found');
      }

      const newLevel = (newParentFolder?.level || 1) + 1;

      if (newLevel > user.activePackage.maxNestingLevel) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Maximum nesting level reached.');
      }
    }
  }

  // If updating name, check if name exists in parent
  if (payload.name && payload.name !== existingFolder.name) {
    const parentId = payload.parentId !== undefined ? payload.parentId : existingFolder.parentId;

    const folderNameExists = await FolderRepository.checkFolderNameExists(
      payload.name,

      userId,

      parentId || undefined
    );

    if (folderNameExists) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,

        'Folder with this name already exists in this location'
      );
    }
  }
  const result = await FolderRepository.updateFolder(id, userId, payload);

  // Clear cache

  await RedisUtils.deleteCache(FOLDER_CACHE_KEY.FOLDER(id));

  await RedisUtils.deleteCache(FOLDER_CACHE_KEY.USER_FOLDERS(userId));

  await RedisUtils.deleteCache(FOLDER_CACHE_KEY.ROOT_FOLDERS(userId));

  return result;
};

// -- Delete Folder --
const deleteFolder = async (id: string, userId: string) => {
  // Check folder exists and user owns it
  const existingFolder = await FolderRepository.getFolderById(id);
  if (!existingFolder) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Folder not found');
  }
  if (existingFolder.userId !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Access denied');
  }
  // Check if folder has children
  if (existingFolder.children && existingFolder.children.length > 0) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,

      'Cannot delete folder with subfolders. Please delete subfolders first.'
    );
  }
  const result = await FolderRepository.deleteFolder(id, userId);
  // Clear cache
  await RedisUtils.deleteCache(FOLDER_CACHE_KEY.FOLDER(id));
  await RedisUtils.deleteCache(FOLDER_CACHE_KEY.USER_FOLDERS(userId));
  await RedisUtils.deleteCache(FOLDER_CACHE_KEY.ROOT_FOLDERS(userId));

  return result;
};

// -- Helper function --
const checkCircularReference = async (folderId: string, newParentId: string): Promise<boolean> => {
  let currentParent = await FolderRepository.getFolderById(newParentId);

  while (currentParent) {
    if (currentParent.id === folderId) {
      return true; // Circular reference found
    }

    if (!currentParent.parentId) {
      break;
    }

    currentParent = await FolderRepository.getFolderById(currentParent.parentId);
  }

  return false;
};
// -- Export Folder Service --
export const FolderService = {
  createFolder,
  getFolderById,
  getFoldersByUserId,
  updateFolder,
  deleteFolder,
  getChildFoldersByParentId,
  getRootFoldersByUserId,
};
