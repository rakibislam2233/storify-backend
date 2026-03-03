import { StatusCodes } from 'http-status-codes';
import { database } from '../../config/database.config';
import ApiError from '../../utils/ApiError';
import {
  ISubscriptionHistory,
  ISubscriptionHistoryFilter,
  IUpdateSubscriptionHistory,
} from './subscriptionHistory.interface';
import { SubscriptionHistoryRepository } from './subscriptionHistory.repository';

// ── Purchase Package ───────────────────────────────────────────────────────────────
const purchasePackage = async (userId: string, packageId: string) => {
  const newPackage = await database.package.findUnique({
    where: { id: packageId },
  });

  if (!newPackage) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Package not found');
  }

  return await database.$transaction(async tx => {
    await tx.subscriptionHistory.updateMany({
      where: {
        userId,
        endDate: null,
      },
      data: {
        endDate: new Date(),
      },
    });

    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { activePackageId: packageId },
    });

    await tx.subscriptionHistory.create({
      data: {
        userId,
        packageName: newPackage.name,
        price: newPackage.price || 0,
        startDate: new Date(),
        endDate: null,
      },
    });

    return updatedUser;
  });
};

// ── Get Subscription History By Id ───────────────────────────────────────────────────
const getSubscriptionHistoryById = async (id: string): Promise<ISubscriptionHistory> => {
  const subscriptionHistory = await SubscriptionHistoryRepository.getSubscriptionHistoryById(id);
  if (!subscriptionHistory) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Subscription history not found');
  }
  return subscriptionHistory;
};

// ── Get All Subscription Histories ───────────────────────────────────────────────────
const getAllSubscriptionHistories = async (filters: ISubscriptionHistoryFilter, options: any) => {
  return SubscriptionHistoryRepository.getAllSubscriptionHistories(filters, options);
};

// ── Get Subscription Histories By User Id ─────────────────────────────────────────────
const getSubscriptionHistoriesByUserId = async (
  userId: string,
  filters: ISubscriptionHistoryFilter,
  options: any
) => {
  return SubscriptionHistoryRepository.getSubscriptionHistoriesByUserId(userId, filters, options);
};

// ── Update Subscription History ─────────────────────────────────────────────────────
const updateSubscriptionHistory = async (
  id: string,
  payload: IUpdateSubscriptionHistory
): Promise<ISubscriptionHistory> => {
  // Check if subscription history exists
  const existingSubscriptionHistory =
    await SubscriptionHistoryRepository.getSubscriptionHistoryById(id);
  if (!existingSubscriptionHistory) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Subscription history not found');
  }

  return SubscriptionHistoryRepository.updateSubscriptionHistory(id, payload);
};

// ── Delete Subscription History ─────────────────────────────────────────────────────
const deleteSubscriptionHistory = async (id: string): Promise<ISubscriptionHistory> => {
  // Check if subscription history exists
  const existingSubscriptionHistory =
    await SubscriptionHistoryRepository.getSubscriptionHistoryById(id);
  if (!existingSubscriptionHistory) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Subscription history not found');
  }

  return SubscriptionHistoryRepository.deleteSubscriptionHistory(id);
};

// ── Get Active Subscription By User Id ───────────────────────────────────────────────
const getActiveSubscriptionByUserId = async (
  userId: string
): Promise<ISubscriptionHistory | null> => {
  return SubscriptionHistoryRepository.getActiveSubscriptionByUserId(userId);
};

// ── Check User Has Active Subscription ───────────────────────────────────────────────
const checkUserHasActiveSubscription = async (userId: string): Promise<boolean> => {
  return SubscriptionHistoryRepository.checkUserHasActiveSubscription(userId);
};

// ── Export Subscription History Service ───────────────────────────────────────────────
export const SubscriptionHistoryService = {
  purchasePackage,
  getSubscriptionHistoryById,
  getAllSubscriptionHistories,
  getSubscriptionHistoriesByUserId,
  updateSubscriptionHistory,
  deleteSubscriptionHistory,
  getActiveSubscriptionByUserId,
  checkUserHasActiveSubscription,
};
