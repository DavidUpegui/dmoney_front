import { useState } from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  type StyleProp,
  type ViewStyle,
  View,
} from 'react-native';

import { useColors } from '@/lib/theme';
import { radius, spacing, type } from '@/theme';
import { Icon } from './icon';

type SearchFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
};

export function SearchField({
  value,
  onChangeText,
  placeholder = 'Search',
  style,
}: SearchFieldProps) {
  const colors = useColors();
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.sunken,
          borderColor: focused ? colors.primary : colors.hairline,
        },
        style,
      ]}
    >
      <Icon name="search" size={16} tone="faint" />
      <RNTextInput
        accessibilityLabel="Search"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.input, { color: colors.ink }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  input: {
    ...type.subhead,
    flex: 1,
    paddingVertical: 0,
  },
});
