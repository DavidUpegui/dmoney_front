export class ApiError extends Error {
  readonly status: number;
  readonly error: string;
  readonly timestamp: string;

  constructor(
    status: number,
    error: string,
    message: string,
    timestamp = new Date().toISOString(),
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.error = error;
    this.timestamp = timestamp;
  }
}

export type CategoryType = 'INCOME' | 'OUTCOME';

export type MovementType = 'INCOME' | 'OUTCOME' | 'TRANSFER';

export interface TokenStore {
  get(): Promise<string | null>;
  set(token: string): Promise<void>;
  clear(): Promise<void>;
}
