import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoicesApi, type InvoicePayload } from './api';
import { invoiceKeys } from './queries';
import { toast } from 'sonner';

export function useCreateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: InvoicePayload) => invoicesApi.create(payload),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: invoiceKeys.all });
      toast.success(`${res.data.document_type === 'quote' ? 'Quote' : 'Invoice'} created!`);
    },
    onError: () => toast.error('Failed to create document'),
  });
}

export function useUpdateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<InvoicePayload> & { status?: string } }) =>
      invoicesApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: invoiceKeys.all });
      qc.invalidateQueries({ queryKey: invoiceKeys.detail(id) });
      toast.success('Updated!');
    },
    onError: () => toast.error('Failed to update'),
  });
}

export function useConvertDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newType }: { id: string; newType: 'invoice' | 'quote' }) =>
      invoicesApi.convert(id, newType),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: invoiceKeys.all });
      toast.success(`Converted to ${res.data.document_type}!`);
    },
    onError: () => toast.error('Conversion failed'),
  });
}

export function useDeleteInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => invoicesApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: invoiceKeys.all });
      toast.success('Deleted!');
    },
    onError: () => toast.error('Failed to delete'),
  });
}
