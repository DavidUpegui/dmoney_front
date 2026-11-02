import { useEffect, useRef, useState } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BrandMark } from '@/components/brand-mark';
import { Button } from '@/components/button';
import { FormBanner } from '@/components/form-banner';
import { FormSection } from '@/components/form-section';
import { Screen } from '@/components/screen';
import { TextInput } from '@/components/text-input';
import { ThemedText } from '@/components/themed-text';
import { useLogin } from '@/lib/auth';
import { layout, spacing } from '@/theme';
import { normalizeEmail, validateEmail, validatePassword } from '@/utils/auth-validation';
import { errorMessage } from '@/utils/error-message';

const DEV_EMAIL = process.env.EXPO_PUBLIC_DEV_EMAIL ?? 'emailprueba@gmail.com';
const DEV_PASSWORD = process.env.EXPO_PUBLIC_DEV_PASSWORD ?? 'password';
const DEV_AUTO_LOGIN = process.env.EXPO_PUBLIC_DEV_AUTO_LOGIN === '1';
const useDevCredentials = __DEV__ && process.env.NODE_ENV !== 'test';

export default function LoginScreen() {
  const params = useLocalSearchParams<{ email?: string; registered?: string }>();
  const [email, setEmail] = useState(
    params.email ?? (useDevCredentials ? DEV_EMAIL : ''),
  );
  const [password, setPassword] = useState(useDevCredentials ? DEV_PASSWORD : '');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const login = useLogin();
  const autoLoginTried = useRef(false);

  useEffect(() => {
    if (
      !useDevCredentials ||
      !DEV_AUTO_LOGIN ||
      autoLoginTried.current ||
      params.registered != null
    ) {
      return;
    }
    autoLoginTried.current = true;
    login.mutate({ email: normalizeEmail(DEV_EMAIL), password: DEV_PASSWORD });
  }, [login, params.registered]);

  const submit = () => {
    const nextErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(nextErrors);
    if (nextErrors.email != null || nextErrors.password != null) {
      return;
    }
    login.mutate({ email: normalizeEmail(email), password });
  };

  const serverError =
    login.error != null
      ? errorMessage(login.error, { 401: 'Credenciales inválidas' })
      : undefined;

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.brand}>
          <BrandMark subtitle="Sign in to track every peso" />
        </View>

        {params.registered != null ? (
          <FormBanner tone="success" message="Account created. Please sign in." />
        ) : null}
        {serverError != null ? <FormBanner message={serverError} /> : null}

        <FormSection>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            autoCapitalize="none"
            autoComplete="password"
            secureTextEntry
            textContentType="password"
            onSubmitEditing={submit}
          />
        </FormSection>

        <Button title="Sign in" size="lg" loading={login.isPending} onPress={submit} />

        <View style={styles.footer}>
          <ThemedText variant="subhead">Don{'\u2019'}t have an account? </ThemedText>
          <Link href="/(auth)/register" style={styles.link}>
            <ThemedText variant="subhead" tone="primary">
              Create one
            </ThemedText>
          </Link>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: layout.sectionGap,
  },
  brand: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    marginLeft: spacing.xs,
  },
  devHint: {
    textAlign: 'center',
  },
  devLink: {
    alignSelf: 'center',
  },
});
