import { StatusCodes } from 'http-status-codes';
import { UserRole, UserStatus } from '../../../prisma/generated/enums';
import ApiError from '../../utils/ApiError';
import { UserRepository } from '../user/user.repository';
import { ICreateFolder } from './folders.interface';
import { FolderRepository } from './folders.repository';

const createFolder = async (userId: string, payload: ICreateFolder) => {
  //Check user exists and active package
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
    const parentFolder = await FolderRepository.getRootFoldersByParentId(payload?.parentId);
    currentLevel = (parentFolder?.level || 1) + 1;
    if (currentLevel > user.activePackage.maxNestingLevel) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Maximum nesting level reached.');
    }
  }
  const result = await FolderRepository.createFolder(userId, payload);

  return result;
};
