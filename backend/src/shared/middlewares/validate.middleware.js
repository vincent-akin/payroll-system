// backend/src/shared/middlewares/validate.middleware.js
import AppError from '../errors/AppError.js';

export const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const data = req[property];
    
    if (!data) {
      return next(new AppError(`Request ${property} is missing`, 400));
    }

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return next(new AppError('Validation error', 400, errors));
    }

    // Replace request data with validated and sanitized data
    req[property] = value;
    next();
  };
};