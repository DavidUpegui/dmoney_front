import { Stack, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { MovementForm } from '@/components/movement-form';
import { Screen } from '@/components/screen';
import { useCreateMovement } from '@/lib/movements';
import { spacing } from '@/theme';
import { errorMessage } from '@/utils/error-message';

export default function NewMovementScreen() {
  const { back } = useRouter();
  const createMovement = useCreateMovement();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'New movement',
          presentation: 'formSheet',
          sheetAllowedDetents: [0.9],
          sheetGrabberVisible: true,
        }}
      />
      <Screen scroll>
        <View style={styles.container}>
          <MovementForm
            submitLabel="Create"
            submitting={createMovement.isPending}
            error={createMovement.error != null ? errorMessage(createMovement.error) : undefined}
            onSubmit={(values) =>
              createMovement.mutate(values, { onSuccess: () => back() })
            }
          />
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.lg,
  },
});
