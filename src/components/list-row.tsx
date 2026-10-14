import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, control, spacing } from '@/theme';
import { ThemedText } from './themed-text';

type ListRowProps = {
  title: string;
  subtitle?: string;
  value?: string;
  destructive?: boolean;
  chevron?: boolean;
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
  icon,
  trailing,
  onPress,
}: ListRowProps) {
  const content = (
    <View style={styles.content}>
      {icon != null ? <View style={styles.icon}>{icon}</View> : null}
      <View style={styles.text}>
        <ThemedText variant="body" style={destructive ? styles.destructive : undefined}>
          {title}
        </ThemedText>
        {subtitle != null ? <ThemedText variant="caption">{subtitle}</ThemedText> : null}
      </View>
      {value != null ? <ThemedText variant="subhead">{value}</ThemedText> : null}
      {trailing}
      {chevron ? (
        <ThemedText variant="subhead" style={styles.chevron}>
          {'\u203A'}
        </ThemedText>
      ) : null}
    </View>
  );

  if (onPress == null) {
    return <View style={styles.row}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: control.md,
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: {
    width: 28,
    alignItems: 'center',
  },
  text: {
    flex: 1,
    gap: spacing.xs,
  },
  destructive: {
    color: colors.danger,
  },
  chevron: {
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.6,
  },
});
