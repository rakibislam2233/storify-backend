import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick.utils';
import sendResponse from '../../utils/sendResponse';
import { FolderService } from './folder.services';

// -- Create Folder --
const createFolder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const payload = req.body;
  const result = await FolderService.createFolder(userId, payload);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Folder created successfully',
    data: result,
  });
});

// -- Get Folder By Id --
const getFolderById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user?.id;
  const result = await FolderService.getFolderById(id, userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Folder retrieved successfully',
    data: result,
  });
});

// -- Get All Folders By User Id --
const getFoldersByUserId = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const filters = pick(req.query, ['searchTerm', 'level', 'parentId']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await FolderService.getFoldersByUserId(userId, filters, options);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    meta: result.meta,
    message: 'Folders retrieved successfully',
    data: result.data,
  });
});

// -- Get Root Folders By User Id --
const getRootFoldersByUserId = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const filters = pick(req.query, ['searchTerm', 'level']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await FolderService.getRootFoldersByUserId(userId, filters, options);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    meta: result.meta,
    message: 'Root folders retrieved successfully',
    data: result.data,
  });
});

// -- Get Child Folders By Parent Id --
const getChildFoldersByParentId = catchAsync(async (req: Request, res: Response) => {
  const parentId = req.params.id as string;
  const userId = req.user?.id;
  const result = await FolderService.getChildFoldersByParentId(parentId, userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Child folders retrieved successfully',
    data: result,
  });
});

// -- Update Folder --
const updateFolder = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user?.id;
  const payload = req.body;
  const result = await FolderService.updateFolder(id, userId, payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Folder updated successfully',
    data: result,
  });
});

// -- Delete Folder --
const deleteFolder = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user?.id;
  await FolderService.deleteFolder(id, userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Folder deleted successfully',
  });
});

// -- Export Folder Controller --
export const FolderController = {
  createFolder,
  getFolderById,
  getFoldersByUserId,
  getRootFoldersByUserId,
  getChildFoldersByParentId,
  updateFolder,
  deleteFolder,
};
