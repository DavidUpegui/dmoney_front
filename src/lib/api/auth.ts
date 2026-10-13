import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/types';

import { api } from './client';

export function login(body: LoginRequest): Promise<LoginResponse> {
  return api.post<LoginResponse>('/auth/login', body);
}

export function register(body: RegisterRequest): Promise<RegisterResponse> {
  return api.post<RegisterResponse>('/auth/register', body);
}
