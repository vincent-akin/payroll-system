// backend/src/modules/attendance/attendance.routes.js
import express from 'express';

import auth from '../../shared/middlewares/auth.middleware.js';
import permissions from '../../shared/middlewares/permissions.middleware.js';
import { validate } from '../../shared/middlewares/validate.middleware.js';

import * as attendanceController from './attendance.controller.js';
import {
  createAttendanceSchema,
  submitAttendanceSchema,
  approveAttendanceSchema,
  lockAttendanceSchema
} from './attendance.validator.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// ADD THIS ROUTE - GET all attendances
router.get(
  '/',
  permissions('view_attendance'),
  attendanceController.getAttendances
);

router.post(
  '/',
  permissions('create_attendance'),
  validate(createAttendanceSchema),
  attendanceController.createAttendance
);

router.post(
  '/:id/submit',
  permissions('submit_attendance'),
  validate(submitAttendanceSchema),
  attendanceController.submitAttendance
);

router.post(
  '/:id/approve',
  permissions('approve_attendance'),
  validate(approveAttendanceSchema),
  attendanceController.approveAttendance
);

router.post(
  '/:id/lock',
  permissions('lock_attendance'),
  validate(lockAttendanceSchema),
  attendanceController.lockAttendance
);

router.get(
  '/employee/:employeeId',
  permissions('view_attendance'),
  attendanceController.getEmployeeAttendance
);

router.get(
  '/:id',
  permissions('view_attendance'),
  attendanceController.getAttendance
);

export default router;