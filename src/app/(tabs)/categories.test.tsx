import { fireEvent, render } from '@testing-library/react-native';

import { ApiError } from '@/types';
import { useCategories } from '@/lib/categories';

import CategoriesScreen from './categories';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/lib/categories', () => ({
  useCategories: jest.fn(),
}));

const mockedUseCategories = useCategories as jest.Mock;

const income = { id: '1', name: 'Salary', description: 'Monthly', type: 'INCOME' };
const outcome = { id: '2', name: 'Food', description: 'Meals', type: 'OUTCOME' };

function list(overrides: Record<string, unknown> = {}) {
  return {
    data: [income, outcome],
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
    ...overrides,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CategoriesScreen', () => {
  it('fcat01_renders_categories', async () => {
    mockedUseCategories.mockReturnValue(list());

    const view = await render(<CategoriesScreen />);

    expect(view.getByText('Salary')).toBeTruthy();
    expect(view.getByText('Food')).toBeTruthy();
    expect(view.getByText('Meals')).toBeTruthy();
  });

  it('fcat02_shows_empty_state_with_create_action', async () => {
    mockedUseCategories.mockReturnValue(list({ data: [] }));

    const view = await render(<CategoriesScreen />);

    expect(view.getByText('No categories yet')).toBeTruthy();

    await fireEvent.press(view.getByText('New category'));

    expect(mockPush).toHaveBeenCalledWith('/categories/new');
  });

  it('fcat03_opens_create_from_the_header', async () => {
    mockedUseCategories.mockReturnValue(list());

    const view = await render(<CategoriesScreen />);

    await fireEvent.press(view.getByLabelText('New category'));

    expect(mockPush).toHaveBeenCalledWith('/categories/new');
  });

  it('fcat06_opens_the_detail_when_a_row_is_pressed', async () => {
    mockedUseCategories.mockReturnValue(list());

    const view = await render(<CategoriesScreen />);

    await fireEvent.press(view.getByLabelText('Food'));

    expect(mockPush).toHaveBeenCalledWith('/categories/2');
  });

  it('fsys01_shows_loading_state', async () => {
    mockedUseCategories.mockReturnValue(list({ isLoading: true, data: undefined }));

    const view = await render(<CategoriesScreen />);

    expect(view.getByTestId('spinner')).toBeTruthy();
  });

  it('fsys03_shows_server_message_and_retries', async () => {
    const refetch = jest.fn();
    mockedUseCategories.mockReturnValue(list({
      isError: true,
      data: undefined,
      error: new ApiError(500, 'Internal Server Error', 'boom'),
      refetch,
    }));

    const view = await render(<CategoriesScreen />);

    expect(view.getByText('Something went wrong')).toBeTruthy();
    expect(view.getByText('boom')).toBeTruthy();

    await fireEvent.press(view.getByRole('button', { name: 'Retry' }));

    expect(refetch).toHaveBeenCalled();
  });
});
