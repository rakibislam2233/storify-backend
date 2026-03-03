import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import { processFileUpload, processMultipleFileUploads } from '../../utils/fileUpload.utils';
import pick from '../../utils/pick.utils';
import sendResponse from '../../utils/sendResponse';
import { FileService } from './file.service';

// -- Create File --
const createFile = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { folderId } = req.body;

  if (!req.file) {
    return sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: 'No file uploaded',
    });
  }

  // Process and upload the file
  const fileData = await processFileUpload(req.file, userId, folderId);

  // Create file record in database
  const payload = {
    name: fileData.name,
    type: fileData.type,
    size: fileData.size,
    url: fileData.url,
    folderId: folderId,
  };

  const result = await FileService.createFile(userId, payload);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'File uploaded successfully',
    data: result,
  });
});

// -- Create Multiple Files --
const createMultipleFiles = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { folderId } = req.body;

  if (!req.files || !Array.isArray(req.files)) {
    return sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: 'No files uploaded',
    });
  }

  // Process and upload multiple files
  const filesData = await processMultipleFileUploads(req.files, userId, folderId);

  // Create file records in database
  const createPromises = filesData.map(fileData =>
    FileService.createFile(userId, {
      name: fileData.name,
      type: fileData.type,
      size: fileData.size,
      url: fileData.url,
      folderId: folderId,
    })
  );

  const results = await Promise.all(createPromises);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: `${results.length} files uploaded successfully`,
    data: results,
  });
});

// -- Get File By Id --
const getFileById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { userId } = req.user;
  const result = await FileService.getFileById(id, userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'File retrieved successfully',
    data: result,
  });
});

// -- Get All Files By User Id --
const getFilesByUserId = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const filters = pick(req.query, ['searchTerm', 'type', 'folderId']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await FileService.getFilesByUserId(userId, filters, options);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    meta: result.meta,
    message: 'Files retrieved successfully',
    data: result.data,
  });
});

// -- Get Files By Folder Id --
const getFilesByFolderId = catchAsync(async (req: Request, res: Response) => {
  const folderId = req.params.id as string;
  const filters = pick(req.query, ['searchTerm', 'type']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await FileService.getFilesByFolderId(folderId, filters, options);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    meta: result.meta,
    message: 'Files retrieved successfully',
    data: result.data,
  });
});

// -- Update File --
const updateFile = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { userId } = req.user;
  const payload = req.body;
  const result = await FileService.updateFile(id, userId, payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'File updated successfully',
    data: result,
  });
});

// -- Delete File --
const deleteFile = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { userId } = req.user;
  await FileService.deleteFile(id, userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'File deleted successfully',
  });
});

// -- Export File Controller --
export const FileController = {
  createFile,
  createMultipleFiles,
  getFileById,
  getFilesByUserId,
  getFilesByFolderId,
  updateFile,
  deleteFile,
};
