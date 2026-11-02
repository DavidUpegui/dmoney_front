import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useColors } from '@/lib/theme';
import { layout, radius, spacing } from '@/theme';
import { ThemedText } from './themed-text';

type FormSectionProps = {
  title?: string;
  headerTrailing?: ReactNode;
  footer?: string;
  children: ReactNode;
};

/**
 * Padded card for form fields. For lists of rows use ListGroup.
 */
export function FormSection({ title, headerTrailing, footer, children }: FormSectionProps) {
  const colors = useColors();
  const showHeader = title != null || headerTrailing != null;

  return (
    <View style={styles.wrapper}>
      {showHeader ? (
        <View style={styles.header}>
          {title != null ? (
            <ThemedText variant="label" tone="secondary">
              {title}
            </ThemedText>
          ) : (
            <View />
          )}
          {headerTrailing}
        </View>
      ) : null}
      <View
        style={[
          styles.section,
          { backgroundColor: colors.surface, borderColor: colors.hairline },
        ]}
      >
        {children}
      </View>
      {footer != null ? (
        <ThemedText variant="caption" tone="faint" style={styles.footer}>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  section: {
    borderRadius: radius.xl,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    padding: layout.cardPadding,
    gap: layout.fieldGap,
  },
  footer: {
    marginLeft: spacing.xs,
  },
});
