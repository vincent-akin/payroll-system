import express from 'express';
import * as controller from './salaryStructure.controller.js';
import { validate } from '../../shared/middlewares/validate.middleware.js';

import {
  createSalaryStructureSchema,
  submitSalaryStructureSchema,
  approveSalaryStructureSchema
} from './salaryStructure.validator.js';

const router =
  express.Router();

router.post(
  '/',
  validate(
    createSalaryStructureSchema
  ),
  controller.createSalaryStructure
);

router.post(
  '/:id/submit',
  validate(
    submitSalaryStructureSchema
  ),
  controller.submitSalaryStructure
);

router.post(
  '/:id/approve',
  validate(
    approveSalaryStructureSchema
  ),
  controller.approveSalaryStructure
);

router.get(
  '/employee/:employeeId/current',
  controller.getCurrentSalaryStructure
);

router.get(
  '/employee/:employeeId/history',
  controller.getSalaryHistory
);

export default router;