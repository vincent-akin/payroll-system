// backend/src/modules/notifications/notification.routes.js
import express from 'express';
import * as notificationController from './notification.controller.js';
import { notificationValidator } from './notification.validator.js';
import { validate } from '../../shared/middlewares/validate.middleware.js';
import authMiddleware from '../../shared/middlewares/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get(
  '/',
  validate(notificationValidator.getNotificationsQuerySchema, 'query'),
  notificationController.getNotifications
);

router.get(
  '/:id',
  notificationController.getNotification
);

router.patch(
  '/:id/read',
  notificationController.markAsRead
);

router.patch(
  '/mark-all-read',
  notificationController.markAllAsRead
);

router.delete(
  '/:id',
  notificationController.deleteNotification
);

router.delete(
  '/',
  notificationController.deleteAllNotifications
);

export default router;