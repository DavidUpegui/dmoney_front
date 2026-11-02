import { fireEvent, render } from '@testing-library/react-native';

import { ApiError } from '@/types';
import { useDeleteTag, useEditTag, useTag } from '@/lib/tags';
import { confirmDestructive } from '@/lib/confirm';

import EditTagScreen from './edit';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: '1' }),
  useRouter: () => ({ back: mockBack }),
  Stack: { Screen: () => null },
}));

jest.mock('@/lib/tags', () => ({
  useTag: jest.fn(),
  useEditTag: jest.fn(),
  useDeleteTag: jest.fn(),
}));

jest.mock('@/lib/confirm', () => ({
  confirmDestructive: jest.fn(),
}));

const mockedUseTag = useTag as jest.Mock;
const mockedUseEditTag = useEditTag as jest.Mock;
const mockedUseDeleteTag = useDeleteTag as jest.Mock;
const mockedConfirm = confirmDestructive as jest.Mock;

const tag = { id: '1', name: 'vacation', description: 'Trip' };

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseTag.mockReturnValue({
    data: tag,
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  });
  mockedUseEditTag.mockReturnValue({
    isPending: false,
    error: null,
    mutate: jest.fn(),
  });
  mockedUseDeleteTag.mockReturnValue({
    isPending: false,
    mutate: jest.fn(),
  });
});

describe('EditTagScreen', () => {
  it('ftag06_prefills_values', async () => {
    const view = await render(<EditTagScreen />);

    expect(view.getByDisplayValue('vacation')).toBeTruthy();
    expect(view.getByDisplayValue('Trip')).toBeTruthy();
  });

  it('ftag07_saves_and_returns', async () => {
    const mutate = jest.fn(
      (_variables: unknown, options?: { onSuccess?: () => void }) => options?.onSuccess?.(),
    );
    mockedUseEditTag.mockReturnValue({
      isPending: false,
      error: null,
      mutate,
    });

    const view = await render(<EditTagScreen />);

    await fireEvent.press(view.getByRole('button', { name: 'Save' }));

    expect(mutate).toHaveBeenCalledWith(
      { id: '1', body: { name: 'vacation', description: 'Trip' } },
      expect.anything(),
    );
    expect(mockBack).toHaveBeenCalled();
  });

  it('ftag08_asks_confirmation_before_deleting', async () => {
    const mutate = jest.fn();
    mockedUseDeleteTag.mockReturnValue({ isPending: false, mutate });

    const view = await render(<EditTagScreen />);

    await fireEvent.press(view.getByRole('button', { name: 'Delete tag' }));

    expect(mockedConfirm).toHaveBeenCalledTimes(1);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('ftag08_deletes_after_confirmation', async () => {
    const mutate = jest.fn(
      (_id: string, options?: { onSuccess?: () => void }) => options?.onSuccess?.(),
    );
    mockedUseDeleteTag.mockReturnValue({ isPending: false, mutate });
    mockedConfirm.mockImplementation(
      ({ onConfirm }: { onConfirm: () => void }) => onConfirm(),
    );

    const view = await render(<EditTagScreen />);

    await fireEvent.press(view.getByRole('button', { name: 'Delete tag' }));

    expect(mutate).toHaveBeenCalledWith('1', expect.anything());
    expect(mockBack).toHaveBeenCalled();
  });

  it('ftag08_does_not_delete_when_cancelled', async () => {
    const mutate = jest.fn();
    mockedUseDeleteTag.mockReturnValue({ isPending: false, mutate });
    mockedConfirm.mockImplementation(() => {});

    const view = await render(<EditTagScreen />);

    await fireEvent.press(view.getByRole('button', { name: 'Delete tag' }));

    expect(mutate).not.toHaveBeenCalled();
  });

  it('ftag09_shows_409_inline', async () => {
    mockedUseEditTag.mockReturnValue({
      isPending: false,
      error: new ApiError(409, 'Conflict', 'Tag already exists'),
      mutate: jest.fn(),
    });

    const view = await render(<EditTagScreen />);

    expect(view.getByText('Tag already exists')).toBeTruthy();
  });
});
