import {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
} from './department.service.js';

export const createDepartmentController = async (req, res, next) => {
    try {
        const department = await createDepartment(req.body);

        res.status(201).json({
            success: true,
            data: department
        });
    } catch (err) {
        next(err);
    }
};

export const getDepartmentsController = async (req, res, next) => {
    try {
        const departments = await getDepartments(
            req.query.organizationId
        );

        res.status(200).json({
            success: true,
            data: departments
        });
    } catch (err) {
        next(err);
    }
};

export const getDepartmentController = async (req, res, next) => {
    try {
        const department = await getDepartmentById(req.params.id);

        res.status(200).json({
            success: true,
            data: department
        });
    } catch (err) {
        next(err);
    }
};

export const updateDepartmentController = async (req, res, next) => {
    try {
            const department = await updateDepartment(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            data: department
        });
    } catch (err) {
        next(err);
    }
};

export const deleteDepartmentController = async (req, res, next) => {
    try {
        await deleteDepartment(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Department deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};