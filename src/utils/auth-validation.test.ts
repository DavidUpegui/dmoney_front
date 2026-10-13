import {
  normalizeEmail,
  validateEmail,
  validateName,
  validatePassword,
} from './auth-validation';

describe('auth validation', () => {
  it('trims and lowercases an email', () => {
    expect(normalizeEmail('  A@B.COM ')).toBe('a@b.com');
  });

  it('requires a non-blank email', () => {
    expect(validateEmail('   ')).toBeDefined();
  });

  it('rejects a malformed email', () => {
    expect(validateEmail('not-an-email')).toBeDefined();
  });

  it('accepts a valid email', () => {
    expect(validateEmail('a@b.com')).toBeUndefined();
  });

  it('requires a non-blank password but allows any characters', () => {
    expect(validatePassword('')).toBeDefined();
    expect(validatePassword('   ')).toBeDefined();
    expect(validatePassword('secret')).toBeUndefined();
  });

  it('requires a non-blank name of at most 100 characters', () => {
    expect(validateName('')).toBeDefined();
    expect(validateName('A'.repeat(101))).toBeDefined();
    expect(validateName('Alice')).toBeUndefined();
  });
});
