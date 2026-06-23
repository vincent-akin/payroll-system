// backend/src/modules/auth/auth.routes.js
import express from 'express';
import * as authController from './auth.controller.js';
import { validate } from '../../shared/middlewares/validate.middleware.js';
import authValidator from './auth.validator.js';
import authMiddleware from '../../shared/middlewares/auth.middleware.js';

const router = express.Router();

router.post(
    '/login',
    validate(authValidator.loginSchema),
    authController.login
);

router.post(
    '/refresh',
    validate(authValidator.refreshSchema),
    authController.refresh
);

router.post(
    '/logout',
    authMiddleware,
    authController.logout
);

router.get(
    '/me',
    authMiddleware,
    authController.me
);

router.patch(
    '/change-password',
    authMiddleware,
    validate(authValidator.changePasswordSchema),
    authController.changePassword
);

export default router;