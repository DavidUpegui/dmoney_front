import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, type StyleProp, type ViewStyle, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  grouped?: boolean;
  scroll?: boolean;
};

export function Screen({ children, style, grouped = false, scroll = false }: ScreenProps) {
  return (
    <SafeAreaView
      style={[styles.safe, grouped && styles.grouped]}
      edges={['top', 'left', 'right', 'bottom']}
    >
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, style]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.flex, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  grouped: {
    backgroundColor: colors.groupedSurface,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
  },
  flex: {
    flex: 1,
  },
});
