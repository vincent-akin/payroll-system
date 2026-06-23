// backend/src/modules/audit/audit.routes.js
import express from 'express';
import * as auditController from './audit.controller.js';
import authMiddleware from '../../shared/middlewares/auth.middleware.js';
import permissionsMiddleware from '../../shared/middlewares/permissions.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// All audit routes require SUPER_ADMIN or HR_MANAGER permissions
router.use(permissionsMiddleware(['SUPER_ADMIN', 'HR_MANAGER']));

router.get(
  '/',
  auditController.getAuditLogs
);

router.get(
  '/stats',
  auditController.getAuditStats
);

router.get(
  '/resource/:resource/:resourceId',
  auditController.getResourceHistory
);

router.get(
  '/user/:userId',
  auditController.getUserActivity
);

export default router;