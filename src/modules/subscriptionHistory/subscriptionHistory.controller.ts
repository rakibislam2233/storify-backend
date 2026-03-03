import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick.utils';
import sendResponse from '../../utils/sendResponse';
import { SubscriptionHistoryService } from './subscriptionHistory.service';

// ── Purchase Package ───────────────────────────────────────────────────────────────
const purchasePackage = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { packageId } = req.body;

  const result = await SubscriptionHistoryService.purchasePackage(userId, packageId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Package purchased successfully',
    data: result,
  });
});

// ── Get Subscription History By Id ───────────────────────────────────────────────────
const getSubscriptionHistoryById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SubscriptionHistoryService.getSubscriptionHistoryById(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscription history fetched successfully',
    data: result,
  });
});

// ── Get All Subscription Histories ───────────────────────────────────────────────────
const getAllSubscriptionHistories = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', 'userId', 'startDate', 'endDate']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await SubscriptionHistoryService.getAllSubscriptionHistories(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscription histories fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

// ── Get Subscription Histories By User Id ─────────────────────────────────────────────
const getSubscriptionHistoriesByUserId = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const filters = pick(req.query, ['searchTerm', 'startDate', 'endDate']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await SubscriptionHistoryService.getSubscriptionHistoriesByUserId(
    userId as string,
    filters,
    options
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User subscription histories fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

// ── Update Subscription History ─────────────────────────────────────────────────────
const updateSubscriptionHistory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await SubscriptionHistoryService.updateSubscriptionHistory(id as string, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscription history updated successfully',
    data: result,
  });
});

// ── Delete Subscription History ─────────────────────────────────────────────────────
const deleteSubscriptionHistory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SubscriptionHistoryService.deleteSubscriptionHistory(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscription history deleted successfully',
    data: result,
  });
});

// ── Get Active Subscription By User Id ───────────────────────────────────────────────
const getActiveSubscriptionByUserId = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await SubscriptionHistoryService.getActiveSubscriptionByUserId(userId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Active subscription fetched successfully',
    data: result,
  });
});

// ── Check User Has Active Subscription ───────────────────────────────────────────────
const checkUserHasActiveSubscription = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await SubscriptionHistoryService.checkUserHasActiveSubscription(userId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Active subscription status checked successfully',
    data: { hasActiveSubscription: result },
  });
});

// ── Export Subscription History Controller ─────────────────────────────────────────────
export const SubscriptionHistoryController = {
  purchasePackage,
  getSubscriptionHistoryById,
  getAllSubscriptionHistories,
  getSubscriptionHistoriesByUserId,
  updateSubscriptionHistory,
  deleteSubscriptionHistory,
  getActiveSubscriptionByUserId,
  checkUserHasActiveSubscription,
};
