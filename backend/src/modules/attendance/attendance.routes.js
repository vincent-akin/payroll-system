import express from 'express';

import * as attendanceController from './attendance.controller.js';

import { validate }
  from '../../shared/middlewares/validate.middleware.js';

import {
  createAttendanceSchema,
  submitAttendanceSchema,
  approveAttendanceSchema,
  lockAttendanceSchema
} from './attendance.validator.js';

const router =
  express.Router();

router.post(
  '/',
  validate(
    createAttendanceSchema
  ),
  attendanceController.createAttendance
);

router.post(
  '/:id/submit',
  validate(
    submitAttendanceSchema
  ),
  attendanceController.submitAttendance
);

router.post(
  '/:id/approve',
  validate(
    approveAttendanceSchema
  ),
  attendanceController.approveAttendance
);

router.post(
  '/:id/lock',
  validate(
    lockAttendanceSchema
  ),
  attendanceController.lockAttendance
);

router.get(
  '/employee/:employeeId',
  attendanceController.getEmployeeAttendance
);

router.get(
  '/:id',
  attendanceController.getAttendance
);

export default router;