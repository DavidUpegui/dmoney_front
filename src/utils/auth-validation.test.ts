import {
  normalizeEmail,
  validateEmail,
  validateName,
  validatePassword,
} from './auth-validation';

describe('auth validation', () => {
  it('fauth05_normalizes_an_email', () => {
    expect(normalizeEmail('  A@B.COM ')).toBe('a@b.com');
  });

  it('fauth05_rejects_a_blank_email', () => {
    expect(validateEmail('   ')).toBeDefined();
  });

  it('fauth05_rejects_a_malformed_email', () => {
    expect(validateEmail('not-an-email')).toBeDefined();
  });

  it('fauth05_rejects_an_email_over_255_characters', () => {
    expect(validateEmail(`${'a'.repeat(250)}@b.com`)).toBe(
      'Email must be 255 characters or fewer',
    );
  });

  it('fauth05_accepts_a_valid_email', () => {
    expect(validateEmail('a@b.com')).toBeUndefined();
  });

  it('fauth05_requires_a_non_blank_password', () => {
    expect(validatePassword('')).toBeDefined();
    expect(validatePassword('   ')).toBeDefined();
  });

  it('fauth05_rejects_a_password_shorter_than_eight_characters', () => {
    expect(validatePassword('short')).toBe('Password must be at least 8 characters');
  });

  it('fauth05_accepts_a_password_with_eight_characters', () => {
    expect(validatePassword('secret123')).toBeUndefined();
  });

  it('fauth05_rejects_an_invalid_name', () => {
    expect(validateName('')).toBeDefined();
    expect(validateName('A'.repeat(101))).toBeDefined();
  });

  it('fauth05_accepts_a_valid_name', () => {
    expect(validateName('Alice')).toBeUndefined();
  });
});
