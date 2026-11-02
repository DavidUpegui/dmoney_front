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

  it('ffound01_reads_a_stored_token', async () => {
    getItemAsync.mockResolvedValue('token-123');

    await expect(tokenStore.get()).resolves.toBe('token-123');
    expect(getItemAsync).toHaveBeenCalledWith('auth_token');
  });

  it('ffound01_treats_storage_failure_as_logged_out', async () => {
    getItemAsync.mockRejectedValue(new Error('unavailable'));

    await expect(tokenStore.get()).resolves.toBeNull();
  });

  it('ffound01_writes_a_token', async () => {
    await tokenStore.set('token-123');
    expect(setItemAsync).toHaveBeenCalledWith('auth_token', 'token-123');
  });

  it('ffound01_clears_the_token', async () => {
    await tokenStore.clear();
    expect(deleteItemAsync).toHaveBeenCalledWith('auth_token');
  });
});
