import { api } from '@/lib/api-client';

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
};
