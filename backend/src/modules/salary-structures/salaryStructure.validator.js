import Joi from 'joi';

const allowanceSchema = Joi.object({
  type: Joi.string()
    .valid(
      'HOUSING',
      'TRANSPORT',
      'MEAL',
      'UTILITY',
      'MEDICAL',
      'OTHER'
    )
    .required(),

  name: Joi.string()
    .trim()
    .max(100)
    .required(),

  amount: Joi.number()
    .min(0)
    .required()
});

const deductionSchema = Joi.object({
  type: Joi.string()
    .valid(
      'TAX',
      'PENSION',
      'LOAN',
      'INSURANCE',
      'OTHER'
    )
    .required(),

  name: Joi.string()
    .trim()
    .max(100)
    .required(),

  amount: Joi.number()
    .min(0)
    .required()
});

export const createSalaryStructureSchema =
  Joi.object({
    employeeId: Joi.string()
      .hex()
      .length(24)
      .required(),

    currency: Joi.string()
      .uppercase()
      .length(3)
      .default('NGN'),

    payFrequency: Joi.string()
      .valid(
        'WEEKLY',
        'BI_WEEKLY',
        'MONTHLY'
      )
      .default('MONTHLY'),

    basicSalary: Joi.number()
      .min(0)
      .required(),

    allowances: Joi.array()
      .items(allowanceSchema)
      .default([]),

    deductions: Joi.array()
      .items(deductionSchema)
      .default([]),

    effectiveFrom: Joi.date()
      .required()
  });

export const submitSalaryStructureSchema =
  Joi.object({});

export const approveSalaryStructureSchema =
  Joi.object({});

export const rejectSalaryStructureSchema =
  Joi.object({
    reason: Joi.string()
      .required()
  });