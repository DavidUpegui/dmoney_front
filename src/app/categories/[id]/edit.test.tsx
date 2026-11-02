import { fireEvent, render } from '@testing-library/react-native';

import { ApiError } from '@/types';
import { useCategory, useEditCategory } from '@/lib/categories';

import EditCategoryScreen from './edit';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: '1' }),
  useRouter: () => ({ back: mockBack }),
  Stack: { Screen: () => null },
}));

jest.mock('@/lib/categories', () => ({
  useCategory: jest.fn(),
  useEditCategory: jest.fn(),
}));

const mockedUseCategory = useCategory as jest.Mock;
const mockedUseEditCategory = useEditCategory as jest.Mock;

const category = { id: '1', name: 'Food', description: 'Meals', type: 'OUTCOME' };

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseCategory.mockReturnValue({
    data: category,
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  });
  mockedUseEditCategory.mockReturnValue({
    mutate: jest.fn(),
    isPending: false,
    error: null,
  });
});

describe('EditCategoryScreen', () => {
  it('fcat04_prefills_values', async () => {
    const view = await render(<EditCategoryScreen />);

    expect(view.getByDisplayValue('Food')).toBeTruthy();
    expect(view.getByDisplayValue('Meals')).toBeTruthy();
  });

  it('fcat04_saves_and_returns', async () => {
    const mutate = jest.fn(
      (_variables: unknown, options?: { onSuccess?: () => void }) => options?.onSuccess?.(),
    );
    mockedUseEditCategory.mockReturnValue({
      mutate,
      isPending: false,
      error: null,
    });

    const view = await render(<EditCategoryScreen />);

    await fireEvent.press(view.getByRole('button', { name: 'Save' }));

    expect(mutate).toHaveBeenCalledWith(
      {
        id: '1',
        body: { name: 'Food', description: 'Meals', type: 'OUTCOME' },
      },
      expect.anything(),
    );
    expect(mockBack).toHaveBeenCalled();
  });

  it('fcat04_shows_409_inline', async () => {
    mockedUseEditCategory.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      error: new ApiError(409, 'Conflict', 'A category with that name already exists'),
    });

    const view = await render(<EditCategoryScreen />);

    expect(view.getByText('A category with that name already exists')).toBeTruthy();
  });
});
