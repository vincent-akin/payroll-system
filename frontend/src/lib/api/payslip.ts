// src/lib/api/payslip.ts
import { api } from './client';
import { Payslip, PaginatedResponse } from '@/types';

export const payslipService = {
  getPayslips: (params?: any) =>
    api.get<PaginatedResponse<Payslip>>('/payslips', { params }),

  getPayslip: (id: string) =>
    api.get<Payslip>(`/payslips/${id}`),

  generatePayslip: (payrollId: string, employeeId: string) =>
    api.post<Payslip>('/payslips/generate', { payrollId, employeeId }),

  generatePayslipPdf: (id: string) =>
    api.get<{ pdfUrl: string }>(`/payslips/${id}/pdf`),

  emailPayslip: (id: string) =>
    api.post<Payslip>(`/payslips/${id}/email`),

  markViewed: (id: string) =>
    api.post<Payslip>(`/payslips/${id}/view`),

  getEmployeePayslips: (employeeId: string, params?: any) =>
    api.get<PaginatedResponse<Payslip>>(`/payslips/employee/${employeeId}`, { params }),
};