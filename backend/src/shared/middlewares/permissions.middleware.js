// backend/src/shared/middlewares/permissions.middleware.js
import AppError from '../errors/AppError.js';

const permissions = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError('Authentication required', 401)
      );
    }

    // Super Admin bypass (if they have '*' permission)
    if (req.user.permissions?.includes('*')) {
      return next();
    }

    const userPermissions = req.user.permissions || [];

    // Check if user has any of the required permissions
    const hasPermission = requiredPermissions.some(permission =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      console.log('Permission denied:', {
        required: requiredPermissions,
        userPermissions: userPermissions,
        roleName: req.user.roleName
      });
      return next(
        new AppError('Insufficient permissions', 403)
      );
    }

    next();
  };
};

export default permissions;