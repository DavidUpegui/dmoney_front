import {
  createCategory,
  createSubcategory,
  deleteCategory,
  deleteSubcategory,
  editCategory,
  editSubcategory,
  getCategory,
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

const category = { id: '1', name: 'Food', description: '', type: 'OUTCOME' };
const subcategory = {
  categoryId: '1',
  subcategoryId: 's1',
  subcategoryName: 'Vegetables',
  subcategoryDescription: '',
};

describe('categories api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.mockReset();
    mockedTokenStore.get.mockResolvedValue(null);
  });

  it('fcat01_gets_the_category_list', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, [category]));

    await expect(listCategories()).resolves.toHaveLength(1);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/categories');
    expect(init.method).toBeUndefined();
  });

  it('fcat04_gets_a_category_by_id', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, category));

    await expect(getCategory('1')).resolves.toMatchObject({ id: '1' });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/categories/1');
    expect(init.method).toBeUndefined();
  });

  it('fcat03_posts_a_new_category', async () => {
    fetchMock.mockResolvedValue(jsonResponse(201, category));

    await createCategory({ name: 'Food', type: 'OUTCOME' });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/categories');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({ name: 'Food', type: 'OUTCOME' });
  });

  it('fcat04_patches_a_category', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, category));

    await editCategory('1', { name: 'Food' });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/categories/1');
    expect(init.method).toBe('PATCH');
    expect(JSON.parse(init.body)).toEqual({ name: 'Food' });
  });

  it('fcat05_deletes_a_category', async () => {
    fetchMock.mockResolvedValue(jsonResponse(204, null));

    await expect(deleteCategory('1')).resolves.toBeUndefined();

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/categories/1');
    expect(init.method).toBe('DELETE');
  });

  it('fcat06_gets_subcategories', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, [subcategory]));

    await expect(listSubcategories('1')).resolves.toHaveLength(1);

    const [url] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/categories/1/subcategories');
  });

  it('fcat07_posts_a_subcategory', async () => {
    fetchMock.mockResolvedValue(jsonResponse(201, subcategory));

    await createSubcategory('1', { name: 'Vegetables' });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/categories/1/subcategories');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({ name: 'Vegetables' });
  });

  it('fcat08_patches_a_subcategory', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, subcategory));

    await editSubcategory('1', 's1', { name: 'Vegetables' });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/categories/1/subcategories/s1');
    expect(init.method).toBe('PATCH');
    expect(JSON.parse(init.body)).toEqual({ name: 'Vegetables' });
  });

  it('fcat09_deletes_a_subcategory', async () => {
    fetchMock.mockResolvedValue(jsonResponse(204, null));

    await expect(deleteSubcategory('1', 's1')).resolves.toBeUndefined();

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/categories/1/subcategories/s1');
    expect(init.method).toBe('DELETE');
  });
});
