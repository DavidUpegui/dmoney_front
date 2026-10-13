import { ApiError } from '@/types';

const DEFAULT_MESSAGE = 'Something went wrong. Please try again.';

/**
 * Maps a thrown error to a user-facing message, preferring the back-end
 * `message` and falling back to a per-status override then a generic default.
 */
export function errorMessage(
  error: unknown,
  overrides: Record<number, string> = {},
): string {
  if (error instanceof ApiError) {
    return error.message || overrides[error.status] || DEFAULT_MESSAGE;
  }
  if (error instanceof Error) {
    return error.message || DEFAULT_MESSAGE;
  }
  return DEFAULT_MESSAGE;
}
