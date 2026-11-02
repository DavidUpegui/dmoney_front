import { Pressable, StyleSheet } from 'react-native';

import { useColors } from '@/lib/theme';
import { radius, spacing } from '@/theme';
import { ThemedText } from './themed-text';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Chip({ label, selected = false, onPress }: ChipProps) {
  const colors = useColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : colors.surface,
          borderColor: selected ? colors.primary : colors.hairline,
        },
        pressed && styles.pressed,
      ]}
    >
      <ThemedText variant="chip" tone={selected ? 'onPrimary' : 'secondary'}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 32,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});
