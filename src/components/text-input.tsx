import { useState } from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
  View,
} from 'react-native';

import { useColors } from '@/lib/theme';
import { radius, type } from '@/theme';
import { ThemedText } from './themed-text';

type TextInputFieldProps = TextInputProps & {
  label: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export function TextInput({
  label,
  error,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}: TextInputFieldProps) {
  const colors = useColors();
  const [focused, setFocused] = useState(false);

  const borderColor = error != null ? colors.danger : focused ? colors.primary : colors.hairline;

  return (
    <View style={[styles.container, containerStyle]}>
      <ThemedText variant="label" tone="secondary">
        {label}
      </ThemedText>
      <RNTextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.placeholder}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[
          styles.input,
          {
            backgroundColor: colors.sunken,
            borderColor,
            color: colors.ink,
          },
          props.multiline && styles.multiline,
          style,
        ]}
        {...props}
      />
      {error != null ? (
        <ThemedText variant="caption" tone="danger">
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  input: {
    ...type.body,
    minHeight: 48,
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
});
