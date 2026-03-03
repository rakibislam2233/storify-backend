import { IPaginationResult } from '../shared/interfaces/pagination.interface';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const parsePaginationOptions = (query: any): Required<PaginationOptions> => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

  return {
    page,
    limit,
    sortBy,
    sortOrder,
  };
};

export const createPaginationQuery = (
  options: Required<PaginationOptions>
): {
  skip: number;
  take: number;
  orderBy: Record<string, 'asc' | 'desc'>;
} => {
  const { page, limit, sortBy, sortOrder } = options;
  const skip = (page - 1) * limit;

  return {
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
  };
};

export const createPaginationResult = <T>(
  data: T[],
  total: number,
  options: Required<PaginationOptions>
): IPaginationResult<T> => {
  const { page, limit } = options;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};
