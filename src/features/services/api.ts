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
};
