// backend/src/modules/users/user.routes.js
import { Router } from 'express';
import * as userController from './user.controller.js';
import {
    createUserValidator,
    updateUserValidator,
} from './user.validator.js';
import authMiddleware from '../../shared/middlewares/auth.middleware.js';
import permissionsMiddleware from '../../shared/middlewares/permissions.middleware.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Routes that require SUPER_ADMIN permissions
router.post(
    '/',
    permissionsMiddleware(['SUPER_ADMIN']),
    createUserValidator,
    userController.createUser
);

router.get(
    '/',
    permissionsMiddleware(['SUPER_ADMIN', 'HR_MANAGER']),
    userController.getUsers
);

router.get(
    '/:id',
    permissionsMiddleware(['SUPER_ADMIN', 'HR_MANAGER']),
    userController.getUserById
);

router.patch(
    '/:id',
    permissionsMiddleware(['SUPER_ADMIN']),
    updateUserValidator,
    userController.updateUser
);

router.delete(
    '/:id',
    permissionsMiddleware(['SUPER_ADMIN']),
    userController.deactivateUser
);

export default router;