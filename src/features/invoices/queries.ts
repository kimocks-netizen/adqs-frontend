import { useQuery } from '@tanstack/react-query';
import { invoicesApi } from './api';

export const invoiceKeys = {
  all:    ['invoices'] as const,
  list:   (page: number, limit: number, type: string, status: string, search: string) =>
    ['invoices', 'list', page, limit, type, status, search] as const,
  detail: (id: string) => ['invoices', 'detail', id] as const,
};

export function useInvoicesQuery(params: { page?: number; limit?: number; type?: string; status?: string; search?: string } = {}) {
  const { page = 1, limit = 10, type = '', status = '', search = '' } = params;
  return useQuery({
    queryKey: invoiceKeys.list(page, limit, type, status, search),
    queryFn:  () => invoicesApi.getAll({ page, limit, type, status, search }),
    staleTime: 0,
  });
}

export function useInvoiceQuery(id: string) {
  return useQuery({
    queryKey: invoiceKeys.detail(id),
    queryFn:  () => invoicesApi.getById(id),
    enabled:  !!id,
  });
}
