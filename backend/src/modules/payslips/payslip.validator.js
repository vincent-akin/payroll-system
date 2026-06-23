// backend/src/modules/payslips/payslip.validator.js
import Joi from 'joi';

const generatePayslipSchema = Joi.object({
  payrollId: Joi.string().required()
});

const getPayslipsQuerySchema = Joi.object({
  employeeId: Joi.string(),
  status: Joi.string().valid('GENERATED', 'EMAILED', 'VIEWED'),
  year: Joi.number(),
  month: Joi.number().min(1).max(12),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20)
});

const emailPayslipSchema = Joi.object({
  email: Joi.string().email().optional(),
  subject: Joi.string().optional(),
  message: Joi.string().optional()
});

export const payslipValidator = {
  generatePayslipSchema,
  getPayslipsQuerySchema,
  emailPayslipSchema
};