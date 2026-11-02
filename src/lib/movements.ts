import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as movementsApi from '@/lib/api/movements';
import type { CreateMovementRequest, EditMovementRequest, MovementFilters } from '@/types';

export const movementKeys = {
  all: ['movements'] as const,
  list: (filters: MovementFilters) => ['movements', filters] as const,
  detail: (id: string) => ['movements', id] as const,
};

export function useMovements(filters: MovementFilters = {}) {
  return useQuery({
    queryKey: movementKeys.list(filters),
    queryFn: () => movementsApi.listMovements(filters),
  });
}

export function useMovement(id: string) {
  return useQuery({
    queryKey: movementKeys.detail(id),
    queryFn: () => movementsApi.getMovement(id),
    enabled: id.length > 0,
  });
}

export function useCreateMovement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateMovementRequest) => movementsApi.createMovement(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: movementKeys.all });
    },
  });
}

export function useEditMovement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: EditMovementRequest }) =>
      movementsApi.editMovement(id, body),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: movementKeys.all });
      void queryClient.invalidateQueries({ queryKey: movementKeys.detail(id) });
    },
  });
}

export function useDeleteMovement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => movementsApi.deleteMovement(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: movementKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: movementKeys.all });
    },
  });
}
