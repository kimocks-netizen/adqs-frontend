import { useQuery } from '@tanstack/react-query';
import { documentsApi } from './api';

export const documentKeys = {
  all:      ['documents'] as const,
  folders:  ['documents', 'folders'] as const,
  list:     (folderId?: string, page?: number, limit?: number) => ['documents', 'list', folderId ?? 'all', page ?? 1, limit ?? 10] as const,
  detail:   (id: string) => ['documents', 'detail', id] as const,
};

export function useFoldersQuery() {
  return useQuery({
    queryKey: documentKeys.folders,
    queryFn: () => documentsApi.getFolders(),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useDocumentsQuery(folderId?: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: documentKeys.list(folderId, page, limit),
    queryFn: () => documentsApi.getAll(folderId, page, limit),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useDocumentQuery(id: string) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: () => documentsApi.getById(id),
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
