import express from 'express';

import auth from '../../shared/middlewares/auth.middleware.js';
import permissions from '../../shared/middlewares/permissions.middleware.js';

import {
    createDepartmentController,
    getDepartmentsController,
    getDepartmentController,
    updateDepartmentController,
    deleteDepartmentController
} from './department.controller.js';

const router = express.Router();

router.post(
    '/',
    auth,
    permissions('department:create'),
    createDepartmentController
);

router.get(
    '/',
    auth,
    permissions('department:view'),
    getDepartmentsController
);

router.get(
    '/:id',
    auth,
    permissions('department:view'),
    getDepartmentController
);

router.patch(
    '/:id',
    auth,
    permissions('department:update'),
    updateDepartmentController
);

router.delete(
    '/:id',
    auth,
    permissions('department:delete'),
    deleteDepartmentController
);

export default router;