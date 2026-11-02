import { Pressable, StyleSheet, View } from 'react-native';

import { useColors } from '@/lib/theme';
import { layout, radius, spacing } from '@/theme';
import type { Movement } from '@/types';
import { AmountText } from './amount-text';
import { Icon } from './icon';
import { Tag } from './tag';
import { ThemedText } from './themed-text';

type MovementRowProps = {
  movement: Movement;
  categoryName: string;
  subcategoryName?: string;
  tagNames: string[];
  divider?: boolean;
  onPress?: () => void;
};

export function MovementRow({
  movement,
  categoryName,
  subcategoryName,
  tagNames,
  divider = false,
  onPress,
}: MovementRowProps) {
  const colors = useColors();

  const title = subcategoryName ?? categoryName;
  const meta = [
    subcategoryName != null ? categoryName : undefined,
    movement.description.length > 0 ? movement.description : undefined,
  ].filter((value): value is string => value != null);


  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title} ${movement.description}`.trim()}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        divider && styles.divider,
        { borderTopColor: colors.hairline },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.iconTile, { backgroundColor: colors.sunken }]}>
        <Icon name="tag" size={18} tone="faint" />
      </View>
      <View style={styles.text}>
        <ThemedText variant="rowTitle">{title}</ThemedText>
        {meta.length > 0 ? (
          <ThemedText variant="caption" tone="secondary" numberOfLines={1}>
            {meta.join('  ·  ')}
          </ThemedText>
        ) : null}
        {tagNames.length > 0 ? (
          <View style={styles.tags}>
            {tagNames.map((name) => (
              <Tag key={name} label={name} />
            ))}
          </View>
        ) : null}
      </View>
      <AmountText amount={movement.amount} type={movement.type} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: layout.rowMinHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    paddingVertical: layout.rowPaddingV,
    paddingHorizontal: layout.rowPaddingH,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  iconTile: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderCurve: 'continuous',
  },
  text: {
    flex: 1,
    gap: 2,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.6,
  },
});
