import * as leaveService from './leave.service.js';

// backend/src/modules/leave/leave.controller.js
export const createLeave = async (req, res, next) => {
  try {
    // The backend might expect employeeId from the authenticated user
    const userId = req.user.id;
    
    // Or it might expect the employeeId in the body
    const { leaveType, startDate, endDate, totalDays, reason } = req.body;
    
    // Make sure you're sending the right fields
    const leave = await leaveService.createLeave({
      employeeId: userId, // or req.body.employeeId
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
    });
    
    res.status(201).json({
      success: true,
      data: leave,
    });
  } catch (error) {
    next(error);
  }
};

export const approveLeave =
  async (
    req,
    res,
    next
  ) => {
    try {
      const leave =
        await leaveService.approveLeave(
          req.params.id,
          req.user.id
        );

      res.json({
        success: true,
        data: leave
      });
    } catch (error) {
      next(error);
    }
  };

export const rejectLeave =
  async (
    req,
    res,
    next
  ) => {
    try {
      const leave =
        await leaveService.rejectLeave(
          req.params.id,
          req.body.rejectionReason
        );

      res.json({
        success: true,
        data: leave
      });
    } catch (error) {
      next(error);
    }
  };

export const getLeaves =
  async (
    req,
    res,
    next
  ) => {
    try {
      const leaves =
        await leaveService.getLeaves();

      res.json({
        success: true,
        data: leaves
      });
    } catch (error) {
      next(error);
    }
  };

export const getLeave =
  async (
    req,
    res,
    next
  ) => {
    try {
      const leave =
        await leaveService.getLeave(
          req.params.id
        );

      res.json({
        success: true,
        data: leave
      });
    } catch (error) {
      next(error);
    }
  };