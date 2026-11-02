import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/screen';
import { SubcategoryForm } from '@/components/subcategory-form';
import { useCreateSubcategory } from '@/lib/categories';
import { spacing } from '@/theme';
import { errorMessage } from '@/utils/error-message';

export default function NewSubcategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { back } = useRouter();
  const createSubcategory = useCreateSubcategory();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'New subcategory',
          presentation: 'formSheet',
          sheetAllowedDetents: [0.6],
          sheetGrabberVisible: true,
        }}
      />
      <Screen scroll>
        <View style={styles.container}>
          <SubcategoryForm
            submitLabel="Create"
            submitting={createSubcategory.isPending}
            error={
              createSubcategory.error != null
                ? errorMessage(createSubcategory.error)
                : undefined
            }
            onSubmit={(values) =>
              createSubcategory.mutate(
                { categoryId: id, body: values },
                { onSuccess: () => back() },
              )
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
