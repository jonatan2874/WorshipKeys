import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconCheck, IconClose } from '@/components/icons';
import { PressButton } from '@/components/press-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Radii, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { sampleLevels } from '@/lib/curriculum/sample-data';

type PlanId = 'monthly' | 'annual';

const FEATURE_KEYS = ['stages', 'mic', 'library', 'sync'] as const;
const TITHE_KEYS = ['maintain', 'scholarships', 'gospel'] as const;
const TITHE_EMOJI: Record<(typeof TITHE_KEYS)[number], string> = {
  maintain: '🧰',
  scholarships: '🎁',
  gospel: '✝️',
};

export default function PaywallScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { signInWithGoogle } = useAuth();
  const { levelId } = useLocalSearchParams<{ levelId?: string }>();
  const [plan, setPlan] = useState<PlanId>('annual');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const level = sampleLevels.find((l) => l.id === levelId);

  function safeBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch {
      setError(t('paywall.signInError'));
      setBusy(false);
      return;
    }
    setBusy(false);
    router.replace(levelId ? `/leccion?levelId=${levelId}` : '/');
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topRow}>
          <Pressable onPress={safeBack} hitSlop={12} style={[styles.closeButton, { backgroundColor: theme.backgroundElement }]}>
            <IconClose size={13} color={theme.text} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.hero}>
            <View style={[styles.heroIcon, { backgroundColor: theme.accent }]}>
              <ThemedText style={styles.heroEmoji}>🔓</ThemedText>
            </View>
            <ThemedText type="title" style={styles.heroTitle}>
              {t('paywall.title')}
            </ThemedText>
            <ThemedText type="default" themeColor="textSecondary" style={styles.heroSubtitle}>
              {level ? t('paywall.subtitleForLevel', { title: t(level.title) }) : t('paywall.subtitle')}
            </ThemedText>
          </View>

          <View style={styles.featureList}>
            {FEATURE_KEYS.map((key) => (
              <View key={key} style={styles.featureRow}>
                <View style={[styles.featureCheck, { backgroundColor: theme.backgroundSelected }]}>
                  <IconCheck size={12} color={theme.accentStrong} />
                </View>
                <ThemedText type="small" style={styles.featureText}>
                  {t(`paywall.feature.${key}`)}
                </ThemedText>
              </View>
            ))}
          </View>

          <View style={styles.plans}>
            <PlanCard
              id="monthly"
              title={t('paywall.planMonthly')}
              detail={t('paywall.planMonthlyDetail')}
              price="$9.99"
              period={t('paywall.perMonth')}
              selected={plan === 'monthly'}
              onPress={() => setPlan('monthly')}
            />
            <PlanCard
              id="annual"
              title={t('paywall.planAnnual')}
              detail={t('paywall.planAnnualDetail')}
              price="$59.99"
              period={t('paywall.perYear')}
              badge={t('paywall.planAnnualBadge')}
              selected={plan === 'annual'}
              onPress={() => setPlan('annual')}
            />
          </View>

          <ThemedText type="small" themeColor="textSecondary" style={styles.notActiveNote}>
            {t('paywall.paymentsNotActive')}
          </ThemedText>

          <View style={[styles.titheCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <View style={styles.titheHead}>
              <View style={[styles.titheHeadIcon, { backgroundColor: theme.done }]}>
                <ThemedText style={styles.titheHeadEmoji}>🕊️</ThemedText>
              </View>
              <View style={styles.titheHeadText}>
                <ThemedText type="subtitle" style={styles.titheHeadTitle}>
                  {t('paywall.titheTitle')}
                </ThemedText>
                <ThemedText type="label" themeColor="textSecondary" style={styles.titheSubtitle}>
                  {t('paywall.titheSubtitle')}
                </ThemedText>
              </View>
            </View>
            <View style={styles.titheRows}>
              {TITHE_KEYS.map((key, i) => (
                <View key={key} style={[styles.titheRow, i > 0 && { borderTopColor: theme.border, borderTopWidth: 1 }]}>
                  <View style={[styles.titheRowIcon, { backgroundColor: theme.background, borderColor: theme.border }]}>
                    <ThemedText style={styles.titheRowEmoji}>{TITHE_EMOJI[key]}</ThemedText>
                  </View>
                  <View style={styles.titheRowText}>
                    <ThemedText type="smallBold">{t(`paywall.tithe.${key}.title`)}</ThemedText>
                    <ThemedText type="label" themeColor="textSecondary" style={styles.titheRowDesc}>
                      {t(`paywall.tithe.${key}.desc`)}
                    </ThemedText>
                  </View>
                  <ThemedText type="smallBold" style={{ color: theme.doneStrong }}>
                    {t(`paywall.tithe.${key}.pct`)}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>

          {error && (
            <ThemedText type="small" style={[styles.error, { color: theme.doneStrong }]}>
              {error}
            </ThemedText>
          )}
        </ScrollView>

        <View style={styles.ctaBar}>
          <PressButton label={busy ? t('paywall.signingIn') : t('paywall.continueWithGoogle')} onPress={handleGoogleSignIn} />
          <ThemedText type="label" themeColor="textSecondary" style={styles.ctaHint}>
            {t('paywall.temporaryUnlockNote')}
          </ThemedText>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

function PlanCard({
  title,
  detail,
  price,
  period,
  badge,
  selected,
  onPress,
}: {
  id: PlanId;
  title: string;
  detail: string;
  price: string;
  period: string;
  badge?: string;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.planCard,
        { backgroundColor: theme.background, borderColor: theme.border },
        selected && { borderColor: theme.accent, backgroundColor: theme.backgroundSelected },
      ]}>
      {badge && (
        <View style={[styles.planBadge, { backgroundColor: theme.done }]}>
          <ThemedText type="label" style={{ color: '#fff' }}>
            {badge}
          </ThemedText>
        </View>
      )}
      <View style={[styles.radio, { borderColor: selected ? theme.accent : theme.border }]}>
        {selected && <View style={[styles.radioDot, { backgroundColor: theme.accent }]} />}
      </View>
      <View style={styles.planInfo}>
        <ThemedText type="smallBold">{title}</ThemedText>
        <ThemedText type="label" themeColor="textSecondary">
          {detail}
        </ThemedText>
      </View>
      <View style={styles.planPrice}>
        <ThemedText type="subtitle" style={{ fontSize: 16 }}>
          {price}
        </ThemedText>
        <ThemedText type="label" themeColor="textSecondary">
          {period}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: Radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  hero: { alignItems: 'center', paddingTop: Spacing.two, paddingBottom: Spacing.four },
  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  heroEmoji: { fontSize: 26, lineHeight: 32 },
  heroTitle: { textAlign: 'center', marginBottom: Spacing.two },
  heroSubtitle: { textAlign: 'center', lineHeight: 20, maxWidth: 300 },
  featureList: { gap: Spacing.two, marginBottom: Spacing.five },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  featureCheck: {
    width: 22,
    height: 22,
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureText: { flex: 1 },
  plans: { gap: Spacing.two, marginBottom: Spacing.two },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: Radii.md,
    borderWidth: 2,
    padding: Spacing.three,
    position: 'relative',
  },
  planBadge: {
    position: 'absolute',
    top: -9,
    left: Spacing.three,
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: Radii.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioDot: { width: 9, height: 9, borderRadius: Radii.pill },
  planInfo: { flex: 1, gap: 2 },
  planPrice: { alignItems: 'flex-end' },
  notActiveNote: { textAlign: 'center', lineHeight: 17, marginBottom: Spacing.four },
  titheCard: { borderRadius: Radii.md, borderWidth: 1, padding: Spacing.three, marginBottom: Spacing.three },
  titheHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, marginBottom: Spacing.three },
  titheHeadIcon: {
    width: 38,
    height: 38,
    borderRadius: Radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  titheHeadEmoji: { fontSize: 16, lineHeight: 20 },
  titheHeadText: { flex: 1, gap: 1 },
  titheHeadTitle: { fontSize: 17, lineHeight: 21 },
  titheSubtitle: { textTransform: 'none', letterSpacing: 0, lineHeight: 15 },
  titheRows: { gap: Spacing.two },
  titheRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingTop: Spacing.two },
  titheRowIcon: {
    width: 30,
    height: 30,
    borderRadius: Radii.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  titheRowEmoji: { fontSize: 14, lineHeight: 18 },
  titheRowText: { flex: 1, gap: 1 },
  titheRowDesc: { textTransform: 'none', letterSpacing: 0, lineHeight: 15 },
  error: { textAlign: 'center', marginTop: Spacing.two },
  ctaBar: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  ctaHint: { textAlign: 'center', marginTop: Spacing.two, textTransform: 'none', letterSpacing: 0, lineHeight: 15 },
});
