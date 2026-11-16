import { useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesApi } from './api';
import { serviceKeys } from './queries';
import type { Service } from './api';

function useInvalidateServices() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: serviceKeys.all });
}

export function useCreateService() {
  const invalidate = useInvalidateServices();
  return useMutation({
    mutationFn: (data: Partial<Service>) => servicesApi.create(data),
    onSuccess: invalidate,
  });
}

export function useUpdateService(id: string) {
  const invalidate = useInvalidateServices();
  return useMutation({
    mutationFn: (data: Partial<Service>) => servicesApi.update(id, data),
    onSuccess: invalidate,
  });
}

export function useDeleteService() {
  const invalidate = useInvalidateServices();
  return useMutation({
    mutationFn: (id: string) => servicesApi.remove(id),
    onSuccess: invalidate,
  });
}
