import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ErrorState } from '@/components/error-state';
import { Screen } from '@/components/screen';
import { Spinner } from '@/components/spinner';
import { SubcategoryForm } from '@/components/subcategory-form';
import {
  useDeleteSubcategory,
  useEditSubcategory,
  useSubcategories,
} from '@/lib/categories';
import { confirmDestructive } from '@/lib/confirm';
import { spacing } from '@/theme';
import { errorMessage } from '@/utils/error-message';

export default function EditSubcategoryScreen() {
  const { id, subcategoryId } = useLocalSearchParams<{ id: string; subcategoryId: string }>();
  const { back } = useRouter();
  const subcategories = useSubcategories(id);
  const editSubcategory = useEditSubcategory();
  const deleteSubcategory = useDeleteSubcategory();

  const subcategory = (subcategories.data ?? []).find(
    (item) => item.subcategoryId === subcategoryId,
  );

  const onDelete = () => {
    confirmDestructive({
      title: 'Delete subcategory',
      message: `Delete "${subcategory?.subcategoryName ?? 'this subcategory'}"?`,
      onConfirm: () =>
        deleteSubcategory.mutate(
          { categoryId: id, subcategoryId },
          { onSuccess: () => back() },
        ),
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit subcategory',
          presentation: 'formSheet',
          sheetAllowedDetents: [0.6],
          sheetGrabberVisible: true,
        }}
      />
      <Screen scroll>
        <View style={styles.container}>
          {subcategories.isLoading ? (
            <Spinner />
          ) : subcategories.isError || subcategory == null ? (
            <ErrorState
              message={
                subcategories.isError
                  ? errorMessage(subcategories.error)
                  : 'Subcategory not found'
              }
              onRetry={() => void subcategories.refetch()}
            />
          ) : (
            <SubcategoryForm
              defaultValues={{
                name: subcategory.subcategoryName,
                description: subcategory.subcategoryDescription,
              }}
              submitLabel="Save"
              submitting={editSubcategory.isPending}
              error={
                editSubcategory.error != null
                  ? errorMessage(editSubcategory.error)
                  : deleteSubcategory.error != null
                    ? errorMessage(deleteSubcategory.error, {
                        409: 'This subcategory still has movements',
                      })
                    : undefined
              }
              onDelete={onDelete}
              deleting={deleteSubcategory.isPending}
              onSubmit={(values) =>
                editSubcategory.mutate(
                  { categoryId: id, subcategoryId, body: values },
                  { onSuccess: () => back() },
                )
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
