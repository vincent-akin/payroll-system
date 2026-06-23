// backend/src/modules/payslips/payslip.controller.js
import * as payslipService from './payslip.service.js';

export const generatePayslip = async (req, res, next) => {
  try {
    const { payrollId } = req.body;
    const payslip = await payslipService.generatePayslip(payrollId, req.user.id);
    res.status(201).json({
      status: 'success',
      data: payslip
    });
  } catch (error) {
    next(error);
  }
};

export const emailPayslip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payslip = await payslipService.emailPayslip(id, req.body);
    res.status(200).json({
      status: 'success',
      data: payslip
    });
  } catch (error) {
    next(error);
  }
};

export const markViewed = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payslip = await payslipService.markViewed(id);
    res.status(200).json({
      status: 'success',
      data: payslip
    });
  } catch (error) {
    next(error);
  }
};

export const getPayslips = async (req, res, next) => {
  try {
    const result = await payslipService.getPayslips(req.query);
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getPayslip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payslip = await payslipService.getPayslip(id);
    res.status(200).json({
      status: 'success',
      data: payslip
    });
  } catch (error) {
    next(error);
  }
};

export const downloadPayslip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payslip = await payslipService.getPayslip(id);
    // PDF download logic would go here
    // For now, return payslip data
    res.status(200).json({
      status: 'success',
      data: payslip
    });
  } catch (error) {
    next(error);
  }
};