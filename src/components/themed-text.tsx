import { Text, type TextProps } from 'react-native';

import { useColors } from '@/lib/theme';
import { type, type ColorTokens } from '@/theme';

export type ThemedTextVariant = keyof typeof type;

export type ThemedTextTone =
  | 'default'
  | 'secondary'
  | 'faint'
  | 'primary'
  | 'income'
  | 'outcome'
  | 'transfer'
  | 'danger'
  | 'onPrimary';

const TONE: Record<ThemedTextTone, keyof ColorTokens> = {
  default: 'ink',
  secondary: 'inkSecondary',
  faint: 'inkFaint',
  primary: 'primary',
  income: 'income',
  outcome: 'outcome',
  transfer: 'transfer',
  danger: 'danger',
  onPrimary: 'onPrimary',
};

type ThemedTextProps = TextProps & {
  variant?: ThemedTextVariant;
  tone?: ThemedTextTone;
};

export function ThemedText({ variant = 'body', tone = 'default', style, ...props }: ThemedTextProps) {
  const colors = useColors();
  return <Text style={[type[variant], { color: colors[TONE[tone]] }, style]} {...props} />;
}
