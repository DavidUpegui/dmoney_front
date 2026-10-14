import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';
import type { CategoryType } from '@/types';
import { ThemedText } from './themed-text';

type TypeBadgeProps = {
  type: CategoryType;
};

const LABELS: Record<CategoryType, string> = {
  INCOME: 'Income',
  OUTCOME: 'Outcome',
};

export function TypeBadge({ type }: TypeBadgeProps) {
  const tone = type === 'INCOME' ? colors.income : colors.outcome;

  return (
    <View style={[styles.badge, { borderColor: tone }]}>
      <ThemedText variant="caption" style={{ color: tone }}>
        {LABELS[type]}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
});
