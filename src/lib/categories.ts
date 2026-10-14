import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as categoriesApi from '@/lib/api/categories';
import type {
  CreateCategoryRequest,
  CreateSubcategoryRequest,
  EditCategoryRequest,
  EditSubcategoryRequest,
} from '@/types';

export const categoryKeys = {
  all: ['categories'] as const,
  detail: (id: string) => ['categories', id] as const,
  subcategories: (categoryId: string) => ['categories', categoryId, 'subcategories'] as const,
};

export function useCategories() {
  return useQuery({ queryKey: categoryKeys.all, queryFn: categoriesApi.listCategories });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoriesApi.getCategory(id),
    enabled: id.length > 0,
  });
}

export function useSubcategories(categoryId: string) {
  return useQuery({
    queryKey: categoryKeys.subcategories(categoryId),
    queryFn: () => categoriesApi.listSubcategories(categoryId),
    enabled: categoryId.length > 0,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCategoryRequest) => categoriesApi.createCategory(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useEditCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: EditCategoryRequest }) =>
      categoriesApi.editCategory(id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesApi.deleteCategory(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: categoryKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useCreateSubcategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryId, body }: { categoryId: string; body: CreateSubcategoryRequest }) =>
      categoriesApi.createSubcategory(categoryId, body),
    onSuccess: (_data, { categoryId }) => {
      void queryClient.invalidateQueries({ queryKey: categoryKeys.subcategories(categoryId) });
    },
  });
}

export function useEditSubcategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      categoryId,
      subcategoryId,
      body,
    }: {
      categoryId: string;
      subcategoryId: string;
      body: EditSubcategoryRequest;
    }) => categoriesApi.editSubcategory(categoryId, subcategoryId, body),
    onSuccess: (_data, { categoryId }) => {
      void queryClient.invalidateQueries({ queryKey: categoryKeys.subcategories(categoryId) });
    },
  });
}

export function useDeleteSubcategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryId, subcategoryId }: { categoryId: string; subcategoryId: string }) =>
      categoriesApi.deleteSubcategory(categoryId, subcategoryId),
    onSuccess: (_data, { categoryId }) => {
      void queryClient.invalidateQueries({ queryKey: categoryKeys.subcategories(categoryId) });
    },
  });
}
