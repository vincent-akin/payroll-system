import Joi from 'joi';

export const createEmployeeSchema = Joi.object({
  employeeNumber: Joi.string()
    .trim()
    .required(),

  organizationId: Joi.string()
    .required(),

  departmentId: Joi.string()
    .required(),

  userId: Joi.string()
    .optional(),

  firstName: Joi.string()
    .trim()
    .required(),

  lastName: Joi.string()
    .trim()
    .required(),

  email: Joi.string()
    .email()
    .required(),

  phone: Joi.string()
    .optional(),

  jobTitle: Joi.string()
    .required(),

  employmentType: Joi.string()
    .valid(
      'FULL_TIME',
      'PART_TIME',
      'CONTRACT',
      'INTERN'
    )
    .optional(),

  hireDate: Joi.date()
    .required(),

  dateOfBirth: Joi.date()
    .optional(),

  gender: Joi.string()
    .valid(
      'MALE',
      'FEMALE',
      'OTHER'
    )
    .optional(),

  address: Joi.string()
    .optional(),

  emergencyContactName: Joi.string()
    .optional(),

  emergencyContactPhone: Joi.string()
    .optional()
});

export const updateEmployeeSchema =
  Joi.object({
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
  })
    .min(1);