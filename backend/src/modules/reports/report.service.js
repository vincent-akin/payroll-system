// backend/src/modules/reports/report.service.js
import { Payroll } from '../payroll/payroll.model.js';
import Employee from '../employees/employee.model.js';
import Attendance from '../attendance/attendance.model.js';
import Leave from '../leave/leave.model.js';
import Department from '../departments/department.model.js';
import AppError from '../../shared/errors/AppError.js';
import logger from '../../shared/utils/logger.js';

export const getPayrollSummaryReport = async (organizationId, period) => {
  const { year, month } = period;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const payrolls = await Payroll.find({
    organizationId,
    'period.year': year,
    'period.month': month,
    status: { $in: ['PROCESSED', 'PAID'] }
  }).populate('employeeId', 'firstName lastName employeeCode');

  if (!payrolls.length) {
    return {
      period: { year, month },
      summary: {
        totalEmployees: 0,
        totalGrossSalary: 0,
        totalDeductions: 0,
        totalNetSalary: 0,
        averageSalary: 0
      },
      details: []
    };
  }

  const totals = payrolls.reduce((acc, p) => {
    acc.totalGrossSalary += p.baseSalary + p.totalAllowances;
    acc.totalDeductions += p.totalDeductions;
    acc.totalNetSalary += p.netSalary;
    return acc;
  }, { totalGrossSalary: 0, totalDeductions: 0, totalNetSalary: 0 });

  return {
    period: { year, month },
    summary: {
      totalEmployees: payrolls.length,
      totalGrossSalary: totals.totalGrossSalary,
      totalDeductions: totals.totalDeductions,
      totalNetSalary: totals.totalNetSalary,
      averageSalary: totals.totalNetSalary / payrolls.length
    },
    details: payrolls.map(p => ({
      employeeId: p.employeeId._id,
      employeeName: `${p.employeeId.firstName} ${p.employeeId.lastName}`,
      employeeCode: p.employeeId.employeeCode,
      grossSalary: p.baseSalary + p.totalAllowances,
      totalDeductions: p.totalDeductions,
      netSalary: p.netSalary
    }))
  };
};

export const getDepartmentPayrollReport = async (organizationId, period) => {
  const { year, month } = period;

  const departments = await Department.find({ organizationId });
  const report = [];

  for (const dept of departments) {
    const employees = await Employee.find({ 
      organizationId, 
      departmentId: dept._id 
    }).select('_id');

    const employeeIds = employees.map(e => e._id);

    const payrolls = await Payroll.find({
      employeeId: { $in: employeeIds },
      'period.year': year,
      'period.month': month,
      status: { $in: ['PROCESSED', 'PAID'] }
    });

    if (payrolls.length) {
      const totals = payrolls.reduce((acc, p) => {
        acc.totalNetSalary += p.netSalary;
        acc.totalGrossSalary += p.baseSalary + p.totalAllowances;
        acc.totalDeductions += p.totalDeductions;
        return acc;
      }, { totalNetSalary: 0, totalGrossSalary: 0, totalDeductions: 0 });

      report.push({
        departmentId: dept._id,
        departmentName: dept.name,
        employeeCount: employeeIds.length,
        processedCount: payrolls.length,
        totalNetSalary: totals.totalNetSalary,
        totalGrossSalary: totals.totalGrossSalary,
        totalDeductions: totals.totalDeductions,
        averageSalary: totals.totalNetSalary / payrolls.length
      });
    }
  }

  return {
    period: { year, month },
    departments: report,
    summary: {
      totalDepartments: report.length,
      totalEmployees: report.reduce((sum, r) => sum + r.employeeCount, 0),
      totalProcessed: report.reduce((sum, r) => sum + r.processedCount, 0),
      totalNetSalary: report.reduce((sum, r) => sum + r.totalNetSalary, 0)
    }
  };
};

export const getAttendanceReport = async (organizationId, period) => {
  const { year, month } = period;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const employees = await Employee.find({ organizationId })
    .populate('departmentId', 'name');

  const report = [];

  for (const employee of employees) {
    const attendance = await Attendance.find({
      employeeId: employee._id,
      attendanceDate: { $gte: startDate, $lte: endDate }
    });

    const summary = attendance.reduce((acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      acc.totalWorkedHours += a.workedHours || 0;
      acc.totalOvertimeHours += a.overtimeHours || 0;
      acc.totalLateMinutes += a.lateMinutes || 0;
      return acc;
    }, {
      PRESENT: 0,
      ABSENT: 0,
      LATE: 0,
      HALF_DAY: 0,
      LEAVE: 0,
      HOLIDAY: 0,
      totalWorkedHours: 0,
      totalOvertimeHours: 0,
      totalLateMinutes: 0
    });

    report.push({
      employeeId: employee._id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      employeeCode: employee.employeeCode,
      department: employee.departmentId?.name || 'N/A',
      attendance: summary,
      totalDays: attendance.length
    });
  }

  return {
    period: { year, month },
    report,
    summary: {
      totalEmployees: report.length,
      totalPresent: report.reduce((sum, r) => sum + r.attendance.PRESENT, 0),
      totalAbsent: report.reduce((sum, r) => sum + r.attendance.ABSENT, 0),
      totalLate: report.reduce((sum, r) => sum + r.attendance.LATE, 0),
      totalWorkedHours: report.reduce((sum, r) => sum + r.attendance.totalWorkedHours, 0),
      totalOvertimeHours: report.reduce((sum, r) => sum + r.attendance.totalOvertimeHours, 0)
    }
  };
};

export const getLeaveReport = async (organizationId, period) => {
  const { year, month } = period;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const employees = await Employee.find({ organizationId })
    .populate('departmentId', 'name');

  const report = [];

  for (const employee of employees) {
    const leaves = await Leave.find({
      employeeId: employee._id,
      $or: [
        { startDate: { $gte: startDate, $lte: endDate } },
        { endDate: { $gte: startDate, $lte: endDate } }
      ]
    });

    const summary = leaves.reduce((acc, l) => {
      acc[l.leaveType] = (acc[l.leaveType] || 0) + l.totalDays;
      acc[l.status] = (acc[l.status] || 0) + 1;
      return acc;
    }, {
      totalLeaves: leaves.length,
      totalDays: 0,
      ANNUAL: 0,
      SICK: 0,
      UNPAID: 0,
      OTHER: 0,
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0
    });

    summary.totalDays = leaves.reduce((sum, l) => sum + l.totalDays, 0);

    report.push({
      employeeId: employee._id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      employeeCode: employee.employeeCode,
      department: employee.departmentId?.name || 'N/A',
      leaves: summary
    });
  }

  return {
    period: { year, month },
    report,
    summary: {
      totalEmployees: report.length,
      totalLeaves: report.reduce((sum, r) => sum + r.leaves.totalLeaves, 0),
      totalDays: report.reduce((sum, r) => sum + r.leaves.totalDays, 0),
      approvedLeaves: report.reduce((sum, r) => sum + r.leaves.APPROVED, 0),
      pendingLeaves: report.reduce((sum, r) => sum + r.leaves.PENDING, 0)
    }
  };
};

export const getEmployeeCostReport = async (organizationId, period) => {
  const { year, month } = period;

  const employees = await Employee.find({ organizationId })
    .populate('departmentId', 'name');

  const report = [];

  for (const employee of employees) {
    const payrolls = await Payroll.find({
      employeeId: employee._id,
      'period.year': year,
      'period.month': month,
      status: { $in: ['PROCESSED', 'PAID'] }
    });

    if (payrolls.length) {
      const payroll = payrolls[0];
      report.push({
        employeeId: employee._id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        employeeCode: employee.employeeCode,
        department: employee.departmentId?.name || 'N/A',
        costBreakdown: {
          baseSalary: payroll.baseSalary,
          allowances: payroll.totalAllowances,
          deductions: payroll.totalDeductions,
          netSalary: payroll.netSalary,
          employerCost: payroll.baseSalary + payroll.totalAllowances // Simplified
        },
        period: { year, month }
      });
    }
  }

  return {
    period: { year, month },
    report,
    summary: {
      totalEmployees: report.length,
      totalCost: report.reduce((sum, r) => sum + r.costBreakdown.employerCost, 0),
      totalNetSalary: report.reduce((sum, r) => sum + r.costBreakdown.netSalary, 0),
      totalDeductions: report.reduce((sum, r) => sum + r.costBreakdown.deductions, 0)
    }
  };
};