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

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  name: string;
};

export type RegisterResponse = {
  userId: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  type: CategoryType;
};

export type Subcategory = {
  categoryId: string;
  subcategoryId: string;
  subcategoryName: string;
  subcategoryDescription: string;
};

export type CreateCategoryRequest = {
  name: string;
  description?: string;
  type: CategoryType;
};

export type EditCategoryRequest = {
  name?: string;
  description?: string;
  type?: CategoryType;
};

export type CreateSubcategoryRequest = {
  name: string;
  description?: string;
};

export type EditSubcategoryRequest = {
  name?: string;
  description?: string;
};

export type Tag = {
  id: string;
  name: string;
  description: string;
};

export type CreateTagRequest = {
  name: string;
  description?: string;
};

export type EditTagRequest = {
  name?: string;
  description?: string;
};

export type Movement = {
  movementId: string;
  categoryId: string;
  subcategoryId: string;
  amount: number;
  type: MovementType;
  description: string;
  date: string;
  tagIds: string[];
};

export type CreateMovementRequest = {
  categoryId: string;
  subcategoryId: string;
  amount: number;
  type: MovementType;
  description?: string;
  date: string;
  tagIds?: string[];
};

export type EditMovementRequest = Partial<CreateMovementRequest>;

export type MovementFilters = {
  categoryIds?: string[];
  subcategoryIds?: string[];
  tagIds?: string[];
  type?: MovementType;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
};

export interface TokenStore {
  get(): Promise<string | null>;
  set(token: string): Promise<void>;
  clear(): Promise<void>;
}
