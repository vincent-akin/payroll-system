import Joi from 'joi';

export const createAttendanceSchema =
  Joi.object({
    employeeId: Joi.string()
      .hex()
      .length(24)
      .required(),

    attendanceDate: Joi.date()
      .required(),

    clockInAt: Joi.date(),

    clockOutAt: Joi.date(),

    overtimeHours: Joi.number()
      .min(0)
      .default(0),

    lateMinutes: Joi.number()
      .min(0)
      .default(0),

    status: Joi.string().valid(
      'PRESENT',
      'ABSENT',
      'LATE',
      'HALF_DAY',
      'LEAVE',
      'HOLIDAY'
    )
  });

export const submitAttendanceSchema =
  Joi.object({});

export const approveAttendanceSchema =
  Joi.object({});

export const lockAttendanceSchema =
  Joi.object({});