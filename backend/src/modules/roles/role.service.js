import Role from './role.model.js';
import AppError from '../../shared/errors/AppError.js';

export const createRole = async (payload) => {
    const existingRole = await Role.findOne({
        name: payload.name.toUpperCase(),
    });

    if (existingRole) {
        throw new AppError('Role already exists', 409);
    }

    return Role.create({
        ...payload,
        name: payload.name.toUpperCase(),
    });
};

export const getRoles = async () => {
    return Role.find().sort({ createdAt: -1 });
};

export const getRoleById = async (id) => {
    const role = await Role.findById(id);

    if (!role) {
        throw new AppError('Role not found', 404);
    }

    return role;
};

export const updateRole = async (id, payload) => {
    const role = await Role.findById(id);

    if (!role) {
        throw new AppError('Role not found', 404);
    }

    Object.assign(role, payload);

    await role.save();

    return role;
};

export const deleteRole = async (id) => {
    const role = await Role.findById(id);

    if (!role) {
        throw new AppError('Role not found', 404);
    }

    role.isActive = false;

    await role.save();

    return role;
};