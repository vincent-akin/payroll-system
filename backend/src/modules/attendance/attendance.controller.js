// backend/src/modules/attendance/attendance.controller.js
import * as attendanceService from './attendance.service.js';

// Add this missing function
export const getAttendances = async (req, res, next) => {
  try {
    const attendances = await attendanceService.getAttendances(req.query);
    res.status(200).json({
      success: true,
      data: attendances,
    });
  } catch (error) {
    next(error);
  }
};

export const createAttendance = async (req, res, next) => {
  try {
    const attendance = await attendanceService.createAttendance(
      req.body,
      req.user.id
    );
    res.status(201).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    next(error);
  }
};

export const submitAttendance = async (req, res, next) => {
  try {
    const attendance = await attendanceService.submitAttendance(
      req.params.id
    );
    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    next(error);
  }
};

export const approveAttendance = async (req, res, next) => {
  try {
    const attendance = await attendanceService.approveAttendance(
      req.params.id,
      req.user.id
    );
    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    next(error);
  }
};

export const lockAttendance = async (req, res, next) => {
  try {
    const attendance = await attendanceService.lockAttendance(
      req.params.id
    );
    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeAttendance = async (req, res, next) => {
  try {
    const attendance = await attendanceService.getEmployeeAttendance(
      req.params.employeeId
    );
    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    next(error);
  }
};

export const getAttendance = async (req, res, next) => {
  try {
    const attendance = await attendanceService.getAttendanceById(
      req.params.id
    );
    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    next(error);
  }
};