import { StatusCodes } from 'http-status-codes';
import { database } from '../../config/database.config';
import ApiError from '../../utils/ApiError';
import { RedisUtils } from '../../utils/redis.utils';
import {
  SUBSCRIPTION_HISTORY_CACHE_KEY,
  SUBSCRIPTION_HISTORY_CACHE_TTL,
} from './subscriptionHistory.cache';
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

  // 2. Start transaction (so package update and history save happen together)
  const result = await database.$transaction(async tx => {
    // 3. If user has any old active subscription, update its endDate
    await tx.subscriptionHistory.updateMany({
      where: {
        userId,
        endDate: null, // Those without endDate are currently active histories
      },
      data: {
        endDate: new Date(),
      },
    });

    // 4. Update user's main profile with activePackageId
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { activePackageId: packageId },
    });

    // 5. Create new record in SubscriptionHistory
    await tx.subscriptionHistory.create({
      data: {
        userId,
        packageName: newPackage.name,
        price: newPackage.price || 0,
        startDate: new Date(),
        endDate: null,
      },
    });

    // Clear relevant caches after purchase
    await RedisUtils.deleteCache(SUBSCRIPTION_HISTORY_CACHE_KEY.ACTIVE_BY_USER_ID(userId));
    await RedisUtils.deleteCache(SUBSCRIPTION_HISTORY_CACHE_KEY.BY_USER_ID(userId));
    await RedisUtils.deleteCachePattern(SUBSCRIPTION_HISTORY_CACHE_KEY.USER_LIST(userId));

    return updatedUser;
  });

  return result;
};

// ── Get Subscription History By Id ───────────────────────────────────────────────────
const getSubscriptionHistoryById = async (id: string): Promise<ISubscriptionHistory> => {
  const cacheKey = SUBSCRIPTION_HISTORY_CACHE_KEY.BY_ID(id);
  const cachedSubscriptionHistory = await RedisUtils.getCache<ISubscriptionHistory>(cacheKey);

  if (cachedSubscriptionHistory) {
    return cachedSubscriptionHistory;
  }

  const subscriptionHistory = await SubscriptionHistoryRepository.getSubscriptionHistoryById(id);
  if (!subscriptionHistory) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Subscription history not found');
  }

  await RedisUtils.setCache(cacheKey, subscriptionHistory, SUBSCRIPTION_HISTORY_CACHE_TTL.BY_ID);
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
  const cacheKey = SUBSCRIPTION_HISTORY_CACHE_KEY.ACTIVE_BY_USER_ID(userId);
  const cachedActiveSubscription = await RedisUtils.getCache<ISubscriptionHistory>(cacheKey);

  if (cachedActiveSubscription) {
    return cachedActiveSubscription;
  }

  const activeSubscription =
    await SubscriptionHistoryRepository.getActiveSubscriptionByUserId(userId);

  if (activeSubscription) {
    await RedisUtils.setCache(
      cacheKey,
      activeSubscription,
      SUBSCRIPTION_HISTORY_CACHE_TTL.ACTIVE_BY_USER_ID
    );
  }

  return activeSubscription;
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
