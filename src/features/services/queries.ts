import { useQuery } from '@tanstack/react-query';
import { servicesApi } from './api';

export const serviceKeys = {
  all:    ['services'] as const,
  detail: (slug: string) => ['services', 'detail', slug] as const,
};

export function useServicesQuery() {
  return useQuery({
    queryKey: serviceKeys.all,
    queryFn: () => servicesApi.getAll(),
    staleTime: 10 * 60 * 1000, // services rarely change
  });
}

export function useServiceQuery(slug: string) {
  return useQuery({
    queryKey: serviceKeys.detail(slug),
    queryFn: () => servicesApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
}
