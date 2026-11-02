import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import * as movementsApi from './api/movements';
import {
  useCreateMovement,
  useDeleteMovement,
  useEditMovement,
  useMovements,
  useMovement,
} from './movements';

jest.mock('./api/movements');

const mockedApi = movementsApi as jest.Mocked<typeof movementsApi>;

const movement = {
  movementId: 'm1',
  categoryId: 'c1',
  subcategoryId: 's1',
  amount: 42.5,
  type: 'OUTCOME' as const,
  description: 'Lunch',
  date: '2026-10-08',
  tagIds: [],
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

describe('useMovements', () => {
  it('fmov01_loads_movements_with_filters', async () => {
    mockedApi.listMovements.mockResolvedValue([movement]);

    const { result } = await renderHook(() => useMovements({ type: 'OUTCOME' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedApi.listMovements).toHaveBeenCalledWith({ type: 'OUTCOME' });
    expect(result.current.data).toEqual([movement]);
  });
});

describe('useMovement', () => {
  it('fmov06_loads_a_movement', async () => {
    mockedApi.getMovement.mockResolvedValue(movement);

    const { result } = await renderHook(() => useMovement('m1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedApi.getMovement).toHaveBeenCalledWith('m1');
    expect(result.current.data).toEqual(movement);
  });
});

describe('useCreateMovement', () => {
  it('fmov05_creates_and_invalidates_the_list', async () => {
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
    mockedApi.createMovement.mockResolvedValue(movement);

    const { result } = await renderHook(() => useCreateMovement(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        categoryId: 'c1',
        subcategoryId: 's1',
        amount: 42.5,
        type: 'OUTCOME',
        date: '2026-10-08',
      });
    });

    await waitFor(() =>
      expect(invalidate).toHaveBeenCalledWith({ queryKey: ['movements'] }),
    );
  });
});

describe('useEditMovement', () => {
  it('fmov08_edits_and_invalidates_list_and_detail', async () => {
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
    mockedApi.editMovement.mockResolvedValue(movement);

    const { result } = await renderHook(() => useEditMovement(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ id: 'm1', body: { amount: 50 } });
    });

    expect(mockedApi.editMovement).toHaveBeenCalledWith('m1', { amount: 50 });
    await waitFor(() =>
      expect(invalidate).toHaveBeenCalledWith({ queryKey: ['movements'] }),
    );
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['movements', 'm1'] });
  });
});

describe('useDeleteMovement', () => {
  it('fmov07_removes_detail_and_invalidates_list', async () => {
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
    const remove = jest.spyOn(queryClient, 'removeQueries');
    mockedApi.deleteMovement.mockResolvedValue(undefined);

    const { result } = await renderHook(() => useDeleteMovement(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync('m1');
    });

    expect(mockedApi.deleteMovement).toHaveBeenCalledWith('m1');
    await waitFor(() =>
      expect(remove).toHaveBeenCalledWith({ queryKey: ['movements', 'm1'] }),
    );
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['movements'] });
  });
});
