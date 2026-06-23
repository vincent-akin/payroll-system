// backend/src/modules/payroll/payroll.controller.js
import * as payrollService from './payroll.service.js';

export const generatePayroll = async (req, res, next) => {
  try {
    const payroll = await payrollService.generatePayroll(req.body, req.user.id);
    res.status(201).json({
      status: 'success',
      data: payroll
    });
  } catch (error) {
    next(error);
  }
};

export const submitPayroll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payroll = await payrollService.submitPayroll(id, req.user.id);
    res.status(200).json({
      status: 'success',
      data: payroll
    });
  } catch (error) {
    next(error);
  }
};

export const reviewPayroll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payroll = await payrollService.reviewPayroll(id, req.user.id);
    res.status(200).json({
      status: 'success',
      data: payroll
    });
  } catch (error) {
    next(error);
  }
};

export const approvePayroll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payroll = await payrollService.approvePayroll(id, req.user.id);
    res.status(200).json({
      status: 'success',
      data: payroll
    });
  } catch (error) {
    next(error);
  }
};

export const processPayroll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payroll = await payrollService.processPayroll(id, req.user.id);
    res.status(200).json({
      status: 'success',
      data: payroll
    });
  } catch (error) {
    next(error);
  }
};

export const markPayrollPaid = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentReference } = req.body;
    const payroll = await payrollService.markPayrollPaid(id, req.user.id, paymentReference);
    res.status(200).json({
      status: 'success',
      data: payroll
    });
  } catch (error) {
    next(error);
  }
};

export const getPayrolls = async (req, res, next) => {
  try {
    const result = await payrollService.getPayrolls(req.query);
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getPayroll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payroll = await payrollService.getPayroll(id);
    res.status(200).json({
      status: 'success',
      data: payroll
    });
  } catch (error) {
    next(error);
  }
};