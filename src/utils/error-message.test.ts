import { ApiError } from '../types';
import { errorMessage } from './error-message';

describe('errorMessage', () => {
  it('prefers the back-end message', () => {
    expect(errorMessage(new ApiError(400, 'Bad Request', 'Name is required'))).toBe(
      'Name is required',
    );
  });

  it('falls back to a per-status override when the message is empty', () => {
    expect(
      errorMessage(new ApiError(401, 'Unauthorized', ''), { 401: 'Credenciales inválidas' }),
    ).toBe('Credenciales inválidas');
  });

  it('falls back to a generic message for unknown errors', () => {
    expect(errorMessage(undefined)).toMatch(/something went wrong/i);
  });
});
