import { Stack, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CategoryForm } from '@/components/category-form';
import { Screen } from '@/components/screen';
import { useCreateCategory } from '@/lib/categories';
import { spacing } from '@/theme';
import { errorMessage } from '@/utils/error-message';

export default function NewCategoryScreen() {
  const { back } = useRouter();
  const createCategory = useCreateCategory();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'New category',
          presentation: 'formSheet',
          sheetAllowedDetents: [0.75],
          sheetGrabberVisible: true,
        }}
      />
      <Screen grouped scroll>
        <View style={styles.container}>
          <CategoryForm
            submitLabel="Create"
            submitting={createCategory.isPending}
            error={
              createCategory.error != null
                ? errorMessage(createCategory.error, {
                    409: 'A category with that name already exists',
                  })
                : undefined
            }
            onSubmit={(values) =>
              createCategory.mutate(values, { onSuccess: () => back() })
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
