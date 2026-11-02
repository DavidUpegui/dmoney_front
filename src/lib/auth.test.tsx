import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import * as authApi from './api/auth';
import { api } from './api/client';
import { tokenStore } from './api/token-store';
import { AuthProvider, useAuth, useLogin, useRegister } from './auth';

jest.mock('./api/auth');
jest.mock('./api/token-store', () => ({
  tokenStore: {
    get: jest.fn(),
    set: jest.fn(),
    clear: jest.fn(),
  },
}));

const mockedAuthApi = authApi as jest.Mocked<typeof authApi>;
const mockedTokenStore = tokenStore as jest.Mocked<typeof tokenStore>;
const fetchMock = jest.fn();

beforeAll(() => {
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});

let queryClient: QueryClient;

function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    );
  };
}

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: 'Status',
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Response;
}

beforeEach(() => {
  jest.clearAllMocks();
  fetchMock.mockReset();
  mockedTokenStore.get.mockResolvedValue(null);
  mockedTokenStore.set.mockResolvedValue(undefined);
  mockedTokenStore.clear.mockResolvedValue(undefined);
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false, gcTime: 0 },
    },
  });
});

afterEach(() => {
  queryClient.clear();
});

describe('useLogin', () => {
  it('fauth02_stores_the_token_on_success', async () => {
    mockedAuthApi.login.mockResolvedValue({ token: 'jwt-1' });

    const { result } = await renderHook(
      () => ({ auth: useAuth(), login: useLogin() }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.login.mutateAsync({ email: 'a@b.com', password: 'secret' });
    });

    expect(mockedAuthApi.login).toHaveBeenCalledWith({ email: 'a@b.com', password: 'secret' });
    expect(mockedTokenStore.set).toHaveBeenCalledWith('jwt-1');
    await waitFor(() => expect(result.current.auth.isAuthenticated).toBe(true));
  });

  it('fauth03_leaves_the_session_unauthenticated_on_failure', async () => {
    mockedAuthApi.login.mockRejectedValue(new Error('bad credentials'));

    const { result } = await renderHook(
      () => ({ auth: useAuth(), login: useLogin() }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await expect(
        result.current.login.mutateAsync({ email: 'a@b.com', password: 'wrong' }),
      ).rejects.toThrow('bad credentials');
    });

    await waitFor(() => expect(result.current.login.isError).toBe(true));
    expect(mockedTokenStore.set).not.toHaveBeenCalled();
    expect(result.current.auth.isAuthenticated).toBe(false);
  });
});

describe('useRegister', () => {
  it('fauth04_returns_user_id_without_storing_token', async () => {
    mockedAuthApi.register.mockResolvedValue({ userId: 'u1' });

    const { result } = await renderHook(() => useRegister(), { wrapper: createWrapper() });

    await act(async () => {
      const response = await result.current.mutateAsync({
        email: 'a@b.com',
        password: 'secret',
        name: 'Alice',
      });
      expect(response).toEqual({ userId: 'u1' });
    });

    expect(mockedAuthApi.register).toHaveBeenCalledWith({
      email: 'a@b.com',
      password: 'secret',
      name: 'Alice',
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedTokenStore.set).not.toHaveBeenCalled();
  });
});

describe('global 401 handling', () => {
  it('fsys02_clears_the_session_on_401', async () => {
    mockedTokenStore.get.mockResolvedValue('jwt-1');

    const { result } = await renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    fetchMock.mockResolvedValue(
      jsonResponse(401, { status: 401, error: 'Unauthorized', message: 'expired' }),
    );

    await act(async () => {
      await expect(api.get('/api/categories')).rejects.toMatchObject({ status: 401 });
    });

    await waitFor(() => expect(result.current.isAuthenticated).toBe(false));
    expect(mockedTokenStore.clear).toHaveBeenCalled();
  });
});

describe('session lifecycle', () => {
  it('fauth07_starts_unauthenticated_without_token', async () => {
    mockedTokenStore.get.mockResolvedValue(null);

    const { result } = await renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('fauth07_exposes_loading_while_hydrating', async () => {
    mockedTokenStore.get.mockReturnValue(new Promise<string | null>(() => {}));

    const { result } = await renderHook(() => useAuth(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('fauth07_restores_persisted_session', async () => {
    mockedTokenStore.get.mockResolvedValue('jwt-1');

    const { result } = await renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));
  });

  it('fauth08_clears_session_on_sign_out', async () => {
    mockedTokenStore.get.mockResolvedValue('jwt-1');

    const { result } = await renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockedTokenStore.clear).toHaveBeenCalled();
    await waitFor(() => expect(result.current.isAuthenticated).toBe(false));
  });
});
