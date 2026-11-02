import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { darkColors, lightColors, type ColorTokens } from '@/theme';

export type ColorScheme = 'light' | 'dark';

type ThemeValue = {
  colors: ColorTokens;
  scheme: ColorScheme;
  isDark: boolean;
};

const FALLBACK: ThemeValue = { colors: lightColors, scheme: 'light', isDark: false };

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const scheme: ColorScheme = systemScheme === 'dark' ? 'dark' : 'light';

  const value = useMemo<ThemeValue>(
    () => ({
      colors: scheme === 'dark' ? darkColors : lightColors,
      scheme,
      isDark: scheme === 'dark',
    }),
    [scheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  return useContext(ThemeContext) ?? FALLBACK;
}

export function useColors(): ColorTokens {
  return useTheme().colors;
}

export function useThemedStyles<T>(factory: (colors: ColorTokens) => T): T {
  const colors = useColors();
  return useMemo(() => factory(colors), [colors, factory]);
}
