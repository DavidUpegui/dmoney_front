import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radius, shadows, spacing } from '@/theme';

export function Card({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    boxShadow: shadows.card,
    padding: spacing.md,
  },
});
