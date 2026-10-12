import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';
import { Button } from './button';
import { ThemedText } from './themed-text';

type EmptyStateProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <ThemedText variant="body" style={styles.message}>
        {message}
      </ThemedText>
      {actionLabel != null && onAction != null && <Button title={actionLabel} onPress={onAction} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  message: {
    textAlign: 'center',
  },
});
