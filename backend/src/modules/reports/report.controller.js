// backend/src/modules/reports/report.controller.js
import * as reportService from './report.service.js';

export const getPayrollSummaryReport = async (req, res, next) => {
  try {
    const { organizationId, year, month } = req.query;
    const period = { year: parseInt(year), month: parseInt(month) };
    
    const report = await reportService.getPayrollSummaryReport(organizationId, period);
    res.status(200).json({
      status: 'success',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const getDepartmentPayrollReport = async (req, res, next) => {
  try {
    const { organizationId, year, month } = req.query;
    const period = { year: parseInt(year), month: parseInt(month) };
    
    const report = await reportService.getDepartmentPayrollReport(organizationId, period);
    res.status(200).json({
      status: 'success',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const getAttendanceReport = async (req, res, next) => {
  try {
    const { organizationId, year, month } = req.query;
    const period = { year: parseInt(year), month: parseInt(month) };
    
    const report = await reportService.getAttendanceReport(organizationId, period);
    res.status(200).json({
      status: 'success',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const getLeaveReport = async (req, res, next) => {
  try {
    const { organizationId, year, month } = req.query;
    const period = { year: parseInt(year), month: parseInt(month) };
    
    const report = await reportService.getLeaveReport(organizationId, period);
    res.status(200).json({
      status: 'success',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeCostReport = async (req, res, next) => {
  try {
    const { organizationId, year, month } = req.query;
    const period = { year: parseInt(year), month: parseInt(month) };
    
    const report = await reportService.getEmployeeCostReport(organizationId, period);
    res.status(200).json({
      status: 'success',
      data: report
    });
  } catch (error) {
    next(error);
  }
};