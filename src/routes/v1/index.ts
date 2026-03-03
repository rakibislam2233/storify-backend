import { Router } from 'express';
import { AuthRoutes } from '../../modules/auth/auth.routes';
import { UserRoutes } from '../../modules/user/user.routes';
import { PackageRoutes } from '../../modules/packages/package.routes';
import { DashboardRoutes } from '../../modules/dashboard/dashboard.routes';
import { SubscriptionHistoryRoutes } from '../../modules/subscriptionHistory/subscriptionHistory.routes';
import { FolderRoutes } from '../../modules/folders/folder.routes';
import { FileRoutes } from '../../modules/files/file.routes';

const router = Router();

// Module routes
const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/folders',
    route: FolderRoutes,
  },
  {
    path: '/files',
    route: FileRoutes,
  },
  {
    path: '/packages',
    route: PackageRoutes,
  },
  {
    path: '/subscription-history',
    route: SubscriptionHistoryRoutes,
  },
  {
    path: '/dashboard',
    route: DashboardRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
