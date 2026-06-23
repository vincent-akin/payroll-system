// backend/src/modules/auth/auth.validator.js
import Joi from 'joi';

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const refreshSchema = Joi.object({
    refreshToken: Joi.string().required()
});

const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required()
});

const authValidator = {
    loginSchema,
    refreshSchema,
    changePasswordSchema
};

export default authValidator;