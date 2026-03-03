import { Router } from 'express';
import { auth } from '../../middleware/auth.middleware';
import validateRequest from '../../middleware/validation.middleware';
import { SubscriptionHistoryController } from './subscriptionHistory.controller';
import { SubscriptionHistoryValidation } from './subscriptionHistory.validation';
import { UserRole } from '../../../prisma/generated/enums';

const router = Router();

// ── Purchase Package ───────────────────────────────────────────────────────────────
router.post(
  '/purchase',
  auth(UserRole.USER),
  validateRequest(SubscriptionHistoryValidation.purchasePackageValidationSchema),
  SubscriptionHistoryController.purchasePackage
);

// ── Get All Subscription Histories (Admin) ───────────────────────────────────────────
router.get(
  '/',
  auth(UserRole.ADMIN),
  validateRequest(SubscriptionHistoryValidation.getAllSubscriptionHistoriesValidationSchema),
  SubscriptionHistoryController.getAllSubscriptionHistories
);

// ── Get Subscription Histories By User Id ─────────────────────────────────────────────
router.get(
  '/user',
  auth(UserRole.USER),
  SubscriptionHistoryController.getSubscriptionHistoriesByUserId
);

// ── Get Active Subscription By User Id ───────────────────────────────────────────────
router.get(
  '/active',
  auth(UserRole.ADMIN, UserRole.USER),
  SubscriptionHistoryController.getActiveSubscriptionByUserId
);

// ── Check User Has Active Subscription ───────────────────────────────────────────────
router.get(
  '/check-active',
  auth(UserRole.ADMIN, UserRole.USER),
  SubscriptionHistoryController.checkUserHasActiveSubscription
);

router
  .route('/:id')
  // ── Get Subscription History By Id ─────────────────────────────────────────────────
  .get(
    auth(UserRole.ADMIN, UserRole.USER),
    validateRequest(SubscriptionHistoryValidation.getSubscriptionHistoryByIdValidationSchema),
    SubscriptionHistoryController.getSubscriptionHistoryById
  )
  // ── Update Subscription History ─────────────────────────────────────────────────────
  .patch(
    auth(UserRole.ADMIN),
    validateRequest(SubscriptionHistoryValidation.updateSubscriptionHistoryValidationSchema),
    SubscriptionHistoryController.updateSubscriptionHistory
  )
  // ── Delete Subscription History ─────────────────────────────────────────────────────
  .delete(
    auth(UserRole.ADMIN),
    validateRequest(SubscriptionHistoryValidation.deleteSubscriptionHistoryValidationSchema),
    SubscriptionHistoryController.deleteSubscriptionHistory
  );

export const SubscriptionHistoryRoutes = router;
