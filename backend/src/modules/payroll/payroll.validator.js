// backend/src/modules/payroll/payroll.validator.js
import Joi from 'joi';

const generatePayrollSchema = Joi.object({
  employeeId: Joi.string().required(),
  period: Joi.object({
    year: Joi.number().required(),
    month: Joi.number().min(1).max(12).required()
  }).required(),
  notes: Joi.string().max(1000).allow(null)
});

const updatePayrollStatusSchema = Joi.object({
  notes: Joi.string().max(1000).allow(null),
  paymentReference: Joi.string().when('status', {
    is: 'PAID',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});

const getPayrollsQuerySchema = Joi.object({
  employeeId: Joi.string(),
  status: Joi.string().valid('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'PROCESSED', 'PAID'),
  year: Joi.number(),
  month: Joi.number().min(1).max(12),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20)
});

export const payrollValidator = {
  generatePayrollSchema,
  updatePayrollStatusSchema,
  getPayrollsQuerySchema
};