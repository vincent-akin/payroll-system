// backend/src/modules/payroll/payroll.service.js
import { Payroll } from './payroll.model.js';
import AppError from '../../shared/errors/AppError.js';
import logger from '../../shared/utils/logger.js';
import { getCurrentSalaryStructure } from '../salary-structures/salaryStructure.service.js';
import { getActiveDeductions as getEmployeeDeductions } from '../deductions/deduction.service.js';
import { getEmployeeAttendance } from '../attendance/attendance.service.js';
import { getLeaves } from '../leave/leave.service.js';

const calculatePayroll = async (employeeId, period) => {
  // Get current salary structure
  const salaryStructure = await getCurrentSalaryStructure(employeeId);
  if (!salaryStructure) {
    throw new AppError('No active salary structure found for employee', 400);
  }

  // Get active deductions
  const deductions = await getEmployeeDeductions(employeeId);
  
  // Get attendance for the period
  const attendanceRecords = await getEmployeeAttendance(employeeId, {
    year: period.year,
    month: period.month
  });
  
  // Get leave records for the period
  const leaveRecords = await getLeaves(employeeId, {
    year: period.year,
    month: period.month
  });

  // Calculate basic salary (prorated based on worked days)
  const daysInMonth = new Date(period.year, period.month, 0).getDate();
  const workedDays = attendanceRecords.filter(a => a.status === 'PRESENT').length;
  const baseSalary = (salaryStructure.grossSalary / daysInMonth) * workedDays;

  // Calculate allowances
  const allowances = salaryStructure.allowances || {};
  const totalAllowances = Object.values(allowances).reduce((sum, val) => sum + val, 0);

  // Calculate deductions
  const deductionItems = deductions.map(d => ({
    deductionId: d._id,
    type: d.type,
    amount: d.amount,
    description: d.description
  }));
  const totalDeductions = deductionItems.reduce((sum, d) => sum + d.amount, 0);

  // Calculate leave impacts
  const leaveDays = {
    taken: leaveRecords.length,
    paid: leaveRecords.filter(l => l.leaveType === 'ANNUAL').length,
    unpaid: leaveRecords.filter(l => l.leaveType === 'UNPAID').length
  };

  // Attendance summary
  const attendance = {
    workedDays,
    absentDays: attendanceRecords.filter(a => a.status === 'ABSENT').length,
    overtimeHours: attendanceRecords.reduce((sum, a) => sum + (a.overtimeHours || 0), 0),
    lateMinutes: attendanceRecords.reduce((sum, a) => sum + (a.lateMinutes || 0), 0)
  };

  return {
    salaryStructureId: salaryStructure._id,
    baseSalary,
    allowances,
    totalAllowances,
    deductions: deductionItems,
    totalDeductions,
    attendance,
    leaveDays,
    netSalary: baseSalary + totalAllowances - totalDeductions
  };
};

export const generatePayroll = async (data, userId) => {
  const { employeeId, period, notes } = data;
  
  // Check if payroll already exists for this period
  const existing = await Payroll.findOne({
    employeeId,
    'period.year': period.year,
    'period.month': period.month
  });

  if (existing) {
    throw new AppError('Payroll already exists for this period', 400);
  }

  const payrollData = await calculatePayroll(employeeId, period);
  
  const payroll = new Payroll({
    employeeId,
    organizationId: (await import('../employees/employee.service.js')).getEmployee(employeeId).organizationId,
    period,
    ...payrollData,
    notes,
    status: 'DRAFT'
  });

  await payroll.save();
  logger.info(`Payroll generated for employee ${employeeId} for ${period.month}/${period.year}`);
  return payroll;
};

export const submitPayroll = async (payrollId, userId) => {
  const payroll = await Payroll.findById(payrollId);
  if (!payroll) {
    throw new AppError('Payroll not found', 404);
  }

  if (payroll.status !== 'DRAFT') {
    throw new AppError('Only DRAFT payroll can be submitted', 400);
  }

  payroll.status = 'SUBMITTED';
  payroll.submittedBy = userId;
  payroll.submittedAt = new Date();
  await payroll.save();

  logger.info(`Payroll ${payrollId} submitted`);
  return payroll;
};

export const reviewPayroll = async (payrollId, userId) => {
  const payroll = await Payroll.findById(payrollId);
  if (!payroll) {
    throw new AppError('Payroll not found', 404);
  }

  if (payroll.status !== 'SUBMITTED') {
    throw new AppError('Only SUBMITTED payroll can be reviewed', 400);
  }

  payroll.status = 'UNDER_REVIEW';
  payroll.reviewedBy = userId;
  payroll.reviewedAt = new Date();
  await payroll.save();

  logger.info(`Payroll ${payrollId} under review`);
  return payroll;
};

export const approvePayroll = async (payrollId, userId) => {
  const payroll = await Payroll.findById(payrollId);
  if (!payroll) {
    throw new AppError('Payroll not found', 404);
  }

  if (payroll.status !== 'UNDER_REVIEW') {
    throw new AppError('Only UNDER_REVIEW payroll can be approved', 400);
  }

  payroll.status = 'APPROVED';
  payroll.approvedBy = userId;
  payroll.approvedAt = new Date();
  await payroll.save();

  logger.info(`Payroll ${payrollId} approved`);
  return payroll;
};

export const processPayroll = async (payrollId, userId) => {
  const payroll = await Payroll.findById(payrollId);
  if (!payroll) {
    throw new AppError('Payroll not found', 404);
  }

  if (payroll.status !== 'APPROVED') {
    throw new AppError('Only APPROVED payroll can be processed', 400);
  }

  payroll.status = 'PROCESSED';
  payroll.processedBy = userId;
  payroll.processedAt = new Date();
  await payroll.save();

  logger.info(`Payroll ${payrollId} processed`);
  return payroll;
};

export const markPayrollPaid = async (payrollId, userId, paymentReference) => {
  const payroll = await Payroll.findById(payrollId);
  if (!payroll) {
    throw new AppError('Payroll not found', 404);
  }

  if (payroll.status !== 'PROCESSED') {
    throw new AppError('Only PROCESSED payroll can be marked as paid', 400);
  }

  payroll.status = 'PAID';
  payroll.paymentReference = paymentReference;
  payroll.paidAt = new Date();
  await payroll.save();

  logger.info(`Payroll ${payrollId} marked as paid with reference ${paymentReference}`);
  return payroll;
};

export const getPayrolls = async (options = {}) => {
  const { employeeId, status, year, month, page = 1, limit = 20 } = options;
  const filter = {};

  if (employeeId) filter.employeeId = employeeId;
  if (status) filter.status = status;
  if (year && month) {
    filter['period.year'] = year;
    filter['period.month'] = month;
  }

  const skip = (page - 1) * limit;
  const [payrolls, total] = await Promise.all([
    Payroll.find(filter)
      .populate('employeeId', 'firstName lastName employeeCode')
      .populate('submittedBy', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName email')
      .populate('approvedBy', 'firstName lastName email')
      .populate('processedBy', 'firstName lastName email')
      .sort({ 'period.year': -1, 'period.month': -1 })
      .skip(skip)
      .limit(limit),
    Payroll.countDocuments(filter)
  ]);

  return {
    data: payrolls,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getPayroll = async (payrollId) => {
  const payroll = await Payroll.findById(payrollId)
    .populate('employeeId', 'firstName lastName employeeCode')
    .populate('salaryStructureId')
    .populate('submittedBy', 'firstName lastName email')
    .populate('reviewedBy', 'firstName lastName email')
    .populate('approvedBy', 'firstName lastName email')
    .populate('processedBy', 'firstName lastName email');
  
  if (!payroll) {
    throw new AppError('Payroll not found', 404);
  }
  return payroll;
};