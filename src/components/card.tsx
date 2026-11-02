import { StyleSheet, View, type ViewProps } from 'react-native';

import { useColors } from '@/lib/theme';
import { layout, radius } from '@/theme';

export function Card({ style, ...props }: ViewProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.hairline },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    padding: layout.cardPadding,
  },
});
