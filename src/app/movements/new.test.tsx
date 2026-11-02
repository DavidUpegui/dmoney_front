import { fireEvent, render } from '@testing-library/react-native';

import { ApiError } from '@/types';
import { useCategories, useSubcategories } from '@/lib/categories';
import { useCreateMovement } from '@/lib/movements';
import { useTags } from '@/lib/tags';

import NewMovementScreen from './new';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
  Stack: { Screen: () => null },
}));

jest.mock('@/lib/movements', () => ({
  useCreateMovement: jest.fn(),
}));

jest.mock('@/lib/categories', () => ({
  useCategories: jest.fn(),
  useSubcategories: jest.fn(),
}));

jest.mock('@/lib/tags', () => ({
  useTags: jest.fn(),
}));

const mockedUseCreateMovement = useCreateMovement as jest.Mock;
const mockedUseCategories = useCategories as jest.Mock;
const mockedUseSubcategories = useSubcategories as jest.Mock;
const mockedUseTags = useTags as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseCreateMovement.mockReturnValue({
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
});

async function fillForm(view: Awaited<ReturnType<typeof render>>, amount = '42.5') {
  await fireEvent.press(view.getByText('Food'));
  await fireEvent.press(view.getByText('Groceries'));
  await fireEvent.changeText(view.getByLabelText('Amount'), amount);
  await fireEvent.changeText(view.getByLabelText('Date'), '2026-10-08');
  await fireEvent.changeText(view.getByLabelText('Description'), 'Lunch');
}

describe('NewMovementScreen', () => {
  it('fmov05_submits_a_movement', async () => {
    const mutate = jest.fn(
      (_values: unknown, options?: { onSuccess?: () => void }) => options?.onSuccess?.(),
    );
    mockedUseCreateMovement.mockReturnValue({
      mutate,
      isPending: false,
      error: null,
    });

    const view = await render(<NewMovementScreen />);
    await fillForm(view);
    await fireEvent.press(view.getByRole('button', { name: 'Create' }));

    expect(mutate).toHaveBeenCalledWith(
      {
        categoryId: 'c1',
        subcategoryId: 's1',
        amount: 42.5,
        type: 'OUTCOME',
        description: 'Lunch',
        date: '2026-10-08',
        tagIds: [],
      },
      expect.anything(),
    );
    expect(mockBack).toHaveBeenCalled();
  });

  it('fmov05_rejects_a_zero_amount', async () => {
    const mutate = jest.fn();
    mockedUseCreateMovement.mockReturnValue({
      mutate,
      isPending: false,
      error: null,
    });

    const view = await render(<NewMovementScreen />);
    await fillForm(view, '0');
    await fireEvent.press(view.getByRole('button', { name: 'Create' }));

    expect(view.getByText('Amount must be greater than 0')).toBeTruthy();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('fmov05_disables_submit_while_pending', async () => {
    mockedUseCreateMovement.mockReturnValue({
      mutate: jest.fn(),
      isPending: true,
      error: null,
    });

    const view = await render(<NewMovementScreen />);
    const button = view.getByRole('button', { name: 'Create' });

    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it('fmov09_shows_the_server_error', async () => {
    mockedUseCreateMovement.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      error: new ApiError(400, 'Bad Request', 'Invalid category'),
    });

    const view = await render(<NewMovementScreen />);

    expect(view.getByText('Invalid category')).toBeTruthy();
  });
});
