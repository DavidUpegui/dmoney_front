import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import * as categoriesApi from './api/categories';
import {
  useCategories,
  useCategory,
  useCreateCategory,
  useCreateSubcategory,
  useDeleteCategory,
  useDeleteSubcategory,
  useEditCategory,
  useEditSubcategory,
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
  it('fcat01_loads_the_category_list', async () => {
    mockedApi.listCategories.mockResolvedValue([category]);

    const { result } = await renderHook(() => useCategories(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([category]);
  });
});

describe('useCategory', () => {
  it('fcat06_loads_the_category_detail', async () => {
    mockedApi.getCategory.mockResolvedValue(category);

    const { result } = await renderHook(() => useCategory('1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedApi.getCategory).toHaveBeenCalledWith('1');
    expect(result.current.data).toEqual(category);
  });
});

describe('useSubcategories', () => {
  it('fcat06_loads_subcategories', async () => {
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
  it('fcat10_create_invalidates_the_list', async () => {
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

describe('useEditCategory', () => {
  it('fcat04_edits_and_invalidates_list_and_detail', async () => {
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
    mockedApi.editCategory.mockResolvedValue(category);

    const { result } = await renderHook(() => useEditCategory(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ id: '1', body: { name: 'Food' } });
    });

    expect(mockedApi.editCategory).toHaveBeenCalledWith('1', { name: 'Food' });
    await waitFor(() =>
      expect(invalidate).toHaveBeenCalledWith({ queryKey: ['categories'] }),
    );
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['categories', '1'] });
  });
});

describe('useDeleteCategory', () => {
  it('fcat05_removes_detail_and_invalidates_list', async () => {
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
  it('fcat07_creates_and_invalidates_subcategories', async () => {
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

describe('useEditSubcategory', () => {
  it('fcat08_edits_and_invalidates_subcategories', async () => {
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
    mockedApi.editSubcategory.mockResolvedValue(subcategory);

    const { result } = await renderHook(() => useEditSubcategory(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        categoryId: '1',
        subcategoryId: 's1',
        body: { name: 'Vegetables' },
      });
    });

    expect(mockedApi.editSubcategory).toHaveBeenCalledWith('1', 's1', { name: 'Vegetables' });
    await waitFor(() =>
      expect(invalidate).toHaveBeenCalledWith({
        queryKey: ['categories', '1', 'subcategories'],
      }),
    );
  });
});

describe('useDeleteSubcategory', () => {
  it('fcat09_deletes_and_invalidates_subcategories', async () => {
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
    mockedApi.deleteSubcategory.mockResolvedValue(undefined);

    const { result } = await renderHook(() => useDeleteSubcategory(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ categoryId: '1', subcategoryId: 's1' });
    });

    expect(mockedApi.deleteSubcategory).toHaveBeenCalledWith('1', 's1');
    await waitFor(() =>
      expect(invalidate).toHaveBeenCalledWith({
        queryKey: ['categories', '1', 'subcategories'],
      }),
    );
  });
});
