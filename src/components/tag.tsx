import { Pressable, StyleSheet, View } from 'react-native';

import { useColors } from '@/lib/theme';
import { radius } from '@/theme';
import { Icon } from './icon';
import { ThemedText } from './themed-text';

type TagProps = {
  label: string;
  size?: 'sm' | 'md';
  onRemove?: () => void;
};

export function Tag({ label, size = 'sm', onRemove }: TagProps) {
  const colors = useColors();
  const removable = onRemove != null;

  return (
    <View
      style={[
        styles.tag,
        size === 'sm' ? styles.sm : styles.md,
        { backgroundColor: colors.sunken, borderColor: colors.hairline },
      ]}
    >
      <ThemedText variant="caption" tone="secondary">
        #{label}
      </ThemedText>
      {removable ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
          onPress={onRemove}
          hitSlop={15}
        >
          <Icon name="close" size={14} tone="faint" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: 'continuous',
    alignSelf: 'flex-start',
  },
  sm: {
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.xs,
  },
  md: {
    gap: 6,
    height: 30,
    paddingHorizontal: 9,
    borderRadius: radius.sm,
  },
});
