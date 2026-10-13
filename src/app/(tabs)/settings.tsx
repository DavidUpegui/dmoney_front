import { Alert, Platform, StyleSheet, View } from 'react-native';

import { FormSection } from '@/components/form-section';
import { ListRow } from '@/components/list-row';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/lib/auth';
import { layout, spacing } from '@/theme';

export default function SettingsScreen() {
  const { signOut } = useAuth();

  const confirmSignOut = () => {
    if (Platform.OS === 'web') {
      void signOut();
      return;
    }
    Alert.alert('Cerrar sesión', '¿Seguro que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: () => void signOut() },
    ]);
  };

  return (
    <Screen grouped>
      <View style={styles.container}>
        <ThemedText variant="largeTitle">Settings</ThemedText>

        <FormSection title="Account">
          <ListRow title="You are signed in" />
        </FormSection>

        <FormSection>
          <ListRow title="Cerrar sesión" destructive onPress={confirmSignOut} />
        </FormSection>
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
});
