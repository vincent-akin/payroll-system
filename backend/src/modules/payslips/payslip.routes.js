// backend/src/modules/payslips/payslip.routes.js
import express from 'express';
import * as payslipController from './payslip.controller.js';
import { payslipValidator } from './payslip.validator.js';
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
  validate(payslipValidator.generatePayslipSchema),
  payslipController.generatePayslip
);

router.post(
  '/:id/email',
  permissionsMiddleware(['HR_MANAGER', 'PAYROLL_OFFICER']),
  validate(payslipValidator.emailPayslipSchema),
  payslipController.emailPayslip
);

// Routes for authenticated users
router.get(
  '/',
  payslipController.getPayslips
);

router.get(
  '/:id',
  payslipController.getPayslip
);

router.patch(
  '/:id/view',
  payslipController.markViewed
);

router.get(
  '/:id/download',
  payslipController.downloadPayslip
);

export default router;