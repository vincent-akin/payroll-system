import * as service from './salaryStructure.service.js';

export const createSalaryStructure =
  async (
    req,
    res,
    next
  ) => {
    try {
      const data =
        await service
          .createSalaryStructure(
            req.body,
            req.user.id
          );

      res.status(201).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };

export const submitSalaryStructure =
  async (
    req,
    res,
    next
  ) => {
    try {
      const data =
        await service
          .submitSalaryStructure(
            req.params.id
          );

      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };

export const approveSalaryStructure =
  async (
    req,
    res,
    next
  ) => {
    try {
      const data =
        await service
          .approveSalaryStructure(
            req.params.id,
            req.user.id
          );

      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };

export const getCurrentSalaryStructure =
  async (
    req,
    res,
    next
  ) => {
    try {
      const data =
        await service
          .getCurrentSalaryStructure(
            req.params.employeeId
          );

      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };

export const getSalaryHistory =
  async (
    req,
    res,
    next
  ) => {
    try {
      const data =
        await service
          .getSalaryHistory(
            req.params.employeeId
          );

      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };