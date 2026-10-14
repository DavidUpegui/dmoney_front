import {
  createCategory,
  deleteSubcategory,
  listCategories,
  listSubcategories,
} from './categories';
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

describe('categories api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.mockReset();
    mockedTokenStore.get.mockResolvedValue(null);
  });

  it('GETs the category list', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(200, [{ id: '1', name: 'Food', description: '', type: 'OUTCOME' }]),
    );

    await expect(listCategories()).resolves.toHaveLength(1);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/categories');
    expect(init.method).toBeUndefined();
  });

  it('POSTs a new category', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(201, { id: '1', name: 'Food', description: '', type: 'OUTCOME' }),
    );

    await createCategory({ name: 'Food', type: 'OUTCOME' });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/categories');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({ name: 'Food', type: 'OUTCOME' });
  });

  it('GETs subcategories for a category', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, []));

    await listSubcategories('cat-1');

    const [url] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/categories/cat-1/subcategories');
  });

  it('DELETEs a subcategory', async () => {
    fetchMock.mockResolvedValue(jsonResponse(204, null));

    await expect(deleteSubcategory('cat-1', 'sub-1')).resolves.toBeUndefined();

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(
      'http://localhost:8080/api/categories/cat-1/subcategories/sub-1',
    );
    expect(init.method).toBe('DELETE');
  });
});
