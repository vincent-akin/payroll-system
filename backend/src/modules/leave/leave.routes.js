// backend/src/modules/leave/leave.routes.js
import express from 'express';
import auth from '../../shared/middlewares/auth.middleware.js';
import permissions from '../../shared/middlewares/permissions.middleware.js';
import { validate } from '../../shared/middlewares/validate.middleware.js';
import * as leaveController from './leave.controller.js';
import {
  createLeaveSchema,
  approveLeaveSchema,
  rejectLeaveSchema
} from './leave.validator.js';

const router = express.Router();

// Just add auth and permissions - keep everything else the same
router.post(
  '/',
  auth,
  permissions('create_leave'),
  validate(createLeaveSchema),
  leaveController.createLeave
);

router.post(
  '/:id/approve',
  auth,
  permissions('approve_leave'),
  validate(approveLeaveSchema),
  leaveController.approveLeave
);

router.post(
  '/:id/reject',
  auth,
  permissions('reject_leave'),
  validate(rejectLeaveSchema),
  leaveController.rejectLeave
);

router.get(
  '/',
  auth,
  permissions('view_leave'),
  leaveController.getLeaves
);

router.get(
  '/:id',
  auth,
  permissions('view_leave'),
  leaveController.getLeave
);

export default router;