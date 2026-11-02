import { ActivityIndicator, Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { useColors } from '@/lib/theme';
import { control, radius, spacing, type ColorTokens } from '@/theme';
import { ThemedText, type ThemedTextTone } from './themed-text';

type Variant = 'primary' | 'secondary' | 'destructive' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const sizeStyles = {
  sm: { minHeight: control.sm, paddingHorizontal: spacing.md },
  md: { minHeight: control.md, paddingHorizontal: spacing.lg },
  lg: { minHeight: control.lg, paddingHorizontal: spacing.lg },
} as const;

type ButtonProps = {
  title: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

function paletteFor(
  colors: ColorTokens,
  variant: Variant,
): { background: string; border: string; tone: ThemedTextTone } {
  switch (variant) {
    case 'primary':
      return { background: colors.primary, border: colors.primary, tone: 'onPrimary' };
    case 'destructive':
      return { background: colors.danger, border: colors.danger, tone: 'onPrimary' };
    case 'secondary':
      return { background: colors.sunken, border: colors.hairline, tone: 'default' };
    case 'ghost':
      return { background: 'transparent', border: 'transparent', tone: 'primary' };
  }
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  accessibilityLabel,
  style,
  onPress,
}: ButtonProps) {
  const colors = useColors();
  const { background, border, tone } = paletteFor(colors, variant);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: !!(disabled || loading), busy: !!loading }}
      disabled={disabled || loading}
      onPress={onPress}
      hitSlop={size === 'sm' ? spacing.xs : undefined}
      style={({ pressed }) => [
        {
          backgroundColor: background,
          borderColor: border,
          borderWidth: 1,
          borderRadius: radius.lg,
          borderCurve: 'continuous',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.4 : pressed ? 0.78 : 1,
          ...sizeStyles[size],
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={tone === 'onPrimary' ? colors.onPrimary : colors.primary} />
      ) : (
        <ThemedText variant="button" tone={tone}>
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}
