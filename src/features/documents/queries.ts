import { useQuery } from '@tanstack/react-query';
import { documentsApi } from './api';

export const documentKeys = {
  all:      ['documents'] as const,
  folders:  ['documents', 'folders'] as const,
  list:     (folderId?: string) => ['documents', 'list', folderId ?? 'all'] as const,
  detail:   (id: string) => ['documents', 'detail', id] as const,
};

export function useFoldersQuery() {
  return useQuery({
    queryKey: documentKeys.folders,
    queryFn: () => documentsApi.getFolders(),
  });
}

export function useDocumentsQuery(folderId?: string) {
  return useQuery({
    queryKey: documentKeys.list(folderId),
    queryFn: () => documentsApi.getAll(folderId),
  });
}

export function useDocumentQuery(id: string) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: () => documentsApi.getById(id),
    enabled: !!id,
  });
}
