import Joi from 'joi';

export const createOrganizationSchema = Joi.object({
    name: Joi.string().max(150).required(),

    code: Joi.string().max(20).required(),

    email: Joi.string().email().optional(),

    phone: Joi.string().optional(),

    address: Joi.string().optional(),

    taxId: Joi.string().optional(),

    logoUrl: Joi.string().uri().optional()
});

export const updateOrganizationSchema = Joi.object({
    name: Joi.string().max(150),

    email: Joi.string().email(),

    phone: Joi.string(),

    address: Joi.string(),

    taxId: Joi.string(),

    logoUrl: Joi.string().uri(),

    isActive: Joi.boolean()
});