import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useMutation } from '@tanstack/react-query';

import { login as loginRequest, register as registerRequest } from '@/lib/api/auth';
import { setUnauthorizedHandler } from '@/lib/api/client';
import { tokenStore } from '@/lib/api/token-store';
import type { LoginRequest, RegisterRequest } from '@/types';

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    tokenStore
      .get()
      .then((stored) => {
        if (!active) return;
        setToken(stored);
        setIsLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      void tokenStore.clear();
      setToken(null);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const signIn = async (next: string) => {
    await tokenStore.set(next);
    setToken(next);
  };

  const signOut = async () => {
    await tokenStore.clear();
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: token != null, isLoading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (value == null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return value;
}

export function useLogin() {
  const { signIn } = useAuth();
  return useMutation({
    mutationFn: (credentials: LoginRequest) => loginRequest(credentials),
    onSuccess: async ({ token }) => {
      await signIn(token);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterRequest) => registerRequest(input),
  });
}
