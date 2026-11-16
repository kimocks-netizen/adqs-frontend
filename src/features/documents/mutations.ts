import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from './api';
import { documentKeys } from './queries';
import type { Document } from './api';

export function useCreateFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, parent_id }: { name: string; parent_id?: string | null }) =>
      documentsApi.createFolder(name, parent_id),
    onSuccess: () => qc.invalidateQueries({ queryKey: documentKeys.folders }),
  });
}

export function useDeleteFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentsApi.deleteFolder(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: documentKeys.folders }),
  });
}

export function useCreateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Document, 'id' | 'created_at' | 'updated_at'>) =>
      documentsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: documentKeys.all }),
  });
}

export function useUpdateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<Document> & { id: string }) =>
      documentsApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: documentKeys.all }),
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: documentKeys.all }),
  });
}
