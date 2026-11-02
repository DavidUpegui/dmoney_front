import { login, register } from './auth';
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

describe('auth api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.mockReset();
    mockedTokenStore.get.mockResolvedValue(null);
  });

  it('fauth01_posts_login_and_returns_token', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { token: 'jwt' }));

    await expect(login({ email: 'a@b.com', password: 'secret' })).resolves.toEqual({
      token: 'jwt',
    });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/auth/login');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({ email: 'a@b.com', password: 'secret' });
  });

  it('fauth04_posts_registration_and_returns_user_id', async () => {
    fetchMock.mockResolvedValue(jsonResponse(201, { userId: 'u1' }));

    await expect(
      register({ email: 'a@b.com', password: 'secret', name: 'Alice' }),
    ).resolves.toEqual({ userId: 'u1' });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/auth/register');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({
      email: 'a@b.com',
      password: 'secret',
      name: 'Alice',
    });
  });
});
