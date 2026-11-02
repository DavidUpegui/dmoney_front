import { fireEvent, render } from '@testing-library/react-native';

import { ApiError } from '@/types';
import { useCreateTag } from '@/lib/tags';

import NewTagScreen from './new';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
  Stack: { Screen: () => null },
}));

jest.mock('@/lib/tags', () => ({
  useCreateTag: jest.fn(),
}));

const mockedUseCreateTag = useCreateTag as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('NewTagScreen', () => {
  it('ftag05_returns_after_create', async () => {
    const mutate = jest.fn(
      (_values: unknown, options?: { onSuccess?: () => void }) => options?.onSuccess?.(),
    );
    mockedUseCreateTag.mockReturnValue({
      isPending: false,
      error: null,
      mutate,
    });

    const view = await render(<NewTagScreen />);

    await fireEvent.changeText(view.getByLabelText('Name'), 'vacation');
    await fireEvent.press(view.getByRole('button', { name: 'Create' }));

    expect(mutate).toHaveBeenCalledWith(
      { name: 'vacation', description: '' },
      expect.anything(),
    );
    expect(mockBack).toHaveBeenCalled();
  });

  it('ftag09_shows_409_inline', async () => {
    mockedUseCreateTag.mockReturnValue({
      isPending: false,
      error: new ApiError(409, 'Conflict', 'Tag already exists'),
      mutate: jest.fn(),
    });

    const view = await render(<NewTagScreen />);

    expect(view.getByText('Tag already exists')).toBeTruthy();
  });
});
