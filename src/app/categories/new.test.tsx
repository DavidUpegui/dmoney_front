import { fireEvent, render } from '@testing-library/react-native';

import { ApiError } from '@/types';
import { useCreateCategory } from '@/lib/categories';

import NewCategoryScreen from './new';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
  Stack: { Screen: () => null },
}));

jest.mock('@/lib/categories', () => ({
  useCreateCategory: jest.fn(),
}));

const mockedUseCreateCategory = useCreateCategory as jest.Mock;

function create(overrides: Record<string, unknown> = {}) {
  return {
    mutate: jest.fn(),
    isPending: false,
    error: null,
    ...overrides,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseCreateCategory.mockReturnValue(create());
});

describe('NewCategoryScreen', () => {
  it('fcat03_submits_a_category', async () => {
    const mutate = jest.fn(
      (_values: unknown, options?: { onSuccess?: () => void }) => options?.onSuccess?.(),
    );
    mockedUseCreateCategory.mockReturnValue(create({ mutate }));

    const view = await render(<NewCategoryScreen />);

    await fireEvent.changeText(view.getByLabelText('Name'), 'Food');
    await fireEvent.press(view.getByRole('button', { name: 'Create' }));

    expect(mutate).toHaveBeenCalledWith(
      { name: 'Food', description: '', type: 'OUTCOME' },
      expect.anything(),
    );
    expect(mockBack).toHaveBeenCalled();
  });

  it('fcat03_shows_409_inline', async () => {
    mockedUseCreateCategory.mockReturnValue(create({
      error: new ApiError(409, 'Conflict', 'A category with that name already exists'),
    }));

    const view = await render(<NewCategoryScreen />);

    expect(view.getByText('A category with that name already exists')).toBeTruthy();
  });

  it('fcat03_rejects_a_blank_name', async () => {
    const mutate = jest.fn();
    mockedUseCreateCategory.mockReturnValue(create({ mutate }));

    const view = await render(<NewCategoryScreen />);

    await fireEvent.press(view.getByRole('button', { name: 'Create' }));

    expect(view.getByText('Name is required')).toBeTruthy();
    expect(mutate).not.toHaveBeenCalled();
  });
});
