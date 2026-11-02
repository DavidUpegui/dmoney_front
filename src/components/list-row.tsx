import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useColors } from '@/lib/theme';
import { layout, radius, spacing } from '@/theme';
import { Icon } from './icon';
import { ThemedText } from './themed-text';

type ListRowProps = {
  title: string;
  subtitle?: string;
  value?: string;
  destructive?: boolean;
  chevron?: boolean;
  divider?: boolean;
  icon?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
};

export function ListRow({
  title,
  subtitle,
  value,
  destructive = false,
  chevron = false,
  divider = false,
  icon,
  trailing,
  onPress,
}: ListRowProps) {
  const colors = useColors();

  const content = (
    <View style={styles.content}>
      {icon != null ? (
        <View style={[styles.iconTile, { backgroundColor: colors.sunken }]}>{icon}</View>
      ) : null}
      <View style={styles.text}>
        <ThemedText variant="rowTitle" tone={destructive ? 'danger' : 'default'}>
          {title}
        </ThemedText>
        {subtitle != null ? (
          <ThemedText variant="caption" tone="secondary" numberOfLines={1}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {value != null ? (
        <ThemedText variant="numeric" tone="secondary">
          {value}
        </ThemedText>
      ) : null}
      {trailing}
      {chevron ? <Icon name="chevron" size={16} tone="faint" /> : null}
    </View>
  );

  const rowStyle = [
    styles.row,
    divider && styles.divider,
    { borderTopColor: colors.hairline },
  ];

  if (onPress == null) {
    return <View style={rowStyle}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [rowStyle, pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: layout.rowMinHeight,
    justifyContent: 'center',
    paddingVertical: layout.rowPaddingV,
    paddingHorizontal: layout.rowPaddingH,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
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
    gap: 1,
  },
  pressed: {
    opacity: 0.6,
  },
});
