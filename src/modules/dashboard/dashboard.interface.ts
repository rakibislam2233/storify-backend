// Admin Dashboard Statistics Interface
export interface IAdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalPackages: number;
  totalRevenue: number;
  storageUsage: {
    totalFiles: number;
    totalSize: number;
  };
}

// User Dashboard Statistics Interface
export interface IUserDashboardStats {
  currentPlan: {
    name: string;
    maxFolders: number;
    maxFileSize: number;
    totalFileLimit: number;
    filesPerFolder: number;
    allowedFileTypes: string[];
    price?: number;
  } | null;
  usage: {
    foldersUsed: number;
    filesUsed: number;
    storageUsed: number;
    storagePercentage: number;
  };
  recentFiles: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: Date;
  }>;
}

// Analytics Interface
export interface IAnalyticsData {
  userRegistrations: Array<{
    date: string;
    count: number;
  }>;
  subscriptionPurchases: Array<{
    date: string;
    count: number;
    revenue: number;
  }>;
  planDistribution: Array<{
    planName: string;
    count: number;
    percentage: number;
  }>;
  storageTrends: Array<{
    date: string;
    totalSize: number;
    fileCount: number;
  }>;
}
