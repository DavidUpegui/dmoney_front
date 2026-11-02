import { fireEvent, render } from '@testing-library/react-native';

import { ApiError } from '@/types';
import {
  useDeleteSubcategory,
  useEditSubcategory,
  useSubcategories,
} from '@/lib/categories';
import { confirmDestructive } from '@/lib/confirm';

import EditSubcategoryScreen from './edit';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: '1', subcategoryId: 's1' }),
  useRouter: () => ({ back: mockBack }),
  Stack: { Screen: () => null },
}));

jest.mock('@/lib/categories', () => ({
  useSubcategories: jest.fn(),
  useEditSubcategory: jest.fn(),
  useDeleteSubcategory: jest.fn(),
}));

jest.mock('@/lib/confirm', () => ({
  confirmDestructive: jest.fn(),
}));

const mockedUseSubcategories = useSubcategories as jest.Mock;
const mockedUseEditSubcategory = useEditSubcategory as jest.Mock;
const mockedUseDeleteSubcategory = useDeleteSubcategory as jest.Mock;
const mockedConfirm = confirmDestructive as jest.Mock;

const subcategory = {
  categoryId: '1',
  subcategoryId: 's1',
  subcategoryName: 'Vegetables',
  subcategoryDescription: 'Fresh produce',
};

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseSubcategories.mockReturnValue({
    data: [subcategory],
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  });
  mockedUseEditSubcategory.mockReturnValue({
    mutate: jest.fn(),
    isPending: false,
    error: null,
  });
  mockedUseDeleteSubcategory.mockReturnValue({
    mutate: jest.fn(),
    isPending: false,
    error: null,
  });
  mockedConfirm.mockImplementation(() => {});
});

describe('EditSubcategoryScreen', () => {
  it('fcat08_prefills_values', async () => {
    const view = await render(<EditSubcategoryScreen />);

    expect(view.getByDisplayValue('Vegetables')).toBeTruthy();
    expect(view.getByDisplayValue('Fresh produce')).toBeTruthy();
  });

  it('fcat08_saves_and_returns', async () => {
    const mutate = jest.fn(
      (_variables: unknown, options?: { onSuccess?: () => void }) => options?.onSuccess?.(),
    );
    mockedUseEditSubcategory.mockReturnValue({
      mutate,
      isPending: false,
      error: null,
    });

    const view = await render(<EditSubcategoryScreen />);

    await fireEvent.press(view.getByRole('button', { name: 'Save' }));

    expect(mutate).toHaveBeenCalledWith(
      {
        categoryId: '1',
        subcategoryId: 's1',
        body: { name: 'Vegetables', description: 'Fresh produce' },
      },
      expect.anything(),
    );
    expect(mockBack).toHaveBeenCalled();
  });

  it('fcat08_shows_409_inline', async () => {
    mockedUseEditSubcategory.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      error: new ApiError(409, 'Conflict', 'A subcategory with that name already exists'),
    });

    const view = await render(<EditSubcategoryScreen />);

    expect(view.getByText('A subcategory with that name already exists')).toBeTruthy();
  });

  it('fcat09_asks_confirmation_before_deleting', async () => {
    const mutate = jest.fn();
    mockedUseDeleteSubcategory.mockReturnValue({
      mutate,
      isPending: false,
      error: null,
    });

    const view = await render(<EditSubcategoryScreen />);

    await fireEvent.press(view.getByRole('button', { name: 'Delete subcategory' }));

    expect(mockedConfirm).toHaveBeenCalledTimes(1);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('fcat09_deletes_after_confirmation', async () => {
    const mutate = jest.fn(
      (_variables: unknown, options?: { onSuccess?: () => void }) => options?.onSuccess?.(),
    );
    mockedUseDeleteSubcategory.mockReturnValue({
      mutate,
      isPending: false,
      error: null,
    });
    mockedConfirm.mockImplementation(
      ({ onConfirm }: { onConfirm: () => void }) => onConfirm(),
    );

    const view = await render(<EditSubcategoryScreen />);

    await fireEvent.press(view.getByRole('button', { name: 'Delete subcategory' }));

    expect(mutate).toHaveBeenCalledWith(
      { categoryId: '1', subcategoryId: 's1' },
      expect.anything(),
    );
    expect(mockBack).toHaveBeenCalled();
  });

  it('fcat09_shows_409_when_it_still_has_movements', async () => {
    mockedUseDeleteSubcategory.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      error: new ApiError(409, 'Conflict', 'Subcategory is in use: it still has movements'),
    });

    const view = await render(<EditSubcategoryScreen />);

    expect(view.getByText('Subcategory is in use: it still has movements')).toBeTruthy();
  });
});
