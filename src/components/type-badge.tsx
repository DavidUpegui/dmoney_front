import { StyleSheet, View } from 'react-native';

import { useColors } from '@/lib/theme';
import { radius, spacing } from '@/theme';
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
  const colors = useColors();
  const tone = type === 'INCOME' ? colors.income : colors.outcome;

  return (
    <View style={[styles.badge, { borderColor: tone }]}>
      <ThemedText variant="chip" style={{ color: tone }}>
        {LABELS[type]}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: radius.full,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
});
