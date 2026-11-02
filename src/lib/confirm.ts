import { Alert, Platform } from 'react-native';

type ConfirmDestructiveOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
};

/**
 * Cross-platform confirmation for a destructive action: a native destructive
 * alert on iOS/Android, a browser confirm on web.
 */
export function confirmDestructive({
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
}: ConfirmDestructiveOptions): void {
  if (Platform.OS === 'web') {
    const confirm = (globalThis as { confirm?: (text: string) => boolean }).confirm;
    if (confirm?.(`${title}\n\n${message}`)) {
      onConfirm();
    }
    return;
  }

  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: onConfirm },
  ]);
}
