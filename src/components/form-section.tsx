import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, layout, radius, spacing } from '@/theme';
import { ThemedText } from './themed-text';

type FormSectionProps = {
  title?: string;
  footer?: string;
  children: ReactNode;
};

export function FormSection({ title, footer, children }: FormSectionProps) {
  return (
    <View style={styles.wrapper}>
      {title != null ? (
        <ThemedText variant="caption" style={styles.header}>
          {title}
        </ThemedText>
      ) : null}
      <View style={styles.section}>{children}</View>
      {footer != null ? (
        <ThemedText variant="caption" style={styles.footer}>
          {footer}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  header: {
    marginLeft: spacing.xs,
  },
  section: {
    backgroundColor: colors.groupedCell,
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    padding: layout.fieldGap,
    gap: layout.fieldGap,
  },
  footer: {
    marginLeft: spacing.xs,
  },
});
