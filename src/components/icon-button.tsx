import { type ComponentProps } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { colors, radius, spacing } from '@/theme';

type SymbolName = ComponentProps<typeof SymbolView>['name'];

type IconButtonProps = {
  name: SymbolName;
  accessibilityLabel: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  name,
  accessibilityLabel,
  onPress,
  disabled,
  style,
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={spacing.sm}
      style={({ pressed }) => [
        {
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          borderRadius: radius.full,
          opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      <SymbolView name={name} tintColor={colors.text} size={24} />
    </Pressable>
  );
}
