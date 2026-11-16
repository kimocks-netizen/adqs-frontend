import { useQuery } from '@tanstack/react-query';
import { articlesApi } from './api';

export const articleKeys = {
  all:       ['articles'] as const,
  published: (category?: string, search?: string, page?: number, limit?: number) =>
    ['articles', 'published', category ?? 'All', search ?? '', page ?? 1, limit ?? 12] as const,
  detail:    (slug: string) => ['articles', 'detail', slug] as const,
  admin:     (search?: string, status?: string, page?: number) =>
    ['articles', 'admin', search ?? '', status ?? 'all', page ?? 1] as const,
};

export function useArticlesQuery(params?: { category?: string; search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: articleKeys.published(params?.category, params?.search, params?.page, params?.limit),
    queryFn: () => articlesApi.getPublished(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useArticleQuery(slug: string) {
  return useQuery({
    queryKey: articleKeys.detail(slug),
    queryFn: () => articlesApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useAdminArticlesQuery(params?: { search?: string; status?: string; page?: number }) {
  return useQuery({
    queryKey: articleKeys.admin(params?.search, params?.status, params?.page),
    queryFn: () => articlesApi.getAll(params),
    staleTime: 0,
  });
}
