const DESCRIPTION_MAX_LENGTH = 500;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function validateCategoryId(value: string): string | undefined {
  return value.length === 0 ? 'Select a category' : undefined;
}

export function validateSubcategoryId(value: string): string | undefined {
  return value.length === 0 ? 'Select a subcategory' : undefined;
}

export function validateAmount(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return 'Enter an amount';
  }
  const amount = Number(trimmed.replace(',', '.'));
  if (Number.isNaN(amount)) {
    return 'Enter a valid amount';
  }
  if (amount <= 0) {
    return 'Amount must be greater than 0';
  }
  return undefined;
}

export function validateDate(value: string): string | undefined {
  const trimmed = value.trim();
  if (!DATE_PATTERN.test(trimmed)) {
    return 'Use the format YYYY-MM-DD';
  }
  const parsed = new Date(`${trimmed}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return 'Enter a valid date';
  }
  return undefined;
}

export function validateMovementDescription(value: string): string | undefined {
  if (value.trim().length > DESCRIPTION_MAX_LENGTH) {
    return `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer`;
  }
  return undefined;
}

export function todayIsoDate(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}
