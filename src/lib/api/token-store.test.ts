import * as SecureStore from 'expo-secure-store';

import { tokenStore } from './token-store';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const getItemAsync = SecureStore.getItemAsync as jest.Mock;
const setItemAsync = SecureStore.setItemAsync as jest.Mock;
const deleteItemAsync = SecureStore.deleteItemAsync as jest.Mock;

describe('tokenStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('reads a stored token', async () => {
    getItemAsync.mockResolvedValue('token-123');

    await expect(tokenStore.get()).resolves.toBe('token-123');
    expect(getItemAsync).toHaveBeenCalledWith('auth_token');
  });

  it('treats a SecureStore failure as logged out', async () => {
    getItemAsync.mockRejectedValue(new Error('unavailable'));

    await expect(tokenStore.get()).resolves.toBeNull();
  });

  it('writes a token', async () => {
    await tokenStore.set('token-123');
    expect(setItemAsync).toHaveBeenCalledWith('auth_token', 'token-123');
  });

  it('clears the token', async () => {
    await tokenStore.clear();
    expect(deleteItemAsync).toHaveBeenCalledWith('auth_token');
  });
});
