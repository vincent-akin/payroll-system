import Joi from 'joi';

export const createLeaveSchema =
  Joi.object({
    employeeId: Joi.string()
      .hex()
      .length(24)
      .required(),

    leaveType: Joi.string()
      .valid(
        'ANNUAL',
        'SICK',
        'MATERNITY',
        'PATERNITY',
        'COMPASSIONATE',
        'UNPAID'
      )
      .required(),

    startDate: Joi.date()
      .required(),

    endDate: Joi.date()
      .greater(
        Joi.ref('startDate')
      )
      .required(),

    reason: Joi.string()
      .trim()
      .required()
  });

export const approveLeaveSchema =
  Joi.object({});

export const rejectLeaveSchema =
  Joi.object({
    rejectionReason:
      Joi.string()
        .required()
  });