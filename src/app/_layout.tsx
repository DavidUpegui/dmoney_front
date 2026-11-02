import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import {
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider as NavigationThemeProvider,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Spinner } from '@/components/spinner';
import { AuthProvider, useAuth } from '@/lib/auth';
import { queryClient } from '@/lib/query-client';
import { ThemeProvider, useColors, useTheme } from '@/lib/theme';

function RootNavigator() {
  const { isLoading, isAuthenticated } = useAuth();
  const colors = useColors();

  if (isLoading) {
    return (
      <View style={[styles.splash, { backgroundColor: colors.canvas }]}>
        <Spinner />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="categories" />
        <Stack.Screen name="tags" />
        <Stack.Screen name="movements" />
      </Stack.Protected>
      <Stack.Screen name="dev/ui" options={{ headerShown: false }} />
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

function ThemedApp() {
  const { colors, scheme, isDark } = useTheme();

  const navigationTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      dark: isDark,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.canvas,
        card: colors.surface,
        text: colors.ink,
        border: colors.hairline,
        notification: colors.danger,
      },
    };
  }, [colors, isDark]);

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RootNavigator />
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        </AuthProvider>
      </QueryClientProvider>
    </NavigationThemeProvider>
  );
}

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
