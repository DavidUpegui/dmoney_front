import type { Movement } from '@/types';

import { countActiveFilters, dayNet, hasActiveFilters } from './movement-filters';

function movement(partial: Partial<Movement>): Movement {
  return {
    movementId: 'm',
    categoryId: 'c',
    subcategoryId: 's',
    amount: 1000,
    type: 'OUTCOME',
    description: '',
    date: '2026-10-08',
    tagIds: [],
    ...partial,
  };
}

describe('countActiveFilters', () => {
  it('returns 0 for empty filters', () => {
    expect(countActiveFilters({})).toBe(0);
    expect(hasActiveFilters({})).toBe(false);
  });

  it('counts each active dimension once', () => {
    expect(
      countActiveFilters({
        search: 'lunch',
        type: 'OUTCOME',
        categoryIds: ['a', 'b'],
        tagIds: ['t'],
        dateFrom: '2026-10-01',
      }),
    ).toBe(5);
    expect(hasActiveFilters({ search: 'x' })).toBe(true);
  });

  it('ignores blank search and empty arrays', () => {
    expect(countActiveFilters({ search: '   ', categoryIds: [], tagIds: [] })).toBe(0);
  });
});

describe('dayNet', () => {
  it('sums income minus outcome, excluding transfers', () => {
    expect(
      dayNet([
        movement({ type: 'INCOME', amount: 5000 }),
        movement({ type: 'OUTCOME', amount: 1200 }),
        movement({ type: 'TRANSFER', amount: 900 }),
      ]),
    ).toBe(3800);
  });

  it('is zero for empty or transfer-only days', () => {
    expect(dayNet([])).toBe(0);
    expect(dayNet([movement({ type: 'TRANSFER', amount: 500 })])).toBe(0);
  });
});
