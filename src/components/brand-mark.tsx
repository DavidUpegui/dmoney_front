import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';
import { ThemedText } from './themed-text';

type BrandMarkProps = {
  subtitle?: string;
};

export function BrandMark({ subtitle }: BrandMarkProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.badge}>
        <ThemedText variant="title" style={styles.badgeText}>
          d
        </ThemedText>
      </View>
      <ThemedText variant="largeTitle">dmoney</ThemedText>
      {subtitle != null ? (
        <ThemedText variant="subhead" style={styles.subtitle}>
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
    width: 56,
    height: 56,
    borderRadius: radius.full,
    borderCurve: 'continuous',
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  badgeText: {
    color: colors.onPrimary,
  },
  subtitle: {
    textAlign: 'center',
  },
});
