import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, type StyleProp, type ViewStyle, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColors } from '@/lib/theme';
import { layout, spacing } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  scroll?: boolean;
  header?: ReactNode;
};

export function Screen({ children, style, scroll = false, header }: ScreenProps) {
  const colors = useColors();
  const hasHeader = header != null;

  return (
    <View style={[styles.root, { backgroundColor: colors.canvas }]}>
      {header}

      <SafeAreaView
        style={styles.flex}
        edges={hasHeader ? ['left', 'right', 'bottom'] : ['top', 'left', 'right', 'bottom']}
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.xxl,
  },
  flex: {
    flex: 1,
  },
});
