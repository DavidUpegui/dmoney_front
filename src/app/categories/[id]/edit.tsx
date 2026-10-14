import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CategoryForm } from '@/components/category-form';
import { ErrorState } from '@/components/error-state';
import { Screen } from '@/components/screen';
import { Spinner } from '@/components/spinner';
import { useCategory, useEditCategory } from '@/lib/categories';
import { spacing } from '@/theme';
import { errorMessage } from '@/utils/error-message';

export default function EditCategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { back } = useRouter();
  const category = useCategory(id);
  const editCategory = useEditCategory();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit category',
          presentation: 'formSheet',
          sheetAllowedDetents: [0.75],
          sheetGrabberVisible: true,
        }}
      />
      <Screen grouped scroll>
        <View style={styles.container}>
          {category.isLoading ? (
            <Spinner />
          ) : category.isError || category.data == null ? (
            <ErrorState
              message={errorMessage(category.error)}
              onRetry={() => void category.refetch()}
            />
          ) : (
            <CategoryForm
              defaultValues={{
                name: category.data.name,
                description: category.data.description,
                type: category.data.type,
              }}
              submitLabel="Save"
              submitting={editCategory.isPending}
              error={
                editCategory.error != null
                  ? errorMessage(editCategory.error, {
                      409: 'A category with that name already exists',
                    })
                  : undefined
              }
              onSubmit={(values) =>
                editCategory.mutate({ id, body: values }, { onSuccess: () => back() })
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
