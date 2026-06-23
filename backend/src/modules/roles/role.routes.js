import { Router } from 'express';

import * as roleController from './role.controller.js';
import {
    createRoleValidator,
    updateRoleValidator,
} from './role.validator.js';

const router = Router();

router.post(
    '/',
    createRoleValidator,
    roleController.createRole
);

router.get(
    '/',
    roleController.getRoles
);

router.get(
    '/:id',
    roleController.getRoleById
);

router.patch(
    '/:id',
    updateRoleValidator,
    roleController.updateRole
);

router.delete(
    '/:id',
    roleController.deleteRole
);

export default router;