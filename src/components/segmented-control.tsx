import { Pressable, StyleSheet, View } from 'react-native';

import { useColors } from '@/lib/theme';
import { radius, shadows, type ColorTokens } from '@/theme';
import { ThemedText, type ThemedTextTone } from './themed-text';

type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
  toneForValue?: (value: T) => ThemedTextTone;
  showDot?: boolean;
};

const TONE: Partial<Record<ThemedTextTone, keyof ColorTokens>> = {
  default: 'ink',
  secondary: 'inkSecondary',
  primary: 'primary',
  income: 'income',
  outcome: 'outcome',
  transfer: 'transfer',
  danger: 'danger',
  onPrimary: 'onPrimary',
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
  toneForValue,
  showDot = false,
}: SegmentedControlProps<T>) {
  const colors = useColors();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.sunken, borderColor: colors.hairline }]}
      accessibilityLabel={accessibilityLabel}
    >
      {options.map((option) => {
        const selected = option.value === value;
        const tone = selected ? (toneForValue?.(option.value) ?? 'default') : 'secondary';
        const dotColor = colors[TONE[tone] ?? 'ink'];

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            hitSlop={{ top: 3, bottom: 3 }}
            style={({ pressed }) => [
              styles.segment,
              selected && { backgroundColor: colors.surface, boxShadow: shadows.card },
              pressed && styles.pressed,
            ]}
          >
            {showDot ? (
              <View
                style={[
                  styles.dot,
                  { backgroundColor: selected ? dotColor : 'transparent' },
                ]}
              />
            ) : null}
            <ThemedText variant="chip" tone={tone}>
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    borderWidth: 1,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    paddingHorizontal: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
  },
  pressed: {
    opacity: 0.7,
  },
});
