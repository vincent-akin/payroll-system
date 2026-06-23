// backend/src/modules/deductions/deduction.routes.js
import express from 'express';
import * as deductionController from './deduction.controller.js';
import { deductionValidator } from './deduction.validator.js';
import { validate } from '../../shared/middlewares/validate.middleware.js';
import authMiddleware from '../../shared/middlewares/auth.middleware.js';
import permissionsMiddleware from '../../shared/middlewares/permissions.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Routes that require HR_MANAGER or PAYROLL_OFFICER permissions
router.post(
  '/',
  permissionsMiddleware(['HR_MANAGER', 'PAYROLL_OFFICER']),
  validate(deductionValidator.createDeductionSchema),
  deductionController.createDeduction
);

router.patch(
  '/:id/activate',
  permissionsMiddleware(['HR_MANAGER', 'PAYROLL_OFFICER']),
  deductionController.activateDeduction
);

router.patch(
  '/:id/deactivate',
  permissionsMiddleware(['HR_MANAGER', 'PAYROLL_OFFICER']),
  deductionController.deactivateDeduction
);

router.put(
  '/:id',
  permissionsMiddleware(['HR_MANAGER', 'PAYROLL_OFFICER']),
  validate(deductionValidator.updateDeductionSchema),
  deductionController.updateDeduction
);

router.delete(
  '/:id',
  permissionsMiddleware(['HR_MANAGER', 'PAYROLL_OFFICER']),
  deductionController.deleteDeduction
);

// Routes that all authenticated users can access
router.get(
  '/employee/:employeeId',
  deductionController.getEmployeeDeductions
);

router.get(
  '/employee/:employeeId/active',
  deductionController.getActiveDeductions
);

router.get(
  '/:id',
  deductionController.getDeduction
);

export default router;