import type {
  Category,
  CreateCategoryRequest,
  CreateSubcategoryRequest,
  EditCategoryRequest,
  EditSubcategoryRequest,
  Subcategory,
} from '@/types';

import { api } from './client';

export function listCategories(): Promise<Category[]> {
  return api.get<Category[]>('/api/categories');
}

export function getCategory(id: string): Promise<Category> {
  return api.get<Category>(`/api/categories/${id}`);
}

export function createCategory(body: CreateCategoryRequest): Promise<Category> {
  return api.post<Category>('/api/categories', body);
}

export function editCategory(id: string, body: EditCategoryRequest): Promise<Category> {
  return api.patch<Category>(`/api/categories/${id}`, body);
}

export function deleteCategory(id: string): Promise<void> {
  return api.delete<void>(`/api/categories/${id}`);
}

export function listSubcategories(categoryId: string): Promise<Subcategory[]> {
  return api.get<Subcategory[]>(`/api/categories/${categoryId}/subcategories`);
}

export function createSubcategory(
  categoryId: string,
  body: CreateSubcategoryRequest,
): Promise<Subcategory> {
  return api.post<Subcategory>(`/api/categories/${categoryId}/subcategories`, body);
}

export function editSubcategory(
  categoryId: string,
  subcategoryId: string,
  body: EditSubcategoryRequest,
): Promise<Subcategory> {
  return api.patch<Subcategory>(
    `/api/categories/${categoryId}/subcategories/${subcategoryId}`,
    body,
  );
}

export function deleteSubcategory(categoryId: string, subcategoryId: string): Promise<void> {
  return api.delete<void>(`/api/categories/${categoryId}/subcategories/${subcategoryId}`);
}
