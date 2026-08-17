import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { sampleLevels, sampleSongs } from '@/lib/curriculum/sample-data';
import { Song } from '@/lib/curriculum/types';

function SongCard({ song }: { song: Song }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const levels = sampleLevels.filter((level) => song.levelIds.includes(level.id));
  const isPending = song.licenseStatus === 'pendiente_revision_humana';

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
      <View style={styles.cardHeader}>
        <ThemedText type="subtitle">{t(song.title)}</ThemedText>
        <View
          style={[
            styles.badge,
            { backgroundColor: isPending ? theme.backgroundSelected : theme.accent },
          ]}>
          <ThemedText type="label" style={{ color: isPending ? theme.textSecondary : theme.accentOn }}>
            {song.source === 'dominio_publico' ? t('canciones.publicDomain') : t('canciones.licensed')}
          </ThemedText>
        </View>
      </View>

      {isPending && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.pendingNote}>
          {t('canciones.pendingReview')}
        </ThemedText>
      )}

      <View style={styles.levelRow}>
        {levels.map((level) => (
          <View key={level.id} style={[styles.levelChip, { borderColor: theme.border }]}>
            <ThemedText type="small">{t(level.title)}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function CancionesScreen() {
  const { t } = useTranslation();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <ThemedText type="title">{t('canciones.title')}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t('canciones.subtitle')}
          </ThemedText>
        </View>

        <FlatList
          data={sampleSongs}
          keyExtractor={(song) => song.id}
          renderItem={({ item }) => <SongCard song={item} />}
          contentContainerStyle={styles.list}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
    gap: Spacing.half,
  },
  list: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
  },
  card: {
    borderRadius: Radii.md,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  badge: {
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: 5,
  },
  pendingNote: {
    fontStyle: 'italic',
  },
  levelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  levelChip: {
    borderWidth: 1,
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
  },
});
