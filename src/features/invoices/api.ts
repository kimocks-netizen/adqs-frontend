import { api } from '@/lib/api-client';
import type { Invoice } from '@/types';

export interface InvoicePayload {
  document_type?: 'invoice' | 'quote';
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  matter_reference?: string;
  invoice_date: string;
  due_date?: string;
  notes?: string;
  items: { description: string; amount: number }[];
}

const qs = (params: Record<string, string | number | undefined>) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') q.set(k, String(v)); });
  const s = q.toString();
  return s ? '?' + s : '';
};

export const invoicesApi = {
  getAll: (params: { page?: number; limit?: number; type?: string; status?: string; search?: string } = {}) =>
    api.get<{ data: Invoice[]; total: number; page: number; limit: number }>(
      '/api/admin/invoices' + qs({ page: params.page ?? 1, limit: params.limit ?? 10, type: params.type, status: params.status, search: params.search })
    ),

  getById: (id: string) =>
    api.get<{ data: Invoice }>('/api/admin/invoices/' + id),

  create: (payload: InvoicePayload) =>
    api.post<{ data: Invoice }>('/api/admin/invoices', payload),

  update: (id: string, payload: Partial<InvoicePayload> & { status?: string }) =>
    api.put<{ data: Invoice }>('/api/admin/invoices/' + id, payload),

  convert: (id: string, newType: 'invoice' | 'quote') =>
    api.post<{ data: Invoice }>(`/api/admin/invoices/${id}/convert`, { newType }),

  remove: (id: string) =>
    api.delete('/api/admin/invoices/' + id),
};
