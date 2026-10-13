const EMAIL_PATTERN = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;
const NAME_MAX_LENGTH = 100;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateEmail(email: string): string | undefined {
  const value = email.trim();
  if (value.length === 0) {
    return 'Email is required';
  }
  if (!EMAIL_PATTERN.test(value)) {
    return 'Enter a valid email';
  }
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (password.trim().length === 0) {
    return 'Password is required';
  }
  return undefined;
}

export function validateName(name: string): string | undefined {
  const value = name.trim();
  if (value.length === 0) {
    return 'Name is required';
  }
  if (value.length > NAME_MAX_LENGTH) {
    return `Name must be ${NAME_MAX_LENGTH} characters or fewer`;
  }
  return undefined;
}
