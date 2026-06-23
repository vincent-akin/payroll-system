// backend/src/modules/users/user.controller.js
import { validationResult } from 'express-validator';
import * as userService from './user.service.js';
import AppError from '../../shared/errors/AppError.js';

export const createUser = async (req, res, next) => {
    try {
        // Check validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new AppError('Validation error', 400, errors.array()));
        }

        const user = await userService.createUser(req.body);

        res.status(201).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getUsers();

        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        // Check validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new AppError('Validation error', 400, errors.array()));
        }

        const user = await userService.updateUser(req.params.id, req.body);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const deactivateUser = async (req, res, next) => {
    try {
        await userService.deactivateUser(req.params.id);

        res.status(200).json({
            success: true,
            message: 'User deactivated successfully',
        });
    } catch (error) {
        next(error);
    }
};