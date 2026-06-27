// src/lib/api/department.ts
import { api } from './client';
import { Department } from '@/types';

export const departmentService = {
  getDepartments: (params?: any) =>
    api.get<Department[]>('/departments', { params }),
  
  getDepartment: (id: string) =>
    api.get<Department>(`/departments/${id}`),
  
  createDepartment: (data: Partial<Department>) =>
    api.post<Department>('/departments', data),
  
  updateDepartment: (id: string, data: Partial<Department>) =>
    api.put<Department>(`/departments/${id}`, data),
  
  deleteDepartment: (id: string) =>
    api.delete(`/departments/${id}`),
};