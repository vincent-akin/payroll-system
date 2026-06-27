// src/lib/api/employee.ts
import { api } from './client';
import { Employee, PaginatedResponse } from '@/types';

export const employeeService = {
  getEmployees: (params?: any) =>
    api.get<PaginatedResponse<Employee>>('/employees', { params }),

  getEmployee: (id: string) =>
    api.get<Employee>(`/employees/${id}`),

  createEmployee: (data: any) =>
    api.post<Employee>('/employees', data),

  updateEmployee: (id: string, data: any) =>
    api.put<Employee>(`/employees/${id}`, data),

  deleteEmployee: (id: string) =>
    api.delete(`/employees/${id}`),

  getEmployeeByUser: (userId: string) =>
    api.get<Employee>(`/employees/user/${userId}`),
};