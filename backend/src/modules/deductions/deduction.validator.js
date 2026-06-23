// backend/src/modules/deductions/deduction.validator.js
import Joi from 'joi';

const createDeductionSchema = Joi.object({
  employeeId: Joi.string().required(),
  type: Joi.string().valid('TAX', 'PENSION', 'LOAN', 'INSURANCE', 'OTHER').required(),
  amount: Joi.number().min(0).required(),
  frequency: Joi.string().valid('ONE_TIME', 'MONTHLY').required(),
  description: Joi.string().max(500).required(),
  effectiveFrom: Joi.date().required(),
  effectiveTo: Joi.date().min(Joi.ref('effectiveFrom')).allow(null),
  metadata: Joi.object()
});

const updateDeductionSchema = Joi.object({
  amount: Joi.number().min(0),
  description: Joi.string().max(500),
  effectiveFrom: Joi.date(),
  effectiveTo: Joi.date().min(Joi.ref('effectiveFrom')).allow(null),
  metadata: Joi.object()
});

const getDeductionsQuerySchema = Joi.object({
  employeeId: Joi.string(),
  status: Joi.string().valid('DRAFT', 'ACTIVE', 'INACTIVE'),
  type: Joi.string().valid('TAX', 'PENSION', 'LOAN', 'INSURANCE', 'OTHER'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20)
});

export const deductionValidator = {
  createDeductionSchema,
  updateDeductionSchema,
  getDeductionsQuerySchema
};