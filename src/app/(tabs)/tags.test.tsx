import { fireEvent, render } from '@testing-library/react-native';

import { ApiError } from '@/types';
import { useTags } from '@/lib/tags';

import TagsScreen from './tags';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/lib/tags', () => ({
  useTags: jest.fn(),
}));

const mockedUseTags = useTags as jest.Mock;

const tag = { id: '1', name: 'vacation', description: 'Trip' };

beforeEach(() => {
  jest.clearAllMocks();
});

function list(overrides: Record<string, unknown> = {}) {
  return {
    data: [tag],
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
    ...overrides,
  };
}

describe('TagsScreen', () => {
  it('ftag01_renders_name_and_description', async () => {
    mockedUseTags.mockReturnValue(list());

    const view = await render(<TagsScreen />);

    expect(view.getByText('vacation')).toBeTruthy();
    expect(view.getByText('Trip')).toBeTruthy();
  });

  it('ftag02_shows_empty_state_with_create_action', async () => {
    mockedUseTags.mockReturnValue(list({ data: [] }));

    const view = await render(<TagsScreen />);

    expect(view.getByText('No tags yet')).toBeTruthy();

    await fireEvent.press(view.getByText('New tag'));

    expect(mockPush).toHaveBeenCalledWith('/tags/new');
  });

  it('ftag03_opens_create_from_the_header', async () => {
    mockedUseTags.mockReturnValue(list());

    const view = await render(<TagsScreen />);

    await fireEvent.press(view.getByLabelText('New tag'));

    expect(mockPush).toHaveBeenCalledWith('/tags/new');
  });

  it('ftag06_opens_edit_when_a_row_is_pressed', async () => {
    mockedUseTags.mockReturnValue(list());

    const view = await render(<TagsScreen />);

    await fireEvent.press(view.getByLabelText('vacation'));

    expect(mockPush).toHaveBeenCalledWith('/tags/1/edit');
  });

  it('fsys01_shows_loading_state', async () => {
    mockedUseTags.mockReturnValue(list({ isLoading: true, data: undefined }));

    const view = await render(<TagsScreen />);

    expect(view.getByTestId('spinner')).toBeTruthy();
  });

  it('fsys03_shows_server_message_and_retries', async () => {
    const refetch = jest.fn();
    mockedUseTags.mockReturnValue(list({
      isError: true,
      data: undefined,
      error: new ApiError(500, 'Internal Server Error', 'boom'),
      refetch,
    }));

    const view = await render(<TagsScreen />);

    expect(view.getByText('Something went wrong')).toBeTruthy();
    expect(view.getByText('boom')).toBeTruthy();

    await fireEvent.press(view.getByRole('button', { name: 'Retry' }));

    expect(refetch).toHaveBeenCalled();
  });
});
