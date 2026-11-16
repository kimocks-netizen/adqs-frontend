import { useMutation, useQueryClient } from '@tanstack/react-query';
import { articlesApi } from './api';
import { articleKeys } from './queries';
import type { Article } from '@/types';

function useInvalidateArticles() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: articleKeys.all });
  };
}

export function useCreateArticle() {
  const invalidate = useInvalidateArticles();
  return useMutation({
    mutationFn: (data: Partial<Article>) => articlesApi.create(data),
    onSuccess: invalidate,
  });
}

export function useUpdateArticle(id: string) {
  const invalidate = useInvalidateArticles();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Article>) => articlesApi.update(id, data),
    onSuccess: (result) => {
      invalidate();
      if (result.data?.slug) {
        qc.invalidateQueries({ queryKey: articleKeys.detail(result.data.slug) });
      }
    },
  });
}

export function useDeleteArticle() {
  const invalidate = useInvalidateArticles();
  return useMutation({
    mutationFn: (id: string) => articlesApi.remove(id),
    onSuccess: invalidate,
  });
}

export function useToggleArticleHidden() {
  const invalidate = useInvalidateArticles();
  return useMutation({
    mutationFn: ({ id, hidden }: { id: string; hidden: boolean }) =>
      articlesApi.update(id, { hidden }),
    onSuccess: invalidate,
  });
}
