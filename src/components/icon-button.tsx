import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { radius, spacing } from '@/theme';
import { Icon, type IconName } from './icon';

type IconButtonProps = {
  name: IconName;
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
      <Icon name={name} size={24} tone={disabled ? 'faint' : 'default'} />
    </Pressable>
  );
}
