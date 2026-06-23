import * as leaveService from './leave.service.js';

export const createLeave =
  async (
    req,
    res,
    next
  ) => {
    try {
      const leave =
        await leaveService.createLeave(
          req.body,
          req.user.id
        );

      res.status(201).json({
        success: true,
        data: leave
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