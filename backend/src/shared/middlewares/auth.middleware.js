// backend/src/shared/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import User from '../../modules/users/user.model.js';
import env from '../../config/env.js';
import AppError from '../errors/AppError.js';

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(
        new AppError('Authentication required', 401)
      );
    }

    const token = authHeader.split(' ')[1];

    // Fix: Use JWT_SECRET instead of JWT_ACCESS_SECRET
    const decoded = jwt.verify(
      token,
      env.JWT_SECRET  // ← Changed from JWT_ACCESS_SECRET
    );

    const user = await User.findById(decoded.userId)
      .populate('roleId');

    if (!user) {
      return next(
        new AppError('User not found', 401)
      );
    }

    if (!user.isActive) {
      return next(
        new AppError('Account is disabled', 403)
      );
    }

    req.user = {
      id: user._id,
      userId: user._id,
      email: user.email,
      roleId: user.roleId?._id,
      roleName: user.roleId?.name,
      permissions: user.roleId?.permissions || []
    };
      // Log for debugging
    console.log('🔑 Auth user:', {
        email: req.user.email,
        roleName: req.user.roleName,
        permissions: req.user.permissions
      });

    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    next(
      new AppError('Invalid or expired token', 401)
    );
  }
};

export default auth;