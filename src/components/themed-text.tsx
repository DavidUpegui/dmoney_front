import { Text, type TextProps } from 'react-native';

import { type } from '@/theme';

export type ThemedTextVariant = keyof typeof type;

type ThemedTextProps = TextProps & {
  variant?: ThemedTextVariant;
};

export function ThemedText({ variant = 'body', style, ...props }: ThemedTextProps) {
  return <Text style={[type[variant], style]} {...props} />;
}
