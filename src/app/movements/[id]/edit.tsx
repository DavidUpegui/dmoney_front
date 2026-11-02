import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ErrorState } from '@/components/error-state';
import { MovementForm } from '@/components/movement-form';
import { Screen } from '@/components/screen';
import { Spinner } from '@/components/spinner';
import { confirmDestructive } from '@/lib/confirm';
import { useDeleteMovement, useEditMovement, useMovement } from '@/lib/movements';
import { spacing } from '@/theme';
import { errorMessage } from '@/utils/error-message';

export default function EditMovementScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { back } = useRouter();
  const movement = useMovement(id);
  const editMovement = useEditMovement();
  const deleteMovement = useDeleteMovement();

  const onDelete = () => {
    confirmDestructive({
      title: 'Delete movement',
      message: 'This movement will be permanently removed.',
      onConfirm: () => deleteMovement.mutate(id, { onSuccess: () => back() }),
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit movement',
          presentation: 'formSheet',
          sheetAllowedDetents: [0.9],
          sheetGrabberVisible: true,
        }}
      />
      <Screen scroll>
        <View style={styles.container}>
          {movement.isLoading ? (
            <Spinner />
          ) : movement.isError || movement.data == null ? (
            <ErrorState
              message={errorMessage(movement.error)}
              onRetry={() => void movement.refetch()}
            />
          ) : (
            <MovementForm
              defaultValues={movement.data}
              submitLabel="Save"
              submitting={editMovement.isPending}
              error={
                editMovement.error != null ? errorMessage(editMovement.error) : undefined
              }
              onDelete={onDelete}
              deleting={deleteMovement.isPending}
              onSubmit={(values) =>
                editMovement.mutate({ id, body: values }, { onSuccess: () => back() })
              }
            />
          )}
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
