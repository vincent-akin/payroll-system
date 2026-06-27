// backend/src/modules/attendance/attendance.service.js
import Attendance from './attendance.model.js';
import AppError from '../../shared/errors/AppError.js';

// ADD THIS FUNCTION
export const getAttendances = async (query = {}) => {
  try {
    const attendances = await Attendance.find(query)
      .populate('employeeId', 'firstName lastName email')
      .sort({ attendanceDate: -1 });
    return attendances;
  } catch (error) {
    throw error;
  }
};

export const createAttendance = async (data, userId) => {
  try {
    const attendance = new Attendance({
      ...data,
      employeeId: userId,
    });
    await attendance.save();
    return attendance;
  } catch (error) {
    throw error;
  }
};

export const submitAttendance = async (id) => {
  try {
    const attendance = await Attendance.findById(id);
    if (!attendance) {
      throw new AppError('Attendance not found', 404);
    }
    attendance.workflowStatus = 'SUBMITTED';
    await attendance.save();
    return attendance;
  } catch (error) {
    throw error;
  }
};

export const approveAttendance = async (id, userId) => {
  try {
    const attendance = await Attendance.findById(id);
    if (!attendance) {
      throw new AppError('Attendance not found', 404);
    }
    attendance.workflowStatus = 'APPROVED';
    attendance.approvedBy = userId;
    attendance.approvedAt = new Date();
    await attendance.save();
    return attendance;
  } catch (error) {
    throw error;
  }
};

export const lockAttendance = async (id) => {
  try {
    const attendance = await Attendance.findById(id);
    if (!attendance) {
      throw new AppError('Attendance not found', 404);
    }
    attendance.workflowStatus = 'LOCKED';
    attendance.isPayrollProcessed = true;
    await attendance.save();
    return attendance;
  } catch (error) {
    throw error;
  }
};

export const getEmployeeAttendance = async (employeeId) => {
  try {
    const attendances = await Attendance.find({ employeeId })
      .sort({ attendanceDate: -1 });
    return attendances;
  } catch (error) {
    throw error;
  }
};

export const getAttendanceById = async (id) => {
  try {
    const attendance = await Attendance.findById(id)
      .populate('employeeId', 'firstName lastName email');
    if (!attendance) {
      throw new AppError('Attendance not found', 404);
    }
    return attendance;
  } catch (error) {
    throw error;
  }
};