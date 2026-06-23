import express from 'express';

import * as leaveController from './leave.controller.js';

import { validate }
  from '../../shared/middlewares/validate.middleware.js';

import {
  createLeaveSchema,
  approveLeaveSchema,
  rejectLeaveSchema
} from './leave.validator.js';

const router =
  express.Router();

router.post(
  '/',
  validate(
    createLeaveSchema
  ),
  leaveController.createLeave
);

router.post(
  '/:id/approve',
  validate(
    approveLeaveSchema
  ),
  leaveController.approveLeave
);

router.post(
  '/:id/reject',
  validate(
    rejectLeaveSchema
  ),
  leaveController.rejectLeave
);

router.get(
  '/',
  leaveController.getLeaves
);

router.get(
  '/:id',
  leaveController.getLeave
);

export default router;