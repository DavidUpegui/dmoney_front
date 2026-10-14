import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import * as categoriesApi from './api/categories';
import {
  useCategories,
  useCreateCategory,
  useCreateSubcategory,
  useDeleteCategory,
  useSubcategories,
} from './categories';

jest.mock('./api/categories');

const mockedApi = categoriesApi as jest.Mocked<typeof categoriesApi>;

const category = { id: '1', name: 'Food', description: 'Meals', type: 'OUTCOME' as const };
const subcategory = {
  categoryId: '1',
  subcategoryId: 's1',
  subcategoryName: 'Vegetables',
  subcategoryDescription: 'Fresh produce',
};

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

describe('useCategories', () => {
  it('loads the category list', async () => {
    mockedApi.listCategories.mockResolvedValue([category]);

    const { result } = await renderHook(() => useCategories(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([category]);
  });
});

describe('useSubcategories', () => {
  it('loads subcategories for a category', async () => {
    mockedApi.listSubcategories.mockResolvedValue([subcategory]);

    const { result } = await renderHook(() => useSubcategories('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedApi.listSubcategories).toHaveBeenCalledWith('1');
    expect(result.current.data).toEqual([subcategory]);
  });
});

describe('useCreateCategory', () => {
  it('creates a category and invalidates the list', async () => {
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
    mockedApi.createCategory.mockResolvedValue(category);

    const { result } = await renderHook(() => useCreateCategory(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ name: 'Food', type: 'OUTCOME' });
    });

    expect(mockedApi.createCategory).toHaveBeenCalledWith({ name: 'Food', type: 'OUTCOME' });
    await waitFor(() =>
      expect(invalidate).toHaveBeenCalledWith({ queryKey: ['categories'] }),
    );
  });
});

describe('useDeleteCategory', () => {
  it('removes the detail query and invalidates the list', async () => {
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
    const remove = jest.spyOn(queryClient, 'removeQueries');
    mockedApi.deleteCategory.mockResolvedValue(undefined);

    const { result } = await renderHook(() => useDeleteCategory(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync('1');
    });

    expect(mockedApi.deleteCategory).toHaveBeenCalledWith('1');
    await waitFor(() =>
      expect(remove).toHaveBeenCalledWith({ queryKey: ['categories', '1'] }),
    );
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['categories'] });
  });
});

describe('useCreateSubcategory', () => {
  it('creates a subcategory and invalidates its list', async () => {
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
    mockedApi.createSubcategory.mockResolvedValue(subcategory);

    const { result } = await renderHook(() => useCreateSubcategory(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        categoryId: '1',
        body: { name: 'Vegetables' },
      });
    });

    expect(mockedApi.createSubcategory).toHaveBeenCalledWith('1', { name: 'Vegetables' });
    await waitFor(() =>
      expect(invalidate).toHaveBeenCalledWith({
        queryKey: ['categories', '1', 'subcategories'],
      }),
    );
  });
});
