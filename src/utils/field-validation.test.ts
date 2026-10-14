import { validateDescription, validateName } from './field-validation';

describe('field validation', () => {
  it('requires a non-blank name', () => {
    expect(validateName('')).toBe('Name is required');
    expect(validateName('   ')).toBe('Name is required');
  });

  it('accepts a valid name', () => {
    expect(validateName('Groceries')).toBeUndefined();
  });

  it('rejects a name over 100 characters', () => {
    expect(validateName('a'.repeat(101))).toBe('Name must be 100 characters or fewer');
  });

  it('accepts a short description', () => {
    expect(validateDescription('Food')).toBeUndefined();
  });

  it('rejects a description over 255 characters', () => {
    expect(validateDescription('a'.repeat(256))).toBe(
      'Description must be 255 characters or fewer',
    );
  });
});
