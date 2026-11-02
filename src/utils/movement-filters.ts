import type { Movement, MovementFilters } from '@/types';

export function countActiveFilters(filters: MovementFilters): number {
  let count = 0;
  if ((filters.search?.trim().length ?? 0) > 0) count += 1;
  if (filters.type != null) count += 1;
  if ((filters.categoryIds?.length ?? 0) > 0) count += 1;
  if ((filters.subcategoryIds?.length ?? 0) > 0) count += 1;
  if ((filters.tagIds?.length ?? 0) > 0) count += 1;
  if ((filters.dateFrom?.length ?? 0) > 0) count += 1;
  if ((filters.dateTo?.length ?? 0) > 0) count += 1;
  return count;
}

export function hasActiveFilters(filters: MovementFilters): boolean {
  return countActiveFilters(filters) > 0;
}

export function dayNet(movements: Movement[]): number {
  return movements.reduce((total, movement) => {
    if (movement.type === 'INCOME') return total + movement.amount;
    if (movement.type === 'OUTCOME') return total - movement.amount;
    return total;
  }, 0);
}
