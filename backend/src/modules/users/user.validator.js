import { body } from 'express-validator';

export const createUserValidator = [
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required'),

    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required'),

    body('email')
        .isEmail()
        .withMessage('Valid email is required'),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),

    body('roleId')
        .notEmpty()
        .withMessage('Role is required'),
];

export const updateUserValidator = [
    body('firstName').optional().isString(),
    body('lastName').optional().isString(),
    body('roleId').optional(),
    body('isActive').optional().isBoolean(),
];