import { StatusCodes } from 'http-status-codes';
import { UserStatus } from '../../../prisma/generated/enums';
import ApiError from '../../utils/ApiError';
import { RedisUtils } from '../../utils/redis.utils';
import { UserRepository } from '../user/user.repository';
import { FolderRepository } from '../folders/folders.repository';
import { IFileFilter, IUpdateFile } from './files.interface';
import { FileRepository } from './files.repository';
import { FILE_CACHE_KEY, FILE_CACHE_TTL } from './file.cache';

// -- Create File --
const createFile = async (userId: string, payload: any) => {
  // Check user exists and active package
  const user = await UserRepository.getUserById(userId);
  if (!user || user.status === UserStatus.DELETED) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  if (!user.activePackage) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'No active package found');
  }

  // Check folder exists and user owns it
  const folder = await FolderRepository.getFolderById(payload.folderId);
  if (!folder) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Folder not found');
  }
  if (folder.userId !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You can only upload files to your own folders');
  }

  // Check file size limit
  if (payload.size > user.activePackage.maxFileSize * 1024 * 1024) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'File size exceeds maximum limit for your plan');
  }

  // Check files per folder limit
  const filesCount = await FileRepository.getFilesCountByFolderId(payload.folderId);
  if (filesCount >= user.activePackage.filesPerFolder) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Maximum files per folder reached for your plan');
  }

  // Check total file limit
  const totalSize = await FileRepository.getTotalFilesSizeByUserId(userId);
  const newTotalSize = totalSize + payload.size;
  if (newTotalSize > user.activePackage.totalFileLimit * 1024 * 1024) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Total storage limit exceeded for your plan');
  }

  // Check file type is allowed
  const fileExtension = payload.type.split('/')[1]?.toLowerCase();
  const allowedTypes = user.activePackage.allowedFileTypes;
  const isAllowed = allowedTypes.some(type => 
    type.toLowerCase() === fileExtension || 
    type.toLowerCase() === payload.type.toLowerCase()
  );
  if (!isAllowed) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'File type not allowed in your plan');
  }

  // Check file name exists in folder
  const fileNameExists = await FileRepository.checkFileNameExists(
    payload.name,
    userId,
    payload.folderId
  );
  if (fileNameExists) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'File with this name already exists in this folder');
  }

  const result = await FileRepository.createFile(userId, payload);

  // Clear cache
  await RedisUtils.deleteCache(FILE_CACHE_KEY.USER_FILES(userId));
  await RedisUtils.deleteCache(FILE_CACHE_KEY.FOLDER_FILES(payload.folderId));

  return result;
};

// -- Get File By Id --
const getFileById = async (id: string, userId: string) => {
  const cacheKey = FILE_CACHE_KEY.FILE(id);
  const cachedFile = await RedisUtils.getCache<any>(cacheKey);

  if (cachedFile) {
    // Check if user owns this file
    if (cachedFile.userId !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to access this file');
    }
    return cachedFile;
  }

  const file = await FileRepository.getFileById(id);
  if (!file) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'File not found');
  }

  // Check if user owns this file
  if (file.userId !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to access this file');
  }

  await RedisUtils.setCache(cacheKey, file, FILE_CACHE_TTL.FILE);
  return file;
};

// -- Get All Files By User Id --
const getFilesByUserId = async (
  userId: string,
  filters: IFileFilter,
  options: any
) => {
  const cacheKey = FILE_CACHE_KEY.USER_FILES(userId);
  const cachedFiles = await RedisUtils.getCache<any>(cacheKey);

  // Return cached data only if no filters are applied
  if (cachedFiles && !filters.searchTerm && !filters.type && !filters.folderId) {
    return cachedFiles;
  }

  // Check user exists
  const user = await UserRepository.getUserById(userId);
  if (!user || user.status === UserStatus.DELETED) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const result = await FileRepository.getFilesByUserId(userId, filters, options);

  // Only cache when no filters are applied
  if (!filters.searchTerm && !filters.type && !filters.folderId) {
    await RedisUtils.setCache(cacheKey, result, FILE_CACHE_TTL.USER_FILES);
  }

  return result;
};

// -- Get Files By Folder Id --
const getFilesByFolderId = async (
  folderId: string,
  filters: IFileFilter,
  options: any
) => {
  const cacheKey = FILE_CACHE_KEY.FOLDER_FILES(folderId);
  const cachedFiles = await RedisUtils.getCache<any>(cacheKey);

  // Return cached data only if no filters are applied
  if (cachedFiles && !filters.searchTerm && !filters.type) {
    return cachedFiles;
  }

  // Check folder exists
  const folder = await FolderRepository.getFolderById(folderId);
  if (!folder) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Folder not found');
  }

  const result = await FileRepository.getFilesByFolderId(folderId, filters, options);

  // Only cache when no filters are applied
  if (!filters.searchTerm && !filters.type) {
    await RedisUtils.setCache(cacheKey, result, FILE_CACHE_TTL.FOLDER_FILES);
  }

  return result;
};

// -- Update File --
const updateFile = async (id: string, userId: string, payload: IUpdateFile) => {
  // Check file exists and user owns it
  const existingFile = await FileRepository.getFileById(id);
  if (!existingFile) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'File not found');
  }
  if (existingFile.userId !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Access denied');
  }

  // If updating folder, check folder exists and user owns it
  if (payload.folderId && payload.folderId !== existingFile.folderId) {
    const newFolder = await FolderRepository.getFolderById(payload.folderId);
    if (!newFolder) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'New folder not found');
    }
    if (newFolder.userId !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You can only move files to your own folders');
    }

    // Check files per folder limit in new folder
    const filesCount = await FileRepository.getFilesCountByFolderId(payload.folderId);
    if (filesCount >= 10) { // TODO: Get from user package
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Maximum files per folder reached');
    }
  }

  // If updating name, check if name exists in folder
  if (payload.name && payload.name !== existingFile.name) {
    const folderId = payload.folderId || existingFile.folderId;
    const fileNameExists = await FileRepository.checkFileNameExists(
      payload.name,
      userId,
      folderId
    );
    if (fileNameExists) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'File with this name already exists in this folder');
    }
  }

  const result = await FileRepository.updateFile(id, userId, payload);

  // Clear cache
  await RedisUtils.deleteCache(FILE_CACHE_KEY.FILE(id));
  await RedisUtils.deleteCache(FILE_CACHE_KEY.USER_FILES(userId));
  await RedisUtils.deleteCache(FILE_CACHE_KEY.FOLDER_FILES(existingFile.folderId));
  if (payload.folderId && payload.folderId !== existingFile.folderId) {
    await RedisUtils.deleteCache(FILE_CACHE_KEY.FOLDER_FILES(payload.folderId));
  }

  return result;
};

// -- Delete File --
const deleteFile = async (id: string, userId: string) => {
  // Check file exists and user owns it
  const existingFile = await FileRepository.getFileById(id);
  if (!existingFile) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'File not found');
  }
  if (existingFile.userId !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Access denied');
  }

  const result = await FileRepository.deleteFile(id, userId);

  // Clear cache
  await RedisUtils.deleteCache(FILE_CACHE_KEY.FILE(id));
  await RedisUtils.deleteCache(FILE_CACHE_KEY.USER_FILES(userId));
  await RedisUtils.deleteCache(FILE_CACHE_KEY.FOLDER_FILES(existingFile.folderId));

  return result;
};

// -- Export File Service --
export const FileService = {
  createFile,
  getFileById,
  getFilesByUserId,
  getFilesByFolderId,
  updateFile,
  deleteFile,
};
