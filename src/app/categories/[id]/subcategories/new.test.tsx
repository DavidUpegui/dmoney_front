import { fireEvent, render } from '@testing-library/react-native';

import { ApiError } from '@/types';
import { useCreateSubcategory } from '@/lib/categories';

import NewSubcategoryScreen from './new';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: '1' }),
  useRouter: () => ({ back: mockBack }),
  Stack: { Screen: () => null },
}));

jest.mock('@/lib/categories', () => ({
  useCreateSubcategory: jest.fn(),
}));

const mockedUseCreateSubcategory = useCreateSubcategory as jest.Mock;

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
  mockedUseCreateSubcategory.mockReturnValue(create());
});

describe('NewSubcategoryScreen', () => {
  it('fcat07_submits_a_subcategory', async () => {
    const mutate = jest.fn(
      (_variables: unknown, options?: { onSuccess?: () => void }) => options?.onSuccess?.(),
    );
    mockedUseCreateSubcategory.mockReturnValue(create({ mutate }));

    const view = await render(<NewSubcategoryScreen />);

    await fireEvent.changeText(view.getByLabelText('Name'), 'Vegetables');
    await fireEvent.press(view.getByRole('button', { name: 'Create' }));

    expect(mutate).toHaveBeenCalledWith(
      { categoryId: '1', body: { name: 'Vegetables', description: '' } },
      expect.anything(),
    );
    expect(mockBack).toHaveBeenCalled();
  });

  it('fcat07_shows_409_inline', async () => {
    mockedUseCreateSubcategory.mockReturnValue(create({
      error: new ApiError(409, 'Conflict', 'A subcategory with that name already exists'),
    }));

    const view = await render(<NewSubcategoryScreen />);

    expect(view.getByText('A subcategory with that name already exists')).toBeTruthy();
  });

  it('fcat07_rejects_a_blank_name', async () => {
    const mutate = jest.fn();
    mockedUseCreateSubcategory.mockReturnValue(create({ mutate }));

    const view = await render(<NewSubcategoryScreen />);

    await fireEvent.press(view.getByRole('button', { name: 'Create' }));

    expect(view.getByText('Name is required')).toBeTruthy();
    expect(mutate).not.toHaveBeenCalled();
  });
});
