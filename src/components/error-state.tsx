import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';
import { Button } from './button';
import { ThemedText } from './themed-text';

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <ThemedText variant="headline">Something went wrong</ThemedText>
      <ThemedText variant="body" tone="secondary" selectable style={styles.message}>
        {message}
      </ThemedText>
      {onRetry != null && <Button title="Retry" variant="secondary" onPress={onRetry} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  message: {
    textAlign: 'center',
    maxWidth: 320,
  },
});
