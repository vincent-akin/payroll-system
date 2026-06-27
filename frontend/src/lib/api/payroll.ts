// src/lib/api/payroll.ts
import { api } from './client';
import { Payroll, PaginatedResponse } from '@/types';

export const payrollService = {
  getPayrolls: (params?: any) =>
    api.get<PaginatedResponse<Payroll>>('/payrolls', { params }),

  getPayroll: (id: string) =>
    api.get<Payroll>(`/payrolls/${id}`),

  generatePayroll: (data: any) =>
    api.post<Payroll>('/payrolls/generate', data),

  submitPayroll: (id: string) =>
    api.post<Payroll>(`/payrolls/${id}/submit`),

  reviewPayroll: (id: string) =>
    api.post<Payroll>(`/payrolls/${id}/review`),

  approvePayroll: (id: string) =>
    api.post<Payroll>(`/payrolls/${id}/approve`),

  processPayroll: (id: string) =>
    api.post<Payroll>(`/payrolls/${id}/process`),

  markPayrollPaid: (id: string) =>
    api.post<Payroll>(`/payrolls/${id}/paid`),
};