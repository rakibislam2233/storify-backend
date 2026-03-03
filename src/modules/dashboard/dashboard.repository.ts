import { database } from '../../config/database.config';

// ── Get Admin Dashboard Statistics ───────────────────────────────────────────────────
const getAdminDashboardStats = async () => {
  // Get total users and active users
  const [totalUsers, activeUsers] = await Promise.all([
    database.user.count(),
    database.user.count({
      where: {
        status: 'ACTIVE',
        lastLoginAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  // Get total packages
  const totalPackages = await database.package.count({
    where: { isDeleted: false },
  });

  // Get total revenue
  const revenueResult = await database.subscriptionHistory.aggregate({
    _sum: {
      price: true,
    },
  });

  // Get storage usage
  const [totalFiles, storageAggregates] = await Promise.all([
    database.file.count({
      where: { isDeleted: false },
    }),
    database.file.aggregate({
      _sum: {
        size: true,
      },
      where: { isDeleted: false },
    }),
  ]);

  return {
    totalUsers,
    activeUsers,
    totalPackages,
    totalRevenue: revenueResult._sum.price || 0,
    storageUsage: {
      totalFiles,
      totalSize: storageAggregates._sum.size || 0,
    },
  };
};

// ── Get User Dashboard Statistics ─────────────────────────────────────────────────────
const getUserDashboardStats = async (userId: string) => {
  // Get user's current active package
  const userWithPackage = await database.user.findUnique({
    where: { id: userId },
    include: {
      activePackage: true,
    },
  });

  if (!userWithPackage) {
    throw new Error('User not found');
  }

  // Get user's folder and file statistics
  const [foldersCount, filesCount, storageAggregates] = await Promise.all([
    database.folder.count({
      where: {
        userId,
        isDeleted: false,
      },
    }),
    database.file.count({
      where: {
        userId,
        isDeleted: false,
      },
    }),
    database.file.aggregate({
      _sum: {
        size: true,
      },
      where: {
        userId,
        isDeleted: false,
      },
    }),
  ]);

  // Get recent files
  const recentFiles = await database.file.findMany({
    where: {
      userId,
      isDeleted: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  });

  // Calculate usage percentages
  const currentPlan = userWithPackage.activePackage;
  const storageUsed = storageAggregates._sum.size || 0;
  const storagePercentage = currentPlan ? (storageUsed / currentPlan.maxFileSize) * 100 : 0;

  // Format recent files
  const formattedFiles = recentFiles.map(file => ({
    id: file.id,
    name: file.name,
    type: file.type,
    size: file.size,
    uploadedAt: file.createdAt,
  }));

  return {
    currentPlan: currentPlan
      ? {
          name: currentPlan.name,
          maxFolders: currentPlan.maxFolders,
          maxFileSize: currentPlan.maxFileSize,
          totalFileLimit: currentPlan.totalFileLimit,
          filesPerFolder: currentPlan.filesPerFolder,
          allowedFileTypes: currentPlan.allowedFileTypes,
          price: currentPlan.price || undefined,
        }
      : null,
    usage: {
      foldersUsed: foldersCount,
      filesUsed: filesCount,
      storageUsed,
      storagePercentage: Math.round(storagePercentage * 100) / 100,
    },
    recentFiles: formattedFiles,
  };
};

// ── Get Analytics Data ───────────────────────────────────────────────────────────────
const getAnalyticsData = async (days: number = 30) => {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Get user registrations over time
  const userRegistrations = await database.user.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: {
        gte: startDate,
      },
    },
    _count: {
      id: true,
    },
  });

  // Get subscription purchases over time
  const subscriptionPurchases = await database.subscriptionHistory.groupBy({
    by: ['startDate'],
    where: {
      startDate: {
        gte: startDate,
      },
    },
    _count: {
      id: true,
    },
    _sum: {
      price: true,
    },
  });

  // Get plan distribution
  const planDistribution = await database.subscriptionHistory.groupBy({
    by: ['packageName'],
    where: {
      endDate: null,
    },
    _count: {
      id: true,
    },
  });

  const totalActive = planDistribution.reduce((sum, plan) => sum + plan._count.id, 0);

  // Get storage trends
  const storageTrends = await database.file.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: {
        gte: startDate,
      },
      isDeleted: false,
    },
    _count: {
      id: true,
    },
    _sum: {
      size: true,
    },
  });

  return {
    userRegistrations: userRegistrations.map(item => ({
      date: item.createdAt.toISOString().split('T')[0],
      count: item._count.id,
    })),
    subscriptionPurchases: subscriptionPurchases.map(item => ({
      date: item.startDate.toISOString().split('T')[0],
      count: item._count.id,
      revenue: item._sum.price || 0,
    })),
    planDistribution: planDistribution.map(item => ({
      planName: item.packageName,
      count: item._count.id,
      percentage: totalActive > 0 ? Math.round((item._count.id / totalActive) * 100) : 0,
    })),
    storageTrends: storageTrends.map(item => ({
      date: item.createdAt.toISOString().split('T')[0],
      totalSize: item._sum.size || 0,
      fileCount: item._count.id,
    })),
  };
};

// ── Get Admin Chart Data ─────────────────────────────────────────────────────────────
const getAdminChartData = async () => {
  const now = new Date();
  const last12Months = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  // Monthly user registrations
  const monthlyRegistrations = await database.$queryRaw`
    SELECT 
      DATE_TRUNC('month', "createdAt") as month,
      COUNT(*) as count
    FROM "users" 
    WHERE "createdAt" >= ${last12Months}
    GROUP BY DATE_TRUNC('month', "createdAt")
    ORDER BY month ASC
  `;

  // Monthly subscription purchases
  const monthlySubscriptions = await database.$queryRaw`
    SELECT 
      DATE_TRUNC('month', "startDate") as month,
      COUNT(*) as count,
      COALESCE(SUM("price"), 0) as revenue
    FROM "subscription_histories" 
    WHERE "startDate" >= ${last12Months}
    GROUP BY DATE_TRUNC('month', "startDate")
    ORDER BY month ASC
  `;

  // Plan distribution chart
  const planDistribution = await database.subscriptionHistory.groupBy({
    by: ['packageName'],
    where: {
      endDate: null,
    },
    _count: {
      id: true,
    },
  });

  // User activity chart (active vs inactive)
  const [activeUsers, inactiveUsers] = await Promise.all([
    database.user.count({
      where: {
        status: 'ACTIVE',
        lastLoginAt: {
          gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    database.user.count({
      where: {
        OR: [
          { status: { not: 'ACTIVE' } },
          { lastLoginAt: { lt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } },
        ],
      },
    }),
  ]);

  // Storage usage by plan
  const storageByPlan = await database.$queryRaw`
    SELECT 
      p.name as planName,
      COALESCE(SUM(f.size), 0) as totalSize,
      COUNT(f.id) as fileCount
    FROM "packages" p
    LEFT JOIN "users" u ON u."activePackageId" = p.id
    LEFT JOIN "files" f ON f."userId" = u.id AND f."isDeleted" = false
    WHERE p."isDeleted" = false
    GROUP BY p.id, p.name
    ORDER BY totalSize DESC
  `;

  return {
    monthlyRegistrations,
    monthlySubscriptions,
    planDistribution,
    userActivity: {
      active: activeUsers,
      inactive: inactiveUsers,
    },
    storageByPlan,
  };
};

// ── Get User Chart Data ───────────────────────────────────────────────────────────────
const getUserChartData = async (userId: string) => {
  const now = new Date();
  const last6Months = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  // Monthly file uploads
  const monthlyFileUploads = await database.$queryRaw`
    SELECT 
      DATE_TRUNC('month', "createdAt") as month,
      COUNT(*) as count,
      COALESCE(SUM("size"), 0) as totalSize
    FROM "files" 
    WHERE "userId" = ${userId} AND "isDeleted" = false AND "createdAt" >= ${last6Months}
    GROUP BY DATE_TRUNC('month', "createdAt")
    ORDER BY month ASC
  `;

  // File type distribution
  const fileTypeDistribution = await database.file.groupBy({
    by: ['type'],
    where: {
      userId,
      isDeleted: false,
    },
    _count: {
      id: true,
    },
    _sum: {
      size: true,
    },
  });

  // Storage usage over time
  const storageOverTime = await database.$queryRaw`
    SELECT 
      DATE_TRUNC('month', "createdAt") as month,
      COUNT(*) as fileCount,
      COALESCE(SUM("size"), 0) as cumulativeSize
    FROM "files" 
    WHERE "userId" = ${userId} AND "isDeleted" = false AND "createdAt" >= ${last6Months}
    GROUP BY DATE_TRUNC('month', "createdAt")
    ORDER BY month ASC
  `;

  // Folder depth distribution
  const folderDepthDistribution = await database.folder.groupBy({
    by: ['level'],
    where: {
      userId,
      isDeleted: false,
    },
    _count: {
      id: true,
    },
  });

  return {
    monthlyFileUploads,
    fileTypeDistribution,
    storageOverTime,
    folderDepthDistribution,
  };
};

// ── Export Dashboard Repository ───────────────────────────────────────────────────────
export const DashboardRepository = {
  getAdminDashboardStats,
  getUserDashboardStats,
  getAnalyticsData,
  getAdminChartData,
  getUserChartData,
};
