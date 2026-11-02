import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ErrorState } from '@/components/error-state';
import { Screen } from '@/components/screen';
import { Spinner } from '@/components/spinner';
import { TagForm } from '@/components/tag-form';
import { confirmDestructive } from '@/lib/confirm';
import { useDeleteTag, useEditTag, useTag } from '@/lib/tags';
import { spacing } from '@/theme';
import { errorMessage } from '@/utils/error-message';

export default function EditTagScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { back } = useRouter();
  const tag = useTag(id);
  const editTag = useEditTag();
  const deleteTag = useDeleteTag();

  const onDelete = () => {
    confirmDestructive({
      title: 'Delete tag',
      message: `Delete "${tag.data?.name ?? 'this tag'}"?`,
      onConfirm: () => deleteTag.mutate(id, { onSuccess: () => back() }),
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit tag',
          presentation: 'formSheet',
          sheetAllowedDetents: [0.6],
          sheetGrabberVisible: true,
        }}
      />
      <Screen scroll>
        <View style={styles.container}>
          {tag.isLoading ? (
            <Spinner />
          ) : tag.isError || tag.data == null ? (
            <ErrorState message={errorMessage(tag.error)} onRetry={() => void tag.refetch()} />
          ) : (
            <TagForm
              defaultValues={{ name: tag.data.name, description: tag.data.description }}
              submitLabel="Save"
              submitting={editTag.isPending}
              error={
                editTag.error != null
                  ? errorMessage(editTag.error, {
                      409: 'A tag with that name already exists',
                    })
                  : undefined
              }
              onDelete={onDelete}
              deleting={deleteTag.isPending}
              onSubmit={(values) => editTag.mutate({ id, body: values }, { onSuccess: () => back() })}
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
