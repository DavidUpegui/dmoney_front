import { fireEvent, render } from '@testing-library/react-native';

import { ApiError } from '@/types';
import { useCategories, useSubcategories } from '@/lib/categories';
import { confirmDestructive } from '@/lib/confirm';
import {
  useDeleteMovement,
  useEditMovement,
  useMovement,
} from '@/lib/movements';
import { useTags } from '@/lib/tags';

import EditMovementScreen from './edit';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: 'm1' }),
  useRouter: () => ({ back: mockBack }),
  Stack: { Screen: () => null },
}));

jest.mock('@/lib/movements', () => ({
  useMovement: jest.fn(),
  useEditMovement: jest.fn(),
  useDeleteMovement: jest.fn(),
}));

jest.mock('@/lib/categories', () => ({
  useCategories: jest.fn(),
  useSubcategories: jest.fn(),
}));

jest.mock('@/lib/tags', () => ({
  useTags: jest.fn(),
}));

jest.mock('@/lib/confirm', () => ({
  confirmDestructive: jest.fn(),
}));

const mockedUseMovement = useMovement as jest.Mock;
const mockedUseEditMovement = useEditMovement as jest.Mock;
const mockedUseDeleteMovement = useDeleteMovement as jest.Mock;
const mockedUseCategories = useCategories as jest.Mock;
const mockedUseSubcategories = useSubcategories as jest.Mock;
const mockedUseTags = useTags as jest.Mock;
const mockedConfirm = confirmDestructive as jest.Mock;

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

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseMovement.mockReturnValue({
    data: movement,
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  });
  mockedUseEditMovement.mockReturnValue({
    mutate: jest.fn(),
    isPending: false,
    error: null,
  });
  mockedUseDeleteMovement.mockReturnValue({
    mutate: jest.fn(),
    isPending: false,
    error: null,
  });
  mockedUseCategories.mockReturnValue({
    data: [{ id: 'c1', name: 'Food', description: '', type: 'OUTCOME' }],
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  });
  mockedUseSubcategories.mockReturnValue({
    data: [{
      categoryId: 'c1',
      subcategoryId: 's1',
      subcategoryName: 'Groceries',
      subcategoryDescription: '',
    }],
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  });
  mockedUseTags.mockReturnValue({
    data: [],
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  });
  mockedConfirm.mockImplementation(() => {});
});

describe('EditMovementScreen', () => {
  it('fmov06_prefills_values', async () => {
    const view = await render(<EditMovementScreen />);

    expect(view.getByDisplayValue('42.5')).toBeTruthy();
    expect(view.getByDisplayValue('2026-10-08')).toBeTruthy();
    expect(view.getByDisplayValue('Lunch')).toBeTruthy();
  });

  it('fmov06_saves_and_returns', async () => {
    const mutate = jest.fn(
      (_variables: unknown, options?: { onSuccess?: () => void }) => options?.onSuccess?.(),
    );
    mockedUseEditMovement.mockReturnValue({
      mutate,
      isPending: false,
      error: null,
    });

    const view = await render(<EditMovementScreen />);

    await fireEvent.press(view.getByRole('button', { name: 'Save' }));

    expect(mutate).toHaveBeenCalledWith(
      {
        id: 'm1',
        body: {
          categoryId: 'c1',
          subcategoryId: 's1',
          amount: 42.5,
          type: 'OUTCOME',
          description: 'Lunch',
          date: '2026-10-08',
          tagIds: [],
        },
      },
      expect.anything(),
    );
    expect(mockBack).toHaveBeenCalled();
  });

  it('fmov07_asks_confirmation_before_deleting', async () => {
    const mutate = jest.fn();
    mockedUseDeleteMovement.mockReturnValue({
      mutate,
      isPending: false,
      error: null,
    });

    const view = await render(<EditMovementScreen />);

    await fireEvent.press(view.getByRole('button', { name: 'Delete movement' }));

    expect(mockedConfirm).toHaveBeenCalledTimes(1);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('fmov07_deletes_after_confirmation', async () => {
    const mutate = jest.fn(
      (_id: string, options?: { onSuccess?: () => void }) => options?.onSuccess?.(),
    );
    mockedUseDeleteMovement.mockReturnValue({
      mutate,
      isPending: false,
      error: null,
    });
    mockedConfirm.mockImplementation(
      ({ onConfirm }: { onConfirm: () => void }) => onConfirm(),
    );

    const view = await render(<EditMovementScreen />);

    await fireEvent.press(view.getByRole('button', { name: 'Delete movement' }));

    expect(mutate).toHaveBeenCalledWith('m1', expect.anything());
    expect(mockBack).toHaveBeenCalled();
  });

  it('fmov09_shows_the_server_error', async () => {
    mockedUseEditMovement.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      error: new ApiError(400, 'Bad Request', 'Amount must be greater than 0'),
    });

    const view = await render(<EditMovementScreen />);

    expect(view.getByText('Amount must be greater than 0')).toBeTruthy();
  });
});
