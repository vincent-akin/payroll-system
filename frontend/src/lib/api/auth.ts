// src/lib/api/auth.ts
import { api } from './client';
import { User } from '@/types';

export const authService = {
  login: (email: string, password: string) =>
    api.post<{ user: User; accessToken: string; refreshToken: string }>('/auth/login', {
      email,
      password,
    }),

  refresh: (refreshToken: string) =>
    api.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      refreshToken,
    }),

  logout: () => api.post('/auth/logout'),

  getMe: () => api.get<User>('/auth/me'),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.patch('/auth/change-password', { currentPassword, newPassword }),
};