// backend/src/modules/reports/report.routes.js
import express from 'express';
import * as reportController from './report.controller.js';
import authMiddleware from '../../shared/middlewares/auth.middleware.js';
import permissionsMiddleware from '../../shared/middlewares/permissions.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// All report routes require HR_MANAGER or PAYROLL_OFFICER permissions
router.use(permissionsMiddleware(['HR_MANAGER', 'PAYROLL_OFFICER']));

router.get(
  '/payroll-summary',
  reportController.getPayrollSummaryReport
);

router.get(
  '/department-payroll',
  reportController.getDepartmentPayrollReport
);

router.get(
  '/attendance',
  reportController.getAttendanceReport
);

router.get(
  '/leave',
  reportController.getLeaveReport
);

router.get(
  '/employee-cost',
  reportController.getEmployeeCostReport
);

export default router;