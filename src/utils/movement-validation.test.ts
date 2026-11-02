import {
  todayIsoDate,
  validateAmount,
  validateCategoryId,
  validateDate,
  validateMovementDescription,
  validateSubcategoryId,
} from './movement-validation';

describe('movement validation', () => {
  it('requires a category and subcategory', () => {
    expect(validateCategoryId('')).toBe('Select a category');
    expect(validateCategoryId('c1')).toBeUndefined();
    expect(validateSubcategoryId('')).toBe('Select a subcategory');
    expect(validateSubcategoryId('s1')).toBeUndefined();
  });

  it('requires a positive amount', () => {
    expect(validateAmount('')).toBe('Enter an amount');
    expect(validateAmount('abc')).toBe('Enter a valid amount');
    expect(validateAmount('0')).toBe('Amount must be greater than 0');
    expect(validateAmount('-5')).toBe('Amount must be greater than 0');
    expect(validateAmount('42.5')).toBeUndefined();
    expect(validateAmount('42,5')).toBeUndefined();
  });

  it('requires a yyyy-MM-dd date', () => {
    expect(validateDate('2026-10-08')).toBeUndefined();
    expect(validateDate('2026/10/08')).toBe('Use the format YYYY-MM-DD');
    expect(validateDate('')).toBe('Use the format YYYY-MM-DD');
  });

  it('caps the description at 500 characters', () => {
    expect(validateMovementDescription('Lunch')).toBeUndefined();
    expect(validateMovementDescription('a'.repeat(501))).toBe(
      'Description must be 500 characters or fewer',
    );
  });

  it('formats today as yyyy-MM-dd', () => {
    expect(todayIsoDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
