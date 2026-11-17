import { useQuery } from '@tanstack/react-query';
import { invoicesApi } from './api';

export const invoiceKeys = {
  all:    ['invoices'] as const,
  list:   (params: object) => ['invoices', 'list', params] as const,
  detail: (id: string)     => ['invoices', 'detail', id]   as const,
};

export function useInvoicesQuery(params: { page?: number; type?: string; status?: string; search?: string } = {}) {
  return useQuery({
    queryKey: invoiceKeys.list(params),
    queryFn:  () => invoicesApi.getAll(params),
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
