import { Pressable, StyleSheet, View } from 'react-native';

import { useColors } from '@/lib/theme';
import { radius } from '@/theme';
import { Icon } from './icon';
import { ThemedText } from './themed-text';

type FilterButtonProps = {
  count: number;
  onPress: () => void;
  style?: object;
};

export function FilterButton({ count, onPress, style }: FilterButtonProps) {
  const colors = useColors();
  const active = count > 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={active ? `Filters, ${count} active` : 'Filters'}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.surface, borderColor: colors.hairline },
        pressed && styles.pressed,
        style,
      ]}
    >
      <Icon name="filter" size={20} tone="secondary" />
      {active ? (
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <ThemedText variant="numericSmall" tone="onPrimary">
            {count}
          </ThemedText>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
