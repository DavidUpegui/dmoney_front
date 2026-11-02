import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import * as tagsApi from './api/tags';
import { useCreateTag, useDeleteTag, useEditTag, useTags, useTag } from './tags';

jest.mock('./api/tags');

const mockedApi = tagsApi as jest.Mocked<typeof tagsApi>;

const tag = { id: '1', name: 'vacation', description: 'Trip' };

let queryClient: QueryClient;

function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false, gcTime: 0 },
    },
  });
});

afterEach(() => {
  queryClient.clear();
});

describe('useTags', () => {
  it('ftag01_loads_the_tag_list', async () => {
    mockedApi.listTags.mockResolvedValue([tag]);

    const { result } = await renderHook(() => useTags(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([tag]);
  });
});

describe('useTag', () => {
  it('ftag06_loads_a_single_tag', async () => {
    mockedApi.getTag.mockResolvedValue(tag);

    const { result } = await renderHook(() => useTag('1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedApi.getTag).toHaveBeenCalledWith('1');
    expect(result.current.data).toEqual(tag);
  });
});

describe('useCreateTag', () => {
  it('ftag05_creates_and_invalidates', async () => {
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
    mockedApi.createTag.mockResolvedValue(tag);

    const { result } = await renderHook(() => useCreateTag(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.mutateAsync({ name: 'vacation' });
    });

    expect(mockedApi.createTag).toHaveBeenCalledWith({ name: 'vacation' });
    await waitFor(() =>
      expect(invalidate).toHaveBeenCalledWith({ queryKey: ['tags'] }),
    );
  });
});

describe('useEditTag', () => {
  it('ftag07_edits_and_invalidates_list_and_detail', async () => {
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
    mockedApi.editTag.mockResolvedValue({ ...tag, name: 'trips' });

    const { result } = await renderHook(() => useEditTag(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.mutateAsync({ id: '1', body: { name: 'trips' } });
    });

    expect(mockedApi.editTag).toHaveBeenCalledWith('1', { name: 'trips' });
    await waitFor(() =>
      expect(invalidate).toHaveBeenCalledWith({ queryKey: ['tags'] }),
    );
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['tags', '1'] });
  });
});

describe('useDeleteTag', () => {
  it('ftag08_removes_and_invalidates', async () => {
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
    const remove = jest.spyOn(queryClient, 'removeQueries');
    mockedApi.deleteTag.mockResolvedValue(undefined);

    const { result } = await renderHook(() => useDeleteTag(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.mutateAsync('1');
    });

    expect(mockedApi.deleteTag).toHaveBeenCalledWith('1');
    await waitFor(() =>
      expect(remove).toHaveBeenCalledWith({ queryKey: ['tags', '1'] }),
    );
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['tags'] });
  });
});
