import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { FormSection } from '@/components/form-section';
import { ListRow } from '@/components/list-row';
import { Screen } from '@/components/screen';
import { Spinner } from '@/components/spinner';
import { ThemedText } from '@/components/themed-text';
import { useTags } from '@/lib/tags';
import { layout, spacing } from '@/theme';
import { errorMessage } from '@/utils/error-message';

export default function TagsScreen() {
  const { push } = useRouter();
  const tags = useTags();

  return (
    <Screen grouped>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText variant="largeTitle">Tags</ThemedText>
          <Button
            title="+"
            accessibilityLabel="New tag"
            variant="secondary"
            size="sm"
            onPress={() => push('/tags/new')}
          />
        </View>

        {tags.isLoading ? (
          <View style={styles.center}>
            <Spinner />
          </View>
        ) : tags.isError ? (
          <ErrorState message={errorMessage(tags.error)} onRetry={() => void tags.refetch()} />
        ) : (tags.data ?? []).length === 0 ? (
          <EmptyState
            message="No tags yet"
            actionLabel="New tag"
            onAction={() => push('/tags/new')}
          />
        ) : (
          <FormSection>
            {(tags.data ?? []).map((tag) => (
              <ListRow
                key={tag.id}
                title={tag.name}
                subtitle={tag.description.length > 0 ? tag.description : undefined}
                chevron
                onPress={() => push(`/tags/${tag.id}/edit`)}
              />
            ))}
          </FormSection>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: spacing.lg,
    gap: layout.sectionGap,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
