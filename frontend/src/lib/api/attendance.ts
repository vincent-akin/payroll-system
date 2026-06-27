// src/lib/api/attendance.ts
import { api } from './client';
import { Attendance, PaginatedResponse } from '@/types';

export const attendanceService = {
  getAttendances: (params?: any) =>
    api.get<PaginatedResponse<Attendance>>('/attendance', { params }),

  getAttendance: (id: string) =>
    api.get<Attendance>(`/attendance/${id}`),

  createAttendance: (data: any) =>
    api.post<Attendance>('/attendance', data),

  updateAttendance: (id: string, data: any) =>
    api.put<Attendance>(`/attendance/${id}`, data),

  submitAttendance: (id: string) =>
    api.post<Attendance>(`/attendance/${id}/submit`),

  approveAttendance: (id: string) =>
    api.post<Attendance>(`/attendance/${id}/approve`),

  lockAttendance: (id: string) =>
    api.post<Attendance>(`/attendance/${id}/lock`),

  getEmployeeAttendances: (employeeId: string, params?: any) =>
    api.get<PaginatedResponse<Attendance>>(`/attendance/employee/${employeeId}`, { params }),
};