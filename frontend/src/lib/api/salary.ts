// src/lib/api/salary.ts
import { api } from './client';
import { SalaryStructure, PaginatedResponse } from '@/types';

export const salaryService = {
  getSalaryStructures: (params?: any) =>
    api.get<PaginatedResponse<SalaryStructure>>('/salary-structures', { params }),

  getSalaryStructure: (id: string) =>
    api.get<SalaryStructure>(`/salary-structures/${id}`),

  createSalaryStructure: (data: any) =>
    api.post<SalaryStructure>('/salary-structures', data),

  updateSalaryStructure: (id: string, data: any) =>
    api.put<SalaryStructure>(`/salary-structures/${id}`, data),

  submitSalaryStructure: (id: string) =>
    api.post<SalaryStructure>(`/salary-structures/${id}/submit`),

  approveSalaryStructure: (id: string) =>
    api.post<SalaryStructure>(`/salary-structures/${id}/approve`),

  getCurrentSalaryStructure: (employeeId: string) =>
    api.get<SalaryStructure>(`/salary-structures/employee/${employeeId}/current`),

  getSalaryHistory: (employeeId: string, params?: any) =>
    api.get<PaginatedResponse<SalaryStructure>>(`/salary-structures/employee/${employeeId}/history`, { params }),
};