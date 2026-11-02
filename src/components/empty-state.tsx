import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';
import { Button } from './button';
import { Icon } from './icon';
import { ThemedText } from './themed-text';

type EmptyStateProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Icon name="tag" size={40} tone="faint" strokeWidth={1.6} />
      <ThemedText variant="body" tone="secondary" style={styles.message}>
        {message}
      </ThemedText>
      {actionLabel != null && onAction != null && (
        <Button title={actionLabel} onPress={onAction} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xxl,
  },
  message: {
    textAlign: 'center',
    maxWidth: 280,
  },
});
