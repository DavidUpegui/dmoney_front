import { fireEvent, render } from '@testing-library/react-native';
import { useLocalSearchParams } from 'expo-router';

import { ApiError } from '@/types';
import { useLogin } from '@/lib/auth';

import LoginScreen from './login';

const mockReplace = jest.fn();

jest.mock('expo-router', () => {
  const React = jest.requireActual<typeof import('react')>('react');

  return {
    useRouter: () => ({ replace: mockReplace }),
    useLocalSearchParams: jest.fn(() => ({})),
    Link: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

jest.mock('@/lib/auth', () => ({
  useLogin: jest.fn(),
}));

const mockedUseLogin = useLogin as jest.Mock;
const mockedParams = useLocalSearchParams as jest.Mock;

function login(overrides: Record<string, unknown> = {}) {
  return {
    mutate: jest.fn(),
    isPending: false,
    error: null,
    ...overrides,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockedParams.mockReturnValue({});
  mockedUseLogin.mockReturnValue(login());
});

describe('LoginScreen', () => {
  it('fauth01_submits_normalized_credentials', async () => {
    const mutate = jest.fn();
    mockedUseLogin.mockReturnValue(login({ mutate }));

    const view = await render(<LoginScreen />);

    await fireEvent.changeText(view.getByLabelText('Email'), '  A@B.COM ');
    await fireEvent.changeText(view.getByLabelText('Password'), 'secret123');
    await fireEvent.press(view.getByRole('button', { name: 'Sign in' }));

    expect(mutate).toHaveBeenCalledWith({
      email: 'a@b.com',
      password: 'secret123',
    });
  });

  it('fauth03_shows_401_inline', async () => {
    mockedUseLogin.mockReturnValue(login({
      error: new ApiError(401, 'Unauthorized', 'Invalid credentials'),
    }));

    const view = await render(<LoginScreen />);

    expect(view.getByText('Invalid credentials')).toBeTruthy();
  });

  it('fauth05_rejects_a_short_password', async () => {
    const mutate = jest.fn();
    mockedUseLogin.mockReturnValue(login({ mutate }));

    const view = await render(<LoginScreen />);

    await fireEvent.changeText(view.getByLabelText('Email'), 'a@b.com');
    await fireEvent.changeText(view.getByLabelText('Password'), 'short');
    await fireEvent.press(view.getByRole('button', { name: 'Sign in' }));

    expect(view.getByText('Password must be at least 8 characters')).toBeTruthy();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('fauth05_disables_submit_while_pending', async () => {
    mockedUseLogin.mockReturnValue(login({ isPending: true }));

    const view = await render(<LoginScreen />);
    const button = view.getByRole('button', { name: 'Sign in' });

    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it('fauth06_shows_registration_success_banner', async () => {
    mockedParams.mockReturnValue({ registered: '1', email: 'a@b.com' });

    const view = await render(<LoginScreen />);

    expect(view.getByText('Account created. Please sign in.')).toBeTruthy();
    expect(view.getByDisplayValue('a@b.com')).toBeTruthy();
  });
});
