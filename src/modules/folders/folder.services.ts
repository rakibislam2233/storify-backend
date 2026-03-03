import { StatusCodes } from 'http-status-codes';
import { UserStatus } from '../../../prisma/generated/enums';
import ApiError from '../../utils/ApiError';
import { RedisUtils } from '../../utils/redis.utils';
import { UserRepository } from '../user/user.repository';
import { IFolderFilter, IUpdateFolder } from './folders.interface';
import { FolderRepository } from './folders.repository';
import { FOLDER_CACHE_KEY, FOLDER_CACHE_TTL } from './folder.cache';

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

// -- Export Folder Service --
export const FolderService = {
  createFolder,
};
