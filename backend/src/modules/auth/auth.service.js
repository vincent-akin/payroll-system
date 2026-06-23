import bcrypt from 'bcryptjs';

import User from '../users/user.model.js';
import AppError from '../../shared/errors/AppError.js';

import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from './auth.tokens.js';

export const login = async (email, password) => {
    const user = await User.findOne({
        email: email.toLowerCase(),
        isActive: true,
    })
        .select('+password')
        .populate('roleId');

    if (!user) {
        throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new AppError('Invalid credentials', 401);
    }

    const payload = {
        userId: user._id,
        roleId: user.roleId._id,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.lastLoginAt = new Date();
    await user.save();

    return {
        user,
        accessToken,
        refreshToken,
    };
};

export const refresh = async (refreshToken) => {
    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.userId).populate('roleId');

    if (!user || !user.isActive) {
        throw new AppError('User not found', 404);
    }

    const payload = {
        userId: user._id,
        roleId: user.roleId._id,
    };

    return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload),
    };
};

export const me = async (userId) => {
    return User.findById(userId)
        .populate('roleId')
        .select('-password');
};

export const changePassword = async (
    userId,
    currentPassword,
    newPassword
) => {
    const user = await User.findById(userId).select('+password');

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const valid = await bcrypt.compare(currentPassword, user.password);

    if (!valid) {
        throw new AppError('Current password incorrect', 400);
    }

    user.password = await bcrypt.hash(newPassword, 12);

    await user.save();
};