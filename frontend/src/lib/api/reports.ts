// src/lib/api/reports.ts
import { api } from './client';

export const reportsService = {
  getPayrollSummaryReport: () =>
    api.get('/reports/payroll-summary'),

  getDepartmentPayrollReport: () =>
    api.get('/reports/department-payroll'),

  getAttendanceReport: () =>
    api.get('/reports/attendance'),

  getLeaveReport: () =>
    api.get('/reports/leave'),

  getEmployeeCostReport: () =>
    api.get('/reports/employee-cost'),
};