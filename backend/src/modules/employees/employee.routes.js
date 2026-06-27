// backend/src/modules/employees/employee.routes.js
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

// Update to use the same permission names as in your role seeding
router.post(
  '/',
  auth,
  permissions('create_employee'),  // ← Changed from 'employee:create'
  createEmployeeController
);

router.get(
  '/',
  auth,
  permissions('view_employees'),  // ← Changed from 'employee:view'
  getEmployeesController
);

router.get(
  '/:id',
  auth,
  permissions('view_employees'),  // ← Changed from 'employee:view'
  getEmployeeController
);

router.patch(
  '/:id',
  auth,
  permissions('update_employee'),  // ← Changed from 'employee:update'
  updateEmployeeController
);

router.delete(
  '/:id',
  auth,
  permissions('delete_employee'),  // ← Changed from 'employee:delete'
  deleteEmployeeController
);

export default router;