import Department from './department.model.js';
import AppError from '../../shared/errors/AppError.js';

export const createDepartment = async (payload) => {
    const exists = await Department.findOne({
        organizationId: payload.organizationId,
        code: payload.code.toUpperCase()
    });

    if (exists) {
        throw new AppError('Department code already exists', 409);
    }

    return Department.create({
        ...payload,
        code: payload.code.toUpperCase()
    });
};

export const getDepartments = async (organizationId) => {
    return Department.find({ organizationId })
        .populate('headOfDepartment', 'firstName lastName email')
        .sort({ createdAt: -1 });
};

export const getDepartmentById = async (id) => {
    const department = await Department.findById(id);

    if (!department) {
        throw new AppError('Department not found', 404);
    }

    return department;
};

export const updateDepartment = async (id, payload) => {
    const department = await Department.findByIdAndUpdate(
        id,
        payload,
        { new: true, runValidators: true }
    );

    if (!department) {
        throw new AppError('Department not found', 404);
    }

    return department;
};

export const deleteDepartment = async (id) => {
    const department = await Department.findById(id);

    if (!department) {
        throw new AppError('Department not found', 404);
    }

    await department.deleteOne();
    return true;
};