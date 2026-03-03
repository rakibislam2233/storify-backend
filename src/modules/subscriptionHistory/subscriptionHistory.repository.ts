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
import {
  ICreateSubscriptionHistory,
  ISubscriptionHistory,
  ISubscriptionHistoryFilter,
  IUpdateSubscriptionHistory,
} from './subscriptionHistory.interface';

// -- Create Subscription History --
const createSubscriptionHistory = async (payload: ICreateSubscriptionHistory) => {
  return database.subscriptionHistory.create({
    data: payload,
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });
};

// -- Get Subscription History By Id --
const getSubscriptionHistoryById = async (id: string): Promise<ISubscriptionHistory | null> => {
  return database.subscriptionHistory.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });
};

// -- Get All Subscription Histories --
const getAllSubscriptionHistories = async (
  filters: ISubscriptionHistoryFilter,
  options: IPaginationOptions
): Promise<IPaginationResult<ISubscriptionHistory>> => {
  const pagination = parsePaginationOptions(options);
  const { skip, take, orderBy } = createPaginationQuery(pagination);
  const where: any = {};

  if (filters.searchTerm) {
    where.OR = [
      { packageName: { contains: filters.searchTerm, mode: 'insensitive' } },
      { user: { fullName: { contains: filters.searchTerm, mode: 'insensitive' } } },
      { user: { email: { contains: filters.searchTerm, mode: 'insensitive' } } },
    ];
  }

  if (filters.userId) {
    where.userId = filters.userId;
  }

  if (filters.startDate) {
    where.startDate = {
      gte: filters.startDate,
    };
  }

  if (filters.endDate) {
    where.endDate = {
      lte: filters.endDate,
    };
  }

  const [histories, total] = await Promise.all([
    database.subscriptionHistory.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      skip,
      take,
      orderBy,
    }),
    database.subscriptionHistory.count({
      where,
    }),
  ]);

  return createPaginationResult(histories, total, pagination);
};

// -- Get Subscription Histories By User Id --
const getSubscriptionHistoriesByUserId = async (
  userId: string,
  filters: ISubscriptionHistoryFilter,
  options: IPaginationOptions
): Promise<IPaginationResult<ISubscriptionHistory>> => {
  const pagination = parsePaginationOptions(options);
  const { skip, take, orderBy } = createPaginationQuery(pagination);
  const where: any = { userId };

  if (filters.searchTerm) {
    where.OR = [
      { packageName: { contains: filters.searchTerm, mode: 'insensitive' } },
    ];
  }

  if (filters.startDate) {
    where.startDate = {
      gte: filters.startDate,
    };
  }

  if (filters.endDate) {
    where.endDate = {
      lte: filters.endDate,
    };
  }

  const [histories, total] = await Promise.all([
    database.subscriptionHistory.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      skip,
      take,
      orderBy,
    }),
    database.subscriptionHistory.count({
      where,
    }),
  ]);

  return createPaginationResult(histories, total, pagination);
};

// -- Update Subscription History --
const updateSubscriptionHistory = async (
  id: string,
  payload: IUpdateSubscriptionHistory
): Promise<ISubscriptionHistory> => {
  return database.subscriptionHistory.update({
    where: { id },
    data: payload,
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });
};

// -- Delete Subscription History --
const deleteSubscriptionHistory = async (id: string): Promise<ISubscriptionHistory> => {
  return database.subscriptionHistory.delete({
    where: { id },
  });
};

// -- Get Active Subscription By User Id --
const getActiveSubscriptionByUserId = async (userId: string): Promise<ISubscriptionHistory | null> => {
  const now = new Date();
  return database.subscriptionHistory.findFirst({
    where: {
      userId,
      startDate: {
        lte: now,
      },
      OR: [
        { endDate: null },
        { endDate: { gte: now } },
      ],
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

// -- Check User Has Active Subscription --
const checkUserHasActiveSubscription = async (userId: string): Promise<boolean> => {
  const now = new Date();
  const subscription = await database.subscriptionHistory.findFirst({
    where: {
      userId,
      startDate: {
        lte: now,
      },
      OR: [
        { endDate: null },
        { endDate: { gte: now } },
      ],
    },
  });
  return !!subscription;
};

// -- Export Subscription History Repository --
export const SubscriptionHistoryRepository = {
  createSubscriptionHistory,
  getSubscriptionHistoryById,
  getAllSubscriptionHistories,
  getSubscriptionHistoriesByUserId,
  updateSubscriptionHistory,
  deleteSubscriptionHistory,
  getActiveSubscriptionByUserId,
  checkUserHasActiveSubscription,
};
