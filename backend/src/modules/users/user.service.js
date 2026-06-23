import bcrypt from 'bcryptjs';

import User from './user.model.js';
import Role from '../roles/role.model.js';
import AppError from '../../shared/errors/AppError.js';

export const createUser = async (payload) => {
    const existingUser = await User.findOne({
        email: payload.email.toLowerCase(),
    });

    if (existingUser) {
        throw new AppError('Email already exists', 409);
    }

    const role = await Role.findById(payload.roleId);

    if (!role) {
        throw new AppError('Role not found', 404);
    }

    const hashedPassword = await bcrypt.hash(
        payload.password,
        12
    );

    return User.create({
        ...payload,
        email: payload.email.toLowerCase(),
        password: hashedPassword,
    });
};

export const getUsers = async () => {
    return User.find()
        .populate('roleId')
        .sort({ createdAt: -1 });
};

export const getUserById = async (id) => {
    const user = await User.findById(id)
        .populate('roleId');

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return user;
};

export const updateUser = async (id, payload) => {
    const user = await User.findById(id);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    Object.assign(user, payload);

    await user.save();

    return user;
};

export const deactivateUser = async (id) => {
    const user = await User.findById(id);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    user.isActive = false;

    await user.save();

    return user;
};