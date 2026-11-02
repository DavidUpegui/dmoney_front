import type { CreateMovementRequest, EditMovementRequest, Movement, MovementFilters } from '@/types';

import { api } from './client';

function toQueryString(filters: MovementFilters): string {
  const params = new URLSearchParams();
  filters.categoryIds?.forEach((id) => params.append('categoryIds', id));
  filters.subcategoryIds?.forEach((id) => params.append('subcategoryIds', id));
  filters.tagIds?.forEach((id) => params.append('tagIds', id));
  if (filters.type != null) {
    params.set('type', filters.type);
  }
  if (filters.dateFrom != null && filters.dateFrom.length > 0) {
    params.set('dateFrom', filters.dateFrom);
  }
  if (filters.dateTo != null && filters.dateTo.length > 0) {
    params.set('dateTo', filters.dateTo);
  }
  const search = filters.search?.trim();
  if (search != null && search.length > 0) {
    params.set('search', search);
  }
  const query = params.toString();
  return query.length > 0 ? `?${query}` : '';
}

export function listMovements(filters: MovementFilters = {}): Promise<Movement[]> {
  return api.get<Movement[]>(`/api/movements${toQueryString(filters)}`);
}

export function getMovement(id: string): Promise<Movement> {
  return api.get<Movement>(`/api/movements/${id}`);
}

export function createMovement(body: CreateMovementRequest): Promise<Movement> {
  return api.post<Movement>('/api/movements', body);
}

export function editMovement(id: string, body: EditMovementRequest): Promise<Movement> {
  return api.patch<Movement>(`/api/movements/${id}`, body);
}

export function deleteMovement(id: string): Promise<void> {
  return api.delete<void>(`/api/movements/${id}`);
}
