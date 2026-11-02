import {
  createMovement,
  deleteMovement,
  editMovement,
  getMovement,
  listMovements,
} from './movements';
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

function queryOf(url: string): URLSearchParams {
  return new URLSearchParams(url.split('?')[1] ?? '');
}

const movement = {
  movementId: 'm1',
  categoryId: 'c1',
  subcategoryId: 's1',
  amount: 42.5,
  type: 'OUTCOME',
  description: 'Lunch',
  date: '2026-10-08',
  tagIds: [],
};

describe('movements api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.mockReset();
    mockedTokenStore.get.mockResolvedValue(null);
  });

  it('fmov01_gets_movements_without_params', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, []));

    await listMovements();

    const [url] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/movements');
  });

  it('fmov03_serializes_filters', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, []));

    await listMovements({
      categoryIds: ['a', 'b'],
      subcategoryIds: ['s1'],
      tagIds: ['x'],
      type: 'OUTCOME',
      dateFrom: '2026-07-01',
      dateTo: '2026-07-31',
      search: '  taxi  ',
    });

    const [url] = fetchMock.mock.calls[0];
    expect(url.startsWith('http://localhost:8080/api/movements?')).toBe(true);
    const params = queryOf(url);
    expect(params.getAll('categoryIds')).toEqual(['a', 'b']);
    expect(params.getAll('subcategoryIds')).toEqual(['s1']);
    expect(params.getAll('tagIds')).toEqual(['x']);
    expect(params.get('type')).toBe('OUTCOME');
    expect(params.get('dateFrom')).toBe('2026-07-01');
    expect(params.get('dateTo')).toBe('2026-07-31');
    expect(params.get('search')).toBe('taxi');
  });

  it('fmov06_gets_a_movement_by_id', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, movement));

    await expect(getMovement('m1')).resolves.toMatchObject({ movementId: 'm1' });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/movements/m1');
    expect(init.method).toBeUndefined();
  });

  it('fmov05_posts_a_movement', async () => {
    fetchMock.mockResolvedValue(jsonResponse(201, movement));

    await createMovement({
      categoryId: 'c1',
      subcategoryId: 's1',
      amount: 42.5,
      type: 'OUTCOME',
      date: '2026-10-08',
    });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/movements');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toMatchObject({ amount: 42.5, type: 'OUTCOME' });
  });

  it('fmov06_patches_a_movement', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, movement));

    await editMovement('m1', { amount: 50 });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/movements/m1');
    expect(init.method).toBe('PATCH');
    expect(JSON.parse(init.body)).toEqual({ amount: 50 });
  });

  it('fmov07_deletes_a_movement', async () => {
    fetchMock.mockResolvedValue(jsonResponse(204, null));

    await expect(deleteMovement('m1')).resolves.toBeUndefined();

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/movements/m1');
    expect(init.method).toBe('DELETE');
  });
});
