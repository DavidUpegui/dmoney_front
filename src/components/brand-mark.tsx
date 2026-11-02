import { StyleSheet, View } from 'react-native';

import { useColors } from '@/lib/theme';
import { radius, spacing } from '@/theme';
import { ThemedText } from './themed-text';

type BrandMarkProps = {
  subtitle?: string;
};

export function BrandMark({ subtitle }: BrandMarkProps) {
  const colors = useColors();

  return (
    <View style={styles.wrapper}>
      <View style={[styles.badge, { backgroundColor: colors.primary }]}>
        <ThemedText variant="title" tone="onPrimary">
          d
        </ThemedText>
      </View>
      <ThemedText variant="largeTitle">dmoney</ThemedText>
      {subtitle != null ? (
        <ThemedText variant="subhead" tone="secondary" style={styles.subtitle}>
          {subtitle}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  badge: {
    width: 60,
    height: 60,
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
  },
});
