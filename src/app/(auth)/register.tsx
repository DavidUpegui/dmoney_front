import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BrandMark } from '@/components/brand-mark';
import { Button } from '@/components/button';
import { FormBanner } from '@/components/form-banner';
import { FormSection } from '@/components/form-section';
import { Screen } from '@/components/screen';
import { TextInput } from '@/components/text-input';
import { ThemedText } from '@/components/themed-text';
import { useRegister } from '@/lib/auth';
import { colors, layout, spacing } from '@/theme';
import {
  normalizeEmail,
  validateEmail,
  validateName,
  validatePassword,
} from '@/utils/auth-validation';
import { errorMessage } from '@/utils/error-message';

type FieldErrors = { name?: string; email?: string; password?: string };

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const signUp = useRegister();

  const submit = () => {
    const nextErrors: FieldErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(nextErrors);
    if (nextErrors.name != null || nextErrors.email != null || nextErrors.password != null) {
      return;
    }

    const normalizedEmail = normalizeEmail(email);
    signUp.mutate(
      { email: normalizedEmail, password, name: name.trim() },
      {
        onSuccess: () => {
          router.replace({
            pathname: '/(auth)/login',
            params: { email: normalizedEmail, registered: '1' },
          });
        },
      },
    );
  };

  const serverError =
    signUp.error != null
      ? errorMessage(signUp.error, { 409: 'That email is already registered' })
      : undefined;

  return (
    <Screen grouped>
      <View style={styles.container}>
        <View style={styles.brand}>
          <BrandMark subtitle="Create your account" />
        </View>

        {serverError != null ? <FormBanner message={serverError} /> : null}

        <FormSection>
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            error={errors.name}
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
          />
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
            autoComplete="password-new"
            secureTextEntry
            textContentType="newPassword"
            onSubmitEditing={submit}
          />
        </FormSection>

        <Button title="Create account" size="lg" loading={signUp.isPending} onPress={submit} />

        <View style={styles.footer}>
          <ThemedText variant="subhead">Already have an account? </ThemedText>
          <Link href="/(auth)/login" style={styles.link}>
            <ThemedText variant="subhead" style={styles.linkText}>
              Sign in
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
  linkText: {
    color: colors.primary,
  },
});
