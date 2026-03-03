export interface ISubscriptionHistory {
  id: string;
  userId: string;
  packageName: string;
  price: number;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// -- Create Subscription History Interface --
export interface ICreateSubscriptionHistory {
  userId: string;
  packageName: string;
  price: number;
  startDate?: Date;
  endDate?: Date;
}

// -- Update Subscription History Interface --
export interface IUpdateSubscriptionHistory {
  packageName?: string;
  price?: number;
  startDate?: Date;
  endDate?: Date;
}

// -- Filter Subscription History --
export interface ISubscriptionHistoryFilter {
  searchTerm?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}
