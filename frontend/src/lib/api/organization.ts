// src/lib/api/organization.ts
import { api } from './client';
import { Organization } from '@/types';

export const organizationService = {
  getOrganizations: (params?: any) =>
    api.get<Organization[]>('/organizations', { params }),
  
  getOrganization: (id: string) =>
    api.get<Organization>(`/organizations/${id}`),
  
  createOrganization: (data: Partial<Organization>) =>
    api.post<Organization>('/organizations', data),
  
  updateOrganization: (id: string, data: Partial<Organization>) =>
    api.put<Organization>(`/organizations/${id}`, data),
  
  deleteOrganization: (id: string) =>
    api.delete(`/organizations/${id}`),
};