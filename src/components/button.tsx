import { ActivityIndicator, Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, spacing } from '@/theme';
import { ThemedText } from './themed-text';

type Variant = 'primary' | 'secondary' | 'destructive' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const variantStyles = {
  primary: { backgroundColor: colors.primary, color: colors.onPrimary },
  secondary: { backgroundColor: colors.surfaceSecondary, color: colors.text },
  destructive: { backgroundColor: colors.danger, color: colors.onPrimary },
  ghost: { backgroundColor: 'transparent', color: colors.primary },
} as const;

const sizeStyles = {
  sm: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm },
  md: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  lg: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
} as const;

type ButtonProps = {
  title: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  style,
  onPress,
}: ButtonProps) {
  const palette = variantStyles[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!(disabled || loading), busy: !!loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: palette.backgroundColor,
          borderRadius: radius.md,
          borderCurve: 'continuous',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
          ...sizeStyles[size],
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.color} />
      ) : (
        <ThemedText variant="headline" style={{ color: palette.color }}>
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}
