import express from 'express';

import auth from '../../shared/middlewares/auth.middleware.js';
import permissions from '../../shared/middlewares/permissions.middleware.js';

import {
  createEmployeeController,
  getEmployeesController,
  getEmployeeController,
  updateEmployeeController,
  deleteEmployeeController
} from './employee.controller.js';

const router = express.Router();

router.post(
  '/',
  auth,
  permissions('employee:create'),
  createEmployeeController
);

router.get(
  '/',
  auth,
  permissions('employee:view'),
  getEmployeesController
);

router.get(
  '/:id',
  auth,
  permissions('employee:view'),
  getEmployeeController
);

router.patch(
  '/:id',
  auth,
  permissions('employee:update'),
  updateEmployeeController
);

router.delete(
  '/:id',
  auth,
  permissions('employee:delete'),
  deleteEmployeeController
);

export default router;