import { fireEvent, render } from '@testing-library/react-native';

import { ApiError } from '@/types';
import { useAllSubcategories, useCategories } from '@/lib/categories';
import { useMovements } from '@/lib/movements';
import { useTags } from '@/lib/tags';

import MovementsScreen from './index';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/lib/movements', () => ({
  useMovements: jest.fn(),
}));

jest.mock('@/lib/categories', () => ({
  useCategories: jest.fn(),
  useAllSubcategories: jest.fn(),
}));

jest.mock('@/lib/tags', () => ({
  useTags: jest.fn(),
}));

const mockedUseMovements = useMovements as jest.Mock;
const mockedUseCategories = useCategories as jest.Mock;
const mockedUseAllSubcategories = useAllSubcategories as jest.Mock;
const mockedUseTags = useTags as jest.Mock;

const movement = {
  movementId: 'm1',
  categoryId: 'c1',
  subcategoryId: 's1',
  amount: 12500,
  type: 'OUTCOME' as const,
  description: 'Lunch',
  date: '2026-10-08',
  tagIds: ['t1'],
};

const category = { id: 'c1', name: 'Food', description: '', type: 'OUTCOME' as const };
const subcategory = {
  categoryId: 'c1',
  subcategoryId: 's1',
  subcategoryName: 'Groceries',
  subcategoryDescription: '',
};
const tag = { id: 't1', name: 'work', description: '' };

function movements(overrides: Record<string, unknown> = {}) {
  return {
    data: [movement],
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
    ...overrides,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseMovements.mockReturnValue(movements());
  mockedUseCategories.mockReturnValue({
    data: [category],
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  });
  mockedUseAllSubcategories.mockReturnValue([
    { data: [subcategory], isLoading: false, isError: false },
  ]);
  mockedUseTags.mockReturnValue({
    data: [tag],
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  });
});

describe('MovementsScreen', () => {
  it('fmov01_renders_movements', async () => {
    const view = await render(<MovementsScreen />);

    expect(view.getByText('Groceries')).toBeTruthy();
    expect(view.getByText(/Lunch/)).toBeTruthy();
    expect(view.getByText('#work')).toBeTruthy();
  });

  it('fmov11_renders_the_formatted_amount', async () => {
    const view = await render(<MovementsScreen />);

    expect(view.getAllByText(/12\.500/).length).toBeGreaterThan(0);
  });

  it('fmov02_shows_empty_state_with_create_action', async () => {
    mockedUseMovements.mockReturnValue(movements({ data: [] }));

    const view = await render(<MovementsScreen />);

    expect(view.getByText('No movements yet')).toBeTruthy();

    await fireEvent.press(view.getByText('Add movement'));

    expect(mockPush).toHaveBeenCalledWith('/movements/new');
  });

  it('fmov02_shows_no_matching_movements_when_filters_are_active', async () => {
    mockedUseMovements.mockReturnValue(movements({ data: [] }));

    const view = await render(<MovementsScreen />);

    await fireEvent.changeText(view.getByLabelText('Search'), 'taxi');

    expect(view.getByText('No matching movements')).toBeTruthy();
    expect(mockedUseMovements).toHaveBeenLastCalledWith({ search: 'taxi' });
  });

  it('fmov10_opens_the_create_sheet', async () => {
    const view = await render(<MovementsScreen />);

    await fireEvent.press(view.getByLabelText('New movement'));

    expect(mockPush).toHaveBeenCalledWith('/movements/new');
  });

  it('fmov10_opens_the_edit_sheet', async () => {
    const view = await render(<MovementsScreen />);

    await fireEvent.press(view.getByLabelText('Groceries Lunch'));

    expect(mockPush).toHaveBeenCalledWith('/movements/m1/edit');
  });

  it('fsys01_shows_loading_state', async () => {
    mockedUseMovements.mockReturnValue(movements({ isLoading: true, data: undefined }));

    const view = await render(<MovementsScreen />);

    expect(view.getByTestId('spinner')).toBeTruthy();
  });

  it('fsys03_shows_the_server_message_and_retries', async () => {
    const refetch = jest.fn();
    mockedUseMovements.mockReturnValue(movements({
      isError: true,
      data: undefined,
      error: new ApiError(500, 'Internal Server Error', 'boom'),
      refetch,
    }));

    const view = await render(<MovementsScreen />);

    expect(view.getByText('Something went wrong')).toBeTruthy();
    expect(view.getByText('boom')).toBeTruthy();

    await fireEvent.press(view.getByRole('button', { name: 'Retry' }));

    expect(refetch).toHaveBeenCalled();
  });
});
