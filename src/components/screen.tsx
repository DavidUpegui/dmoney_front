import { type ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  grouped?: boolean;
};

export function Screen({ children, style, grouped = false }: ScreenProps) {
  return (
    <SafeAreaView
      style={[styles.safe, grouped && styles.grouped, style]}
      edges={['top', 'left', 'right', 'bottom']}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: layout.screenPadding,
  },
  grouped: {
    backgroundColor: colors.groupedSurface,
  },
});
