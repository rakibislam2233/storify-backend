import { Router } from 'express';
import { AuthRoutes } from '../../modules/auth/auth.routes';
import { UserRoutes } from '../../modules/user/user.routes';
import { PackageRoutes } from '../../modules/packages/package.routes';

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
    path: '/packages',
    route: PackageRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
