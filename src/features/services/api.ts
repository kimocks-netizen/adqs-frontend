import { api } from '@/lib/api-client';

export interface Service {
  id: string;
  title: string;
  slug: string;
  summary: string;
  intro: string;
  areas: string[];
  icon: string;
  display_order: number;
  is_active: boolean;
}

export const servicesApi = {
  getAll: () =>
    api.get<{ status: string; data: Service[] }>('/api/services'),

  getBySlug: (slug: string) =>
    api.get<{ status: string; data: Service }>(`/api/services/${slug}`),

  // Admin
  getAllAdmin: () =>
    api.get<{ status: string; data: Service[] }>('/api/admin/services'),

  create: (data: Partial<Service>) =>
    api.post<{ status: string; data: Service }>('/api/admin/services', data),

  update: (id: string, data: Partial<Service>) =>
    api.put<{ status: string; data: Service }>(`/api/admin/services/${id}`, data),

  remove: (id: string) =>
    api.delete<{ status: string }>(`/api/admin/services/${id}`),
};
