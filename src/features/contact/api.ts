import { api } from '@/lib/api-client';

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  organisation: string | null;
  area_of_enquiry: string;
  message: string;
  status: 'New' | 'Read' | 'Replied';
  email_verified: boolean;
  created_at: string;
}

export const contactApi = {
  sendOtp: (email: string) =>
    api.post<{ status: string; message: string }>('/api/contact/send-otp', { email }),

  verifyOtp: (email: string, code: string) =>
    api.post<{ status: string; verified: boolean }>('/api/contact/verify-otp', { email, code }),

  submit: (data: {
    name: string;
    email: string;
    phone?: string;
    organisation?: string;
    area_of_enquiry: string;
    message: string;
    email_verified: boolean;
  }) => api.post<{ status: string; message: string }>('/api/contact', data),

  // Admin
  getAll: (params?: { status?: string; search?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.status && params.status !== 'All') q.set('status', params.status);
    if (params?.search) q.set('search', params.search);
    if (params?.page) q.set('page', String(params.page));
    const qs = q.toString();
    return api.get<{ status: string; data: Enquiry[]; count: number }>(`/api/admin/contact${qs ? '?' + qs : ''}`);
  },

  updateStatus: (id: string, status: string) =>
    api.put<{ status: string }>(`/api/admin/contact/${id}/status`, { status }),

  remove: (id: string) =>
    api.delete<{ status: string }>(`/api/admin/contact/${id}`),
};
