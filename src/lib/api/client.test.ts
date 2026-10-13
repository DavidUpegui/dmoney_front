import { api, setUnauthorizedHandler } from './client';
import { tokenStore } from './token-store';

jest.mock('./token-store', () => ({
  tokenStore: {
    get: jest.fn(),
    set: jest.fn(),
    clear: jest.fn(),
  },
}));

const mockedTokenStore = tokenStore as jest.Mocked<typeof tokenStore>;
const fetchMock = jest.fn();

beforeAll(() => {
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: 'Status',
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Response;
}

describe('api client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.mockReset();
  });

  it('attaches a bearer token when present', async () => {
    mockedTokenStore.get.mockResolvedValue('token-123');
    fetchMock.mockResolvedValue(jsonResponse(200, { ok: true }));

    await api.get('/api/categories');

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/categories');
    expect(new Headers(init.headers).get('Authorization')).toBe('Bearer token-123');
  });

  it('sends no Authorization header without a token', async () => {
    mockedTokenStore.get.mockResolvedValue(null);
    fetchMock.mockResolvedValue(jsonResponse(200, { ok: true }));

    await api.get('/api/categories');

    const [, init] = fetchMock.mock.calls[0];
    expect(new Headers(init.headers).has('Authorization')).toBe(false);
  });

  it('throws a typed ApiError for a non-2xx response', async () => {
    mockedTokenStore.get.mockResolvedValue(null);
    fetchMock.mockResolvedValue(
      jsonResponse(404, {
        status: 404,
        error: 'Not Found',
        message: 'Category not found',
        timestamp: '2026-10-08T12:34:56Z',
      }),
    );

    await expect(api.get('/api/categories/x')).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
      message: 'Category not found',
    });
  });

  it('throws a network ApiError when fetch rejects', async () => {
    mockedTokenStore.get.mockResolvedValue(null);
    fetchMock.mockRejectedValue(new Error('offline'));

    await expect(api.get('/api/categories')).rejects.toMatchObject({ status: 0 });
  });

  it('resolves to undefined for a 204 response', async () => {
    mockedTokenStore.get.mockResolvedValue(null);
    fetchMock.mockResolvedValue(jsonResponse(204, null));

    await expect(api.delete('/api/categories/x')).resolves.toBeUndefined();
  });
});

describe('api client 401 handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.mockReset();
  });

  afterEach(() => {
    setUnauthorizedHandler(null);
  });

  it('invokes the global handler on 401 for a protected path', async () => {
    mockedTokenStore.get.mockResolvedValue('token-123');
    const handler = jest.fn();
    setUnauthorizedHandler(handler);
    fetchMock.mockResolvedValue(
      jsonResponse(401, { status: 401, error: 'Unauthorized', message: 'expired' }),
    );

    await expect(api.get('/api/categories')).rejects.toMatchObject({ status: 401 });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not invoke the global handler for /auth endpoints', async () => {
    mockedTokenStore.get.mockResolvedValue(null);
    const handler = jest.fn();
    setUnauthorizedHandler(handler);
    fetchMock.mockResolvedValue(
      jsonResponse(401, { status: 401, error: 'Unauthorized', message: 'bad credentials' }),
    );

    await expect(api.post('/auth/login', { email: 'a@b.com' })).rejects.toMatchObject({
      status: 401,
    });

    expect(handler).not.toHaveBeenCalled();
  });
});
