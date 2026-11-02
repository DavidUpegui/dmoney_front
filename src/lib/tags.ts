import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as tagsApi from '@/lib/api/tags';
import type { CreateTagRequest, EditTagRequest } from '@/types';

export const tagKeys = {
  all: ['tags'] as const,
  detail: (id: string) => ['tags', id] as const,
};

export function useTags() {
  return useQuery({ queryKey: tagKeys.all, queryFn: tagsApi.listTags });
}

export function useTag(id: string) {
  return useQuery({
    queryKey: tagKeys.detail(id),
    queryFn: () => tagsApi.getTag(id),
    enabled: id.length > 0,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateTagRequest) => tagsApi.createTag(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
  });
}

export function useEditTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: EditTagRequest }) =>
      tagsApi.editTag(id, body),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: tagKeys.all });
      void queryClient.invalidateQueries({ queryKey: tagKeys.detail(variables.id) });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tagsApi.deleteTag(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: tagKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
  });
}
