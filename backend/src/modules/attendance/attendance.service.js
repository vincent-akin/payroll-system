import Attendance from './attendance.model.js';
import AppError from '../../shared/errors/AppError.js';

const calculateWorkedHours = (
  clockInAt,
  clockOutAt
) => {
  if (
    !clockInAt ||
    !clockOutAt
  ) {
    return 0;
  }

  const diff =
    new Date(clockOutAt) -
    new Date(clockInAt);

  return Number(
    (diff / 3600000).toFixed(2)
  );
};

export const createAttendance =
  async (
    payload,
    userId
  ) => {
    const workedHours =
      calculateWorkedHours(
        payload.clockInAt,
        payload.clockOutAt
      );

    return Attendance.create({
      ...payload,
      workedHours,
      createdBy: userId
    });
  };

export const submitAttendance =
  async (id) => {
    return Attendance.findByIdAndUpdate(
      id,
      {
        workflowStatus:
          'SUBMITTED'
      },
      {
        new: true
      }
    );
  };

export const approveAttendance =
  async (
    id,
    userId
  ) => {
    return Attendance.findByIdAndUpdate(
      id,
      {
        workflowStatus:
          'APPROVED',
        approvedBy: userId,
        approvedAt: new Date()
      },
      {
        new: true
      }
    );
  };

export const lockAttendance =
  async (id) => {
    return Attendance.findByIdAndUpdate(
      id,
      {
        workflowStatus:
          'LOCKED'
      },
      {
        new: true
      }
    );
  };

export const getEmployeeAttendance =
  async (employeeId) => {
    return Attendance.find({
      employeeId
    }).sort({
      attendanceDate: -1
    });
  };

export const getAttendanceById =
  async (id) => {
    return Attendance.findById(id);
  };