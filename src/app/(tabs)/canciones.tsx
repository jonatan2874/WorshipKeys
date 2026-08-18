import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { sampleLevels, sampleSongs } from '@/lib/curriculum/sample-data';
import { Song } from '@/lib/curriculum/types';

type SourceFilter = 'todas' | Song['source'];

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
  const theme = useTheme();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('todas');

  // Filtro real (no decorativo): por título y por origen de la canción —
  // ambos son datos que ya existen en `Song`, sin inventar categorías.
  const filteredSongs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sampleSongs.filter((song) => {
      if (sourceFilter !== 'todas' && song.source !== sourceFilter) return false;
      if (q && !t(song.title).toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, sourceFilter, t]);

  const filters: { key: SourceFilter; labelKey: string }[] = [
    { key: 'todas', labelKey: 'canciones.filterAll' },
    { key: 'dominio_publico', labelKey: 'canciones.publicDomain' },
    { key: 'licenciada', labelKey: 'canciones.licensed' },
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <ThemedText type="title">{t('canciones.title')}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t('canciones.subtitle')}
          </ThemedText>
        </View>

        <View style={styles.searchWrap}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('canciones.searchPlaceholder')}
            placeholderTextColor={theme.textSecondary}
            style={[styles.search, { backgroundColor: theme.backgroundElement, color: theme.text, borderColor: theme.border }]}
          />
        </View>

        <View style={styles.filters}>
          {filters.map((f) => {
            const active = sourceFilter === f.key;
            return (
              <Pressable
                key={f.key}
                onPress={() => setSourceFilter(f.key)}
                style={[
                  styles.filterChip,
                  { borderColor: theme.border },
                  active && { backgroundColor: theme.accent, borderColor: theme.accentStrong },
                ]}>
                <ThemedText type="smallBold" style={active ? { color: theme.accentOn } : undefined}>
                  {t(f.labelKey)}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        <FlatList
          data={filteredSongs}
          keyExtractor={(song) => song.id}
          renderItem={({ item }) => <SongCard song={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <ThemedText type="small" themeColor="textSecondary" style={styles.emptyText}>
              {t('canciones.noResults')}
            </ThemedText>
          }
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
  searchWrap: { paddingHorizontal: Spacing.four, marginBottom: Spacing.two },
  search: {
    borderWidth: 1.5,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 14,
  },
  filters: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.three,
  },
  filterChip: {
    borderWidth: 1.5,
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  emptyText: { textAlign: 'center', marginTop: Spacing.six },
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
