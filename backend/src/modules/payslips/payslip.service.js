// backend/src/modules/payslips/payslip.service.js
import { Payslip } from './payslip.model.js';
import AppError from '../../shared/errors/AppError.js';
import logger from '../../shared/utils/logger.js';
import { getPayroll } from '../payroll/payroll.service.js';
import * as employeeService from '../employees/employee.service.js';

// Remove the import for generatePayslipPdf since we're defining it here

export const generatePayslipPdf = async (payslipId) => {
  const payslip = await Payslip.findById(payslipId)
    .populate('employeeId')
    .populate('payrollId');
  
  if (!payslip) {
    throw new AppError('Payslip not found', 404);
  }

  // PDF generation logic would go here
  // For now, we'll just update metadata
  payslip.pdfMetadata = {
    fileName: `payslip-${payslip.payslipNumber}.pdf`,
    fileSize: 0, // Would be actual size
    generatedAt: new Date()
  };
  payslip.pdfUrl = `/payslips/${payslip.payslipNumber}.pdf`;
  await payslip.save();

  return payslip;
};

export const generatePayslip = async (payrollId, userId) => {
  // Check if payslip already exists
  const existing = await Payslip.findOne({ payrollId });
  if (existing) {
    throw new AppError('Payslip already generated for this payroll', 400);
  }

  // Get payroll data
  const payroll = await getPayroll(payrollId);
  if (payroll.status !== 'PROCESSED' && payroll.status !== 'PAID') {
    throw new AppError('Payroll must be PROCESSED or PAID to generate payslip', 400);
  }

  // Get employee data
  const employee = await getEmployee(payroll.employeeId);

  // Generate payslip number
  const payslipNumber = `PS-${payroll.period.year}-${String(payroll.period.month).padStart(2, '0')}-${employee.employeeCode}`;

  // Prepare payslip data
  const payslipData = {
    employeeId: employee._id,
    payrollId: payroll._id,
    payslipNumber,
    period: payroll.period,
    employeeDetails: {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      employeeCode: employee.employeeCode,
      department: employee.departmentId?.name || 'N/A',
      position: employee.position || 'N/A'
    },
    earnings: {
      basicSalary: payroll.baseSalary,
      allowances: payroll.allowances,
      totalEarnings: payroll.baseSalary + payroll.totalAllowances,
      overtimePay: 0 // Calculate from attendance if needed
    },
    deductions: {
      items: payroll.deductions,
      totalDeductions: payroll.totalDeductions,
      tax: payroll.deductions.find(d => d.type === 'TAX')?.amount || 0,
      pension: payroll.deductions.find(d => d.type === 'PENSION')?.amount || 0
    },
    netSalary: payroll.netSalary,
    generatedBy: userId
  };

  const payslip = new Payslip(payslipData);
  await payslip.save();

  // Generate PDF
  await generatePayslipPdf(payslip._id);

  logger.info(`Payslip generated: ${payslipNumber} for employee ${employee.employeeCode}`);
  return payslip;
};

export const emailPayslip = async (payslipId, emailData = {}) => {
  const payslip = await Payslip.findById(payslipId)
    .populate('employeeId');
  
  if (!payslip) {
    throw new AppError('Payslip not found', 404);
  }

  const recipientEmail = emailData.email || payslip.employeeId.email;
  // Email sending logic would go here
  // For now, just update status

  payslip.status = 'EMAILED';
  payslip.emailedAt = new Date();
  await payslip.save();

  logger.info(`Payslip ${payslip.payslipNumber} emailed to ${recipientEmail}`);
  return payslip;
};

export const markViewed = async (payslipId) => {
  const payslip = await Payslip.findById(payslipId);
  if (!payslip) {
    throw new AppError('Payslip not found', 404);
  }

  payslip.status = 'VIEWED';
  payslip.viewedAt = new Date();
  await payslip.save();

  return payslip;
};

export const getPayslips = async (options = {}) => {
  const { employeeId, status, year, month, page = 1, limit = 20 } = options;
  const filter = {};

  if (employeeId) filter.employeeId = employeeId;
  if (status) filter.status = status;
  if (year && month) {
    filter['period.year'] = year;
    filter['period.month'] = month;
  }

  const skip = (page - 1) * limit;
  const [payslips, total] = await Promise.all([
    Payslip.find(filter)
      .populate('employeeId', 'firstName lastName employeeCode email')
      .populate('generatedBy', 'firstName lastName email')
      .sort({ 'period.year': -1, 'period.month': -1 })
      .skip(skip)
      .limit(limit),
    Payslip.countDocuments(filter)
  ]);

  return {
    data: payslips,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getPayslip = async (payslipId) => {
  const payslip = await Payslip.findById(payslipId)
    .populate('employeeId', 'firstName lastName employeeCode email')
    .populate('payrollId')
    .populate('generatedBy', 'firstName lastName email');
  
  if (!payslip) {
    throw new AppError('Payslip not found', 404);
  }
  return payslip;
};