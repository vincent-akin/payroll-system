// backend/src/modules/payroll/payroll.routes.js
import express from 'express';
import * as payrollController from './payroll.controller.js';
import { payrollValidator } from './payroll.validator.js';
import { validate } from '../../shared/middlewares/validate.middleware.js';
import authMiddleware from '../../shared/middlewares/auth.middleware.js';
import permissionsMiddleware from '../../shared/middlewares/permissions.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Routes that require HR_MANAGER or PAYROLL_OFFICER permissions
router.post(
  '/generate',
  permissionsMiddleware(['HR_MANAGER', 'PAYROLL_OFFICER']),
  validate(payrollValidator.generatePayrollSchema),
  payrollController.generatePayroll
);

router.patch(
  '/:id/submit',
  permissionsMiddleware(['HR_MANAGER', 'PAYROLL_OFFICER']),
  payrollController.submitPayroll
);

router.patch(
  '/:id/review',
  permissionsMiddleware(['HR_MANAGER', 'PAYROLL_OFFICER']),
  payrollController.reviewPayroll
);

router.patch(
  '/:id/approve',
  permissionsMiddleware(['HR_MANAGER', 'PAYROLL_OFFICER']),
  payrollController.approvePayroll
);

router.patch(
  '/:id/process',
  permissionsMiddleware(['HR_MANAGER', 'PAYROLL_OFFICER']),
  payrollController.processPayroll
);

router.patch(
  '/:id/paid',
  permissionsMiddleware(['HR_MANAGER', 'PAYROLL_OFFICER']),
  validate(payrollValidator.updatePayrollStatusSchema),
  payrollController.markPayrollPaid
);

// Routes all authenticated users can access
router.get(
  '/',
  payrollController.getPayrolls
);

router.get(
  '/:id',
  payrollController.getPayroll
);

export default router;