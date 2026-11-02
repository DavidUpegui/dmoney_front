import { StyleSheet, View } from 'react-native';

import { useColors } from '@/lib/theme';
import { radius, withAlpha } from '@/theme';
import { formatAmount } from '@/utils/format';
import { ThemedText } from './themed-text';

type BalanceSummaryProps = {
  amount: number;
};

export function BalanceSummary({ amount }: BalanceSummaryProps) {
  const colors = useColors();
  const color = amount > 0 ? colors.income : amount < 0 ? colors.outcome : colors.inkSecondary;
  const sign = amount > 0 ? '+' : amount < 0 ? '\u2212' : '';

  return (
    <View style={[styles.pill, { backgroundColor: withAlpha(color, 0.1) }]}>
      <ThemedText variant="numericSmall" style={{ color }}>
        {sign.length > 0 ? `${sign}${formatAmount(Math.abs(amount))}` : formatAmount(0)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderCurve: 'continuous',
  },
});
