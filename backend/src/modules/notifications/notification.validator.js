// backend/src/modules/notifications/notification.validator.js
import Joi from 'joi';

const createNotificationSchema = Joi.object({
  userId: Joi.string().required(),
  type: Joi.string().valid(
    'LEAVE_APPROVED',
    'LEAVE_REJECTED',
    'LEAVE_PENDING',
    'PAYROLL_SUBMITTED',
    'PAYROLL_APPROVED',
    'PAYROLL_PAID',
    'PAYROLL_REJECTED',
    'PAYSLIP_GENERATED',
    'PASSWORD_CHANGED',
    'EMPLOYEE_CREATED',
    'EMPLOYEE_TERMINATED',
    'DEDUCTION_ACTIVATED',
    'DEDUCTION_DEACTIVATED'
  ).required(),
  title: Joi.string().max(200).required(),
  message: Joi.string().max(1000).required(),
  data: Joi.object(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
  link: Joi.string().allow(null),
  sourceId: Joi.string().allow(null),
  sourceType: Joi.string().allow(null)
});

const getNotificationsQuerySchema = Joi.object({
  read: Joi.boolean(),
  type: Joi.string(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20)
});

export const notificationValidator = {
  createNotificationSchema,
  getNotificationsQuerySchema
};