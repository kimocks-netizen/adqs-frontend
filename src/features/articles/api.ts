import { api } from '@/lib/api-client';
import type { Article } from '@/types';

export interface ArticleListItem {
  id: string;
  title: string;
  slug: string;
  introduction: string;
  featured_image_url: string;
  category: string;
  author: string;
  published_at: string;
}

export interface ArticleListResponse {
  status: string;
  data: ArticleListItem[];
  count: number;
}

export interface ArticleResponse {
  status: string;
  data: Article;
}

export interface AdminArticleListResponse {
  status: string;
  data: Article[];
  count: number;
}

export const articlesApi = {
  // Public
  getPublished: (params?: { category?: string; search?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.category && params.category !== 'All') q.set('category', params.category);
    if (params?.search) q.set('search', params.search);
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    const qs = q.toString();
    return api.get<ArticleListResponse>(`/api/articles${qs ? '?' + qs : ''}`);
  },

  getBySlug: (slug: string) =>
    api.get<ArticleResponse>(`/api/articles/${slug}`),

  // Admin
  getAll: (params?: { search?: string; status?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.search) q.set('search', params.search);
    if (params?.status && params.status !== 'all') q.set('status', params.status);
    if (params?.page) q.set('page', String(params.page));
    const qs = q.toString();
    return api.get<AdminArticleListResponse>(`/api/admin/articles${qs ? '?' + qs : ''}`);
  },

  create: (data: Partial<Article>) =>
    api.post<ArticleResponse>('/api/admin/articles', data),

  update: (id: string, data: Partial<Article>) =>
    api.put<ArticleResponse>(`/api/admin/articles/${id}`, data),

  remove: (id: string) =>
    api.delete<{ status: string }>(`/api/admin/articles/${id}`),
};
