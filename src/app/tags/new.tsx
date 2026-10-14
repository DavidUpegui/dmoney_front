import { Stack, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/screen';
import { TagForm } from '@/components/tag-form';
import { useCreateTag } from '@/lib/tags';
import { spacing } from '@/theme';
import { errorMessage } from '@/utils/error-message';

export default function NewTagScreen() {
  const { back } = useRouter();
  const createTag = useCreateTag();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'New tag',
          presentation: 'formSheet',
          sheetAllowedDetents: [0.6],
          sheetGrabberVisible: true,
        }}
      />
      <Screen grouped scroll>
        <View style={styles.container}>
          <TagForm
            submitLabel="Create"
            submitting={createTag.isPending}
            error={
              createTag.error != null
                ? errorMessage(createTag.error, {
                    409: 'A tag with that name already exists',
                  })
                : undefined
            }
            onSubmit={(values) => createTag.mutate(values, { onSuccess: () => back() })}
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
