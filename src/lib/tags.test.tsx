import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import * as tagsApi from './api/tags';
import { useCreateTag, useDeleteTag, useTags } from './tags';

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
  it('loads the tag list', async () => {
    mockedApi.listTags.mockResolvedValue([tag]);

    const { result } = await renderHook(() => useTags(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([tag]);
  });
});

describe('useCreateTag', () => {
  it('creates a tag and invalidates the list', async () => {
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

describe('useDeleteTag', () => {
  it('removes the detail query and invalidates the list', async () => {
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
