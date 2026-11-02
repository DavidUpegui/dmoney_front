import { Alert } from 'react-native';

import { confirmDestructive } from './confirm';

describe('confirmDestructive', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('ftag08_asks_for_confirmation_before_deleting', () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const onConfirm = jest.fn();

    confirmDestructive({
      title: 'Delete tag',
      message: 'Delete "vacation"?',
      onConfirm,
    });

    expect(alert).toHaveBeenCalledTimes(1);

    const buttons = alert.mock.calls[0][2] ?? [];
    const destructive = buttons.find((button) => button.style === 'destructive');

    expect(destructive).toBeDefined();
    expect(onConfirm).not.toHaveBeenCalled();

    destructive?.onPress?.();

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
