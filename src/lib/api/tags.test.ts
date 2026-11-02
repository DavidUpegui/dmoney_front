import { createTag, deleteTag, editTag, getTag, listTags } from './tags';
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

describe('tags api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.mockReset();
    mockedTokenStore.get.mockResolvedValue(null);
  });

  it('ftag01_gets_the_tag_list', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(200, [{ id: '1', name: 'vacation', description: '' }]),
    );

    await expect(listTags()).resolves.toHaveLength(1);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/tags');
    expect(init.method).toBeUndefined();
  });

  it('ftag06_gets_a_tag_by_id', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(200, { id: 't1', name: 'vacation', description: '' }),
    );

    await expect(getTag('t1')).resolves.toMatchObject({ id: 't1' });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/tags/t1');
    expect(init.method).toBeUndefined();
  });

  it('ftag05_posts_a_new_tag', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(201, { id: '1', name: 'vacation', description: '' }),
    );

    await createTag({ name: 'vacation' });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/tags');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({ name: 'vacation' });
  });

  it('ftag07_patches_a_tag', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(200, { id: 't1', name: 'trips', description: '' }),
    );

    await editTag('t1', { name: 'trips' });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/tags/t1');
    expect(init.method).toBe('PATCH');
    expect(JSON.parse(init.body)).toEqual({ name: 'trips' });
  });

  it('ftag08_deletes_a_tag', async () => {
    fetchMock.mockResolvedValue(jsonResponse(204, null));

    await expect(deleteTag('t1')).resolves.toBeUndefined();

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/tags/t1');
    expect(init.method).toBe('DELETE');
  });
});
