import { api } from '@/lib/api-client';

export interface DocFolder {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
}

export interface Document {
  id: string;
  folder_id: string;
  title: string;
  type: string;
  body: string;
  status: 'Draft' | 'Final';
  watermark: boolean;
  document_date: string;
  created_at: string;
  updated_at: string;
}

export const documentsApi = {
  getFolders: () =>
    api.get<{ data: DocFolder[] }>('/api/admin/document-folders'),

  createFolder: (name: string, parent_id: string | null = null) =>
    api.post<{ data: DocFolder }>('/api/admin/document-folders', { name, parent_id }),

  deleteFolder: (id: string) =>
    api.delete('/api/admin/document-folders/' + id),

  getAll: (folder_id?: string, page = 1, limit = 10) =>
    api.get<{ data: Document[]; count: number }>('/api/admin/documents' + (() => {
      const q = new URLSearchParams();
      if (folder_id) q.set('folder_id', folder_id);
      q.set('page', String(page));
      q.set('limit', String(limit));
      return '?' + q.toString();
    })()),

  getById: (id: string) =>
    api.get<{ data: Document }>('/api/admin/documents/' + id),

  create: (payload: Omit<Document, 'id' | 'created_at' | 'updated_at'>) =>
    api.post<{ data: Document }>('/api/admin/documents', payload),

  update: (id: string, payload: Partial<Omit<Document, 'id' | 'created_at'>>) =>
    api.put<{ data: Document }>('/api/admin/documents/' + id, payload),

  remove: (id: string) =>
    api.delete('/api/admin/documents/' + id),
};
