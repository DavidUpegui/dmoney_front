import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColors } from '@/lib/theme';
import { control, layout, radius, spacing } from '@/theme';
import { ThemedText } from './themed-text';

type HeaderProps = {
  title: string;
  action?: ReactNode;
};

export function Header({ title, action }: HeaderProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.canvas,
          paddingTop: insets.top + spacing.xs,
          paddingLeft: insets.left + layout.screenPadding,
          paddingRight: insets.right + layout.screenPadding,
        },
      ]}
    >
      <ThemedText variant="title" style={styles.title} numberOfLines={1}>
        {title}
      </ThemedText>
      {action}
    </View>
  );
}

type HeaderActionProps = {
  label: string;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export function HeaderAction({ label, onPress, accessibilityLabel }: HeaderActionProps) {
  const colors = useColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      hitSlop={spacing.xs}
      style={({ pressed }) => [
        styles.action,
        { backgroundColor: colors.primary },
        pressed && styles.pressed,
      ]}
    >
      <ThemedText variant="buttonSmall" tone="onPrimary">
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    flex: 1,
  },
  action: {
    minHeight: control.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: radius.full,
    borderCurve: 'continuous',
  },
  pressed: {
    opacity: 0.8,
  },
});
