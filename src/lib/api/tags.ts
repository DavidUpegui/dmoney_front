import type { CreateTagRequest, EditTagRequest, Tag } from '@/types';

import { api } from './client';

export function listTags(): Promise<Tag[]> {
  return api.get<Tag[]>('/api/tags');
}

export function getTag(id: string): Promise<Tag> {
  return api.get<Tag>(`/api/tags/${id}`);
}

export function createTag(body: CreateTagRequest): Promise<Tag> {
  return api.post<Tag>('/api/tags', body);
}

export function editTag(id: string, body: EditTagRequest): Promise<Tag> {
  return api.patch<Tag>(`/api/tags/${id}`, body);
}

export function deleteTag(id: string): Promise<void> {
  return api.delete<void>(`/api/tags/${id}`);
}
