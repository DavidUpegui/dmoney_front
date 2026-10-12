import {
  StyleSheet,
  TextInput as RNTextInput,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
  View,
} from 'react-native';

import { colors, radius, spacing, type } from '@/theme';
import { ThemedText } from './themed-text';

type TextInputFieldProps = TextInputProps & {
  label: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export function TextInput({ label, error, containerStyle, style, ...props }: TextInputFieldProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <ThemedText variant="subhead">{label}</ThemedText>
      <RNTextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.textSecondary}
        style={[styles.input, error != null && styles.inputError, style]}
        {...props}
      />
      {error != null && (
        <ThemedText variant="caption" style={styles.error}>
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  input: {
    ...type.body,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    color: colors.danger,
  },
});
