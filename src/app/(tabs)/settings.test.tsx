import { fireEvent, render } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { useAuth } from '@/lib/auth';

import SettingsScreen from './settings';

jest.mock('@/lib/auth', () => ({
  useAuth: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('SettingsScreen', () => {
  it('fauth08_asks_confirmation_before_sign_out', async () => {
    const signOut = jest.fn();
    mockedUseAuth.mockReturnValue({ signOut });
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const view = await render(<SettingsScreen />);

    await fireEvent.press(view.getByLabelText('Sign out'));

    expect(alert).toHaveBeenCalledTimes(1);
    expect(signOut).not.toHaveBeenCalled();

    const buttons = alert.mock.calls[0][2] ?? [];
    const destructive = buttons.find((button) => button.style === 'destructive');

    expect(destructive).toBeDefined();
    destructive?.onPress?.();

    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
