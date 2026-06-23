// backend/src/modules/deductions/deduction.controller.js
import * as deductionService from './deduction.service.js';

export const createDeduction = async (req, res, next) => {
  try {
    const deduction = await deductionService.createDeduction(req.body, req.user.id);
    res.status(201).json({
      status: 'success',
      data: deduction
    });
  } catch (error) {
    next(error);
  }
};

export const activateDeduction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deduction = await deductionService.activateDeduction(id, req.user.id);
    res.status(200).json({
      status: 'success',
      data: deduction
    });
  } catch (error) {
    next(error);
  }
};

export const deactivateDeduction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deduction = await deductionService.deactivateDeduction(id);
    res.status(200).json({
      status: 'success',
      data: deduction
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeDeductions = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const result = await deductionService.getEmployeeDeductions(employeeId, req.query);
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getActiveDeductions = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const deductions = await deductionService.getActiveDeductions(employeeId);
    res.status(200).json({
      status: 'success',
      data: deductions
    });
  } catch (error) {
    next(error);
  }
};

export const getDeduction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deduction = await deductionService.getDeduction(id);
    res.status(200).json({
      status: 'success',
      data: deduction
    });
  } catch (error) {
    next(error);
  }
};

export const updateDeduction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deduction = await deductionService.updateDeduction(id, req.body);
    res.status(200).json({
      status: 'success',
      data: deduction
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDeduction = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deductionService.deleteDeduction(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};