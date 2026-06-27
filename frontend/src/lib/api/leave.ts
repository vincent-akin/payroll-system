// src/lib/api/leave.ts
import { api } from './client';
import { Leave, PaginatedResponse } from '@/types';

export const leaveService = {
  getLeaves: (params?: any) =>
    api.get<PaginatedResponse<Leave>>('/leaves', { params }),

  getLeave: (id: string) =>
    api.get<Leave>(`/leaves/${id}`),

  createLeave: (data: any) =>
    api.post<Leave>('/leaves', data),

  updateLeave: (id: string, data: any) =>
    api.put<Leave>(`/leaves/${id}`, data),

  approveLeave: (id: string, data?: { approvalNotes?: string }) =>
    api.post<Leave>(`/leaves/${id}/approve`, data),

  rejectLeave: (id: string, data: { rejectionReason: string }) =>
    api.post<Leave>(`/leaves/${id}/reject`, data),

  cancelLeave: (id: string) =>
    api.post<Leave>(`/leaves/${id}/cancel`),

  getEmployeeLeaves: (employeeId: string, params?: any) =>
    api.get<PaginatedResponse<Leave>>(`/leaves/employee/${employeeId}`, { params }),
};