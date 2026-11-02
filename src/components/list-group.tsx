import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useColors } from '@/lib/theme';
import { radius, spacing } from '@/theme';
import { ThemedText } from './themed-text';

type ListGroupProps = {
  title?: string;
  headerTrailing?: ReactNode;
  footer?: string;
  children: ReactNode;
};

/**
 * Container for list rows: one card, rows divided by hairlines.
 * Rows own their padding; do not add fields directly, use FormSection.
 */
export function ListGroup({ title, headerTrailing, footer, children }: ListGroupProps) {
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
    overflow: 'hidden',
  },
  footer: {
    marginLeft: spacing.xs,
  },
});
