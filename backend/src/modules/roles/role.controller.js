import * as roleService from './role.service.js';

export const createRole = async (req, res, next) => {
    try {
        const role = await roleService.createRole(req.body);

        res.status(201).json({
            success: true,
            data: role,
        });
    } catch (error) {
        next(error);
    }
};

export const getRoles = async (req, res, next) => {
    try {
        const roles = await roleService.getRoles();

        res.status(200).json({
            success: true,
            data: roles,
        });
    } catch (error) {
        next(error);
    }
};

export const getRoleById = async (req, res, next) => {
    try {
        const role = await roleService.getRoleById(req.params.id);

        res.status(200).json({
            success: true,
            data: role,
        });
    } catch (error) {
        next(error);
    }
};

export const updateRole = async (req, res, next) => {
    try {
        const role = await roleService.updateRole(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            data: role,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteRole = async (req, res, next) => {
    try {
        await roleService.deleteRole(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Role deactivated successfully',
        });
    } catch (error) {
        next(error);
    }
};