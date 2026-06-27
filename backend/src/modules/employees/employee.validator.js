import Joi from 'joi';

export const createEmployeeSchema = Joi.object({
  employeeNumber: Joi.string()
    .trim()
    .optional()
    .allow('', null),

  organizationId: Joi.string().required(),

  departmentId: Joi.string().required(),

  userId: Joi.string().optional(),

  firstName: Joi.string().trim().required(),

  lastName: Joi.string().trim().required(),

  email: Joi.string().email().required(),

  phone: Joi.string().allow('', null),

  jobTitle: Joi.string().trim().required(),

  employmentType: Joi.string()
    .valid(
      'FULL_TIME',
      'PART_TIME',
      'CONTRACT',
      'INTERN'
    )
    .default('FULL_TIME'),

  hireDate: Joi.date()
    .optional()
    .default(() => new Date()),

  status: Joi.string()
    .valid(
      'ACTIVE',
      'ON_LEAVE',
      'SUSPENDED',
      'TERMINATED'
    )
    .default('ACTIVE'),

  dateOfBirth: Joi.date().optional().allow(null),

  gender: Joi.string()
    .valid(
      'MALE',
      'FEMALE',
      'OTHER'
    )
    .optional(),

  address: Joi.string().allow('', null),

  emergencyContactName: Joi.string().allow('', null),

  emergencyContactPhone: Joi.string().allow('', null)
});

export const updateEmployeeSchema = Joi.object({
  organizationId: Joi.string(),

  departmentId: Joi.string(),

  userId: Joi.string(),

  firstName: Joi.string(),

  lastName: Joi.string(),

  email: Joi.string().email(),

  phone: Joi.string(),

  jobTitle: Joi.string(),

  employmentType: Joi.string().valid(
    'FULL_TIME',
    'PART_TIME',
    'CONTRACT',
    'INTERN'
  ),

  status: Joi.string().valid(
    'ACTIVE',
    'ON_LEAVE',
    'SUSPENDED',
    'TERMINATED'
  ),

  hireDate: Joi.date(),

  dateOfBirth: Joi.date(),

  gender: Joi.string().valid(
    'MALE',
    'FEMALE',
    'OTHER'
  ),

  address: Joi.string(),

  emergencyContactName: Joi.string(),

  emergencyContactPhone: Joi.string()
}).min(1);