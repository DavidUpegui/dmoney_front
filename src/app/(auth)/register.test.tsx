import { fireEvent, render } from '@testing-library/react-native';

import { ApiError } from '@/types';
import { useRegister } from '@/lib/auth';

import RegisterScreen from './register';

const mockReplace = jest.fn();

jest.mock('expo-router', () => {
  const React = jest.requireActual<typeof import('react')>('react');

  return {
    useRouter: () => ({ replace: mockReplace }),
    Link: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

jest.mock('@/lib/auth', () => ({
  useRegister: jest.fn(),
}));

const mockedUseRegister = useRegister as jest.Mock;

function register(overrides: Record<string, unknown> = {}) {
  return {
    mutate: jest.fn(),
    isPending: false,
    error: null,
    ...overrides,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseRegister.mockReturnValue(register());
});

describe('RegisterScreen', () => {
  it('fauth04_submits_registration', async () => {
    const mutate = jest.fn();
    mockedUseRegister.mockReturnValue(register({ mutate }));

    const view = await render(<RegisterScreen />);

    await fireEvent.changeText(view.getByLabelText('Name'), '  Alice  ');
    await fireEvent.changeText(view.getByLabelText('Email'), '  A@B.COM ');
    await fireEvent.changeText(view.getByLabelText('Password'), 'secret123');
    await fireEvent.press(view.getByRole('button', { name: 'Create account' }));

    expect(mutate).toHaveBeenCalledWith(
      {
        email: 'a@b.com',
        password: 'secret123',
        name: 'Alice',
      },
      expect.anything(),
    );
  });

  it('fauth04_shows_409_inline', async () => {
    mockedUseRegister.mockReturnValue(register({
      error: new ApiError(409, 'Conflict', 'Email already registered'),
    }));

    const view = await render(<RegisterScreen />);

    expect(view.getByText('Email already registered')).toBeTruthy();
  });

  it('fauth05_rejects_a_short_password', async () => {
    const mutate = jest.fn();
    mockedUseRegister.mockReturnValue(register({ mutate }));

    const view = await render(<RegisterScreen />);

    await fireEvent.changeText(view.getByLabelText('Name'), 'Alice');
    await fireEvent.changeText(view.getByLabelText('Email'), 'a@b.com');
    await fireEvent.changeText(view.getByLabelText('Password'), 'short');
    await fireEvent.press(view.getByRole('button', { name: 'Create account' }));

    expect(view.getByText('Password must be at least 8 characters')).toBeTruthy();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('fauth06_returns_to_login_after_register', async () => {
    const mutate = jest.fn(
      (_values: unknown, options?: { onSuccess?: () => void }) => options?.onSuccess?.(),
    );
    mockedUseRegister.mockReturnValue(register({ mutate }));

    const view = await render(<RegisterScreen />);

    await fireEvent.changeText(view.getByLabelText('Name'), 'Alice');
    await fireEvent.changeText(view.getByLabelText('Email'), '  A@B.COM ');
    await fireEvent.changeText(view.getByLabelText('Password'), 'secret123');
    await fireEvent.press(view.getByRole('button', { name: 'Create account' }));

    expect(mockReplace).toHaveBeenCalledWith({
      pathname: '/(auth)/login',
      params: { email: 'a@b.com', registered: '1' },
    });
  });
});
