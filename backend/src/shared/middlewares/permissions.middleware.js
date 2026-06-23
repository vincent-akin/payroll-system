import AppError from '../errors/AppError.js';

const permissions = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError('Authentication required', 401)
      );
    }

    const userPermissions =
      req.user.permissions || [];

    const hasPermission =
      requiredPermissions.every(permission =>
        userPermissions.includes(permission)
      );

    if (!hasPermission) {
      return next(
        new AppError(
          'Insufficient permissions',
          403
        )
      );
    }

    next();
  };
};

export default permissions;