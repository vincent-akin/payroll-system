import { body } from 'express-validator';

export const createRoleValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Role name is required'),

    body('description')
        .optional()
        .isString(),

    body('permissions')
        .optional()
        .isArray(),
];

export const updateRoleValidator = [
    body('name')
        .optional()
        .isString(),

    body('description')
        .optional()
        .isString(),

    body('permissions')
        .optional()
        .isArray(),
];