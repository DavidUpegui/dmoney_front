import { fireEvent, render } from '@testing-library/react-native';

import { ApiError } from '@/types';
import {
  useCategory,
  useDeleteCategory,
  useSubcategories,
} from '@/lib/categories';
import { confirmDestructive } from '@/lib/confirm';

import CategoryDetailScreen from './index';

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: '1' }),
  useRouter: () => ({ push: mockPush, back: mockBack }),
  Stack: { Screen: () => null },
}));

jest.mock('@/lib/categories', () => ({
  useCategory: jest.fn(),
  useSubcategories: jest.fn(),
  useDeleteCategory: jest.fn(),
}));

jest.mock('@/lib/confirm', () => ({
  confirmDestructive: jest.fn(),
}));

const mockedUseCategory = useCategory as jest.Mock;
const mockedUseSubcategories = useSubcategories as jest.Mock;
const mockedUseDeleteCategory = useDeleteCategory as jest.Mock;
const mockedConfirm = confirmDestructive as jest.Mock;

const category = { id: '1', name: 'Food', description: 'Meals', type: 'OUTCOME' };
const subcategory = {
  categoryId: '1',
  subcategoryId: 's1',
  subcategoryName: 'Vegetables',
  subcategoryDescription: 'Fresh produce',
};

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseCategory.mockReturnValue({
    data: category,
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  });
  mockedUseSubcategories.mockReturnValue({
    data: [subcategory],
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  });
  mockedUseDeleteCategory.mockReturnValue({
    mutate: jest.fn(),
    isPending: false,
    error: null,
  });
  mockedConfirm.mockImplementation(() => {});
});

describe('CategoryDetailScreen', () => {
  it('fcat06_shows_subcategories', async () => {
    const view = await render(<CategoryDetailScreen />);

    expect(view.getByText('Vegetables')).toBeTruthy();
    expect(view.getByText('Fresh produce')).toBeTruthy();
  });

  it('fcat06_shows_empty_subcategories', async () => {
    mockedUseSubcategories.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    const view = await render(<CategoryDetailScreen />);

    expect(view.getByText('No subcategories yet')).toBeTruthy();
  });

  it('fcat06_opens_a_subcategory_to_edit', async () => {
    const view = await render(<CategoryDetailScreen />);

    await fireEvent.press(view.getByLabelText('Vegetables'));

    expect(mockPush).toHaveBeenCalledWith('/categories/1/subcategories/s1/edit');
  });

  it('fcat07_opens_new_subcategory', async () => {
    const view = await render(<CategoryDetailScreen />);

    await fireEvent.press(view.getByRole('button', { name: 'Add subcategory' }));

    expect(mockPush).toHaveBeenCalledWith('/categories/1/subcategories/new');
  });

  it('fcat04_opens_edit_category', async () => {
    const view = await render(<CategoryDetailScreen />);

    await fireEvent.press(view.getByRole('button', { name: 'Edit' }));

    expect(mockPush).toHaveBeenCalledWith('/categories/1/edit');
  });

  it('fcat05_asks_confirmation_before_deleting', async () => {
    const mutate = jest.fn();
    mockedUseDeleteCategory.mockReturnValue({
      mutate,
      isPending: false,
      error: null,
    });

    const view = await render(<CategoryDetailScreen />);

    await fireEvent.press(view.getByRole('button', { name: 'Delete' }));

    expect(mockedConfirm).toHaveBeenCalledTimes(1);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('fcat05_deletes_after_confirmation', async () => {
    const mutate = jest.fn(
      (_id: string, options?: { onSuccess?: () => void }) => options?.onSuccess?.(),
    );
    mockedUseDeleteCategory.mockReturnValue({
      mutate,
      isPending: false,
      error: null,
    });
    mockedConfirm.mockImplementation(
      ({ onConfirm }: { onConfirm: () => void }) => onConfirm(),
    );

    const view = await render(<CategoryDetailScreen />);

    await fireEvent.press(view.getByRole('button', { name: 'Delete' }));

    expect(mutate).toHaveBeenCalledWith('1', expect.anything());
    expect(mockBack).toHaveBeenCalled();
  });

  it('fcat05_shows_409_when_it_still_has_movements', async () => {
    mockedUseDeleteCategory.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      error: new ApiError(409, 'Conflict', 'Category is in use: it still has movements'),
    });

    const view = await render(<CategoryDetailScreen />);

    expect(view.getByText('Category is in use: it still has movements')).toBeTruthy();
  });
});
