// backend/src/modules/salaryStructure/salaryStructure.routes.js
import express from 'express';
import auth from '../../shared/middlewares/auth.middleware.js';
import permissions from '../../shared/middlewares/permissions.middleware.js';
import { validate } from '../../shared/middlewares/validate.middleware.js';
import * as controller from './salaryStructure.controller.js';
import {
  createSalaryStructureSchema,
  submitSalaryStructureSchema,
  approveSalaryStructureSchema
} from './salaryStructure.validator.js';

const router = express.Router();

router.post(
  '/',
  auth,
  permissions('create_salary'),
  validate(createSalaryStructureSchema),
  controller.createSalaryStructure
);

router.post(
  '/:id/submit',
  auth,
  permissions('submit_salary'),
  validate(submitSalaryStructureSchema),
  controller.submitSalaryStructure
);

router.post(
  '/:id/approve',
  auth,
  permissions('approve_salary'),
  validate(approveSalaryStructureSchema),
  controller.approveSalaryStructure
);

router.get(
  '/employee/:employeeId/current',
  auth,
  permissions('view_salary'),
  controller.getCurrentSalaryStructure
);

router.get(
  '/employee/:employeeId/history',
  auth,
  permissions('view_salary'),
  controller.getSalaryHistory
);

export default router;