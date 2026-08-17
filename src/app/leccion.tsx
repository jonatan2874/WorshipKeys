import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HandDiagram } from '@/components/illustrations/hand-diagram';
import { PianoKeyboard } from '@/components/illustrations/piano-keyboard';
import { PressButton } from '@/components/press-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TouchKeyboard } from '@/components/touch-keyboard';
import { Radii, Spacing } from '@/constants/theme';
import { useProgress } from '@/contexts/progress-context';
import { useTheme } from '@/hooks/use-theme';
import { getLevelStatuses } from '@/lib/curriculum/progress';
import { sampleLevels } from '@/lib/curriculum/sample-data';
import { evaluateAttempt, pitchClassOf } from '@/lib/evaluation/note-match';
import { useMicPitchDetector } from '@/lib/pitch/use-mic-pitch-detector';

type Mode = 'teclado' | 'microfono';

export default function LeccionScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { levelId } = useLocalSearchParams<{ levelId?: string }>();
  const { progress, completeLevel, updateStepProgress } = useProgress();

  const level = useMemo(() => {
    const statuses = getLevelStatuses(sampleLevels, progress.completedLevelIds);
    if (levelId) {
      const found = sampleLevels.find((l) => l.id === levelId);
      // Acceso obligatorio en orden: si el nivel pedido todavía está
      // bloqueado, se cae al nivel actual desbloqueado en su lugar.
      if (found && statuses[found.id] !== 'locked') return found;
    }
    return sampleLevels.find((l) => statuses[l.id] === 'current') ?? sampleLevels[0];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId]);

  const [stepIndex, setStepIndex] = useState(() =>
    Math.min(progress.stepProgress[level.id] ?? 0, level.steps.length),
  );
  const [mode, setMode] = useState<Mode>('microfono');
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const step = level.steps[stepIndex];
  const { isListening, hasPermission, detectedNote, start, stop } = useMicPitchDetector();
  const heardRef = useRef<string[]>([]);

  // Modo micrófono: escucha automáticamente sin que el usuario tenga que
  // tocar "Escuchar" cada vez que entra o cambia de modo.
  useEffect(() => {
    if (mode === 'microfono') {
      start();
    } else {
      stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Algunos pasos sugieren un modo específico (ej. práctica en bloque =
  // teclado, porque el micrófono no puede captar varias notas a la vez).
  // El usuario igual puede cambiarlo a mano con las pestañas. Se ajusta
  // durante el render (no en un efecto) siguiendo el mismo patrón que el
  // reinicio al cambiar de nivel, para no encadenar renders innecesarios.
  const appliedModeKeyRef = useRef<string | null>(null);
  const modeKey = `${level.id}:${stepIndex}`;
  if (appliedModeKeyRef.current !== modeKey) {
    appliedModeKeyRef.current = modeKey;
    if (step?.recommendedMode && step.recommendedMode !== mode) {
      setMode(step.recommendedMode);
    }
  }

  // Al cambiar de nivel, retoma el paso donde se quedó (no repite lo ya
  // visto) en vez de arrancar siempre desde 0. Se ajusta durante el render
  // (no en un efecto), siguiendo el patrón recomendado por React para esto.
  const prevLevelIdRef = useRef(level.id);
  if (prevLevelIdRef.current !== level.id) {
    prevLevelIdRef.current = level.id;
    const resumeIndex = Math.min(progress.stepProgress[level.id] ?? 0, level.steps.length);
    setStepIndex(resumeIndex);
    setSelectedNotes([]);
    setFeedback(null);
    heardRef.current = [];
  }

  useEffect(() => {
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mode !== 'microfono' || !detectedNote || !step) return;
    // Se acumulan notas distintas detectadas durante el intento (sirve tanto
    // para notas sueltas como para acordes arpegiados). El éxito solo exige
    // que la(s) nota(s) esperada(s) hayan sonado — una detección ruidosa de
    // más no bloquea el acierto, así no hace falta "una lectura perfecta".
    const pc = pitchClassOf(detectedNote.noteName);
    if (!heardRef.current.includes(pc)) {
      heardRef.current = [...heardRef.current, pc];
      checkAttempt(heardRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detectedNote?.noteName]);

  const isLevelComplete = stepIndex >= level.steps.length;

  useEffect(() => {
    if (isLevelComplete && level.steps.length > 0) {
      completeLevel(level.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLevelComplete, level.id]);

  if (!step) {
    const levelIndex = sampleLevels.findIndex((l) => l.id === level.id);
    const nextLevel = sampleLevels[levelIndex + 1];
    const hasSteps = level.steps.length > 0;

    function repeatLevel() {
      heardRef.current = [];
      setSelectedNotes([]);
      setFeedback(null);
      setStepIndex(0);
    }

    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.card, styles.infoCard, { backgroundColor: theme.backgroundElement, marginTop: Spacing.six }]}>
            <ThemedText type="title">{hasSteps ? t('leccion.congrats') : t('leccion.levelComplete', { title: t(level.title) })}</ThemedText>
            <ThemedText type="default" themeColor="textSecondary" style={styles.infoText}>
              {hasSteps ? t('leccion.congratsBody', { title: t(level.title) }) : t('leccion.noSteps')}
            </ThemedText>
          </View>
          <PressButton label={t('leccion.repeatLevel')} onPress={repeatLevel} />
          {nextLevel && (
            <PressButton
              label={t('leccion.nextLevel', { title: t(nextLevel.title) })}
              onPress={() => router.replace(`/leccion?levelId=${nextLevel.id}`)}
              style={{ marginTop: Spacing.two }}
            />
          )}
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backLink}>
            <ThemedText type="smallBold">{t('leccion.back')}</ThemedText>
          </Pressable>
        </SafeAreaView>
      </ThemedView>
    );
  }

  function advanceStep() {
    heardRef.current = [];
    setSelectedNotes([]);
    setFeedback(null);
    const nextIndex = Math.min(stepIndex + 1, level.steps.length);
    setStepIndex(nextIndex);
    updateStepProgress(level.id, nextIndex);
  }

  function checkAttempt(playedNotes: string[]) {
    const result = evaluateAttempt(step.expectedNotes, playedNotes);
    if (result.missing.length === 0) {
      setFeedback('correct');
      setTimeout(advanceStep, 500);
    } else if (playedNotes.length > 0) {
      setFeedback(result.wrong.length > 0 ? 'incorrect' : null);
    }
  }

  function handleKeyPress(note: string) {
    setFeedback(null);
    setSelectedNotes((prev) => {
      const pc = pitchClassOf(note);
      const already = prev.some((n) => pitchClassOf(n) === pc);
      const next = already ? prev.filter((n) => pitchClassOf(n) !== pc) : [...prev, note];
      checkAttempt(next);
      return next;
    });
  }

  function switchMode(next: Mode) {
    setMode(next);
    setFeedback(null);
    setSelectedNotes([]);
    heardRef.current = [];
  }

  const progressPct = (stepIndex / level.steps.length) * 100;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topRow}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <ThemedText type="smallBold">{t('leccion.close')}</ThemedText>
          </Pressable>
          <ThemedText type="small" themeColor="textSecondary">
            {t(level.title)}
          </ThemedText>
        </View>

        <View style={[styles.progressTrack, { backgroundColor: theme.backgroundElement }]}>
          <View style={[styles.progressFill, { backgroundColor: theme.accent, width: `${progressPct}%` }]} />
        </View>

        <Animated.View
          key={stepIndex}
          entering={FadeInDown.duration(450)}
          exiting={FadeOutUp.duration(250)}
          style={styles.stepContent}>
          {step.kind === 'info' ? (
          <>
            <View style={[styles.card, styles.infoCard, { backgroundColor: theme.backgroundElement }]}>
              {step.illustration?.kind === 'keyboard' && (
                <PianoKeyboard
                  highlightNotes={step.illustration.highlightNotes}
                  markMiddleC={step.illustration.markMiddleC}
                />
              )}
              {step.illustration?.kind === 'hand' && <HandDiagram side={step.illustration.side} />}
              <ThemedText type="title" style={styles.instruction}>
                {step.displayName}
              </ThemedText>
              <ThemedText type="default" themeColor="textSecondary" style={styles.infoText}>
                {step.instructionText}
              </ThemedText>
            </View>
            <PressButton label={t('leccion.continue')} onPress={advanceStep} />
          </>
        ) : (
          <>
            <View style={styles.modeRow}>
              {(['teclado', 'microfono'] as Mode[]).map((m) => (
                <Pressable
                  key={m}
                  onPress={() => switchMode(m)}
                  style={[
                    styles.modeTab,
                    { borderColor: theme.border },
                    mode === m && { backgroundColor: theme.accent, borderColor: theme.accentStrong },
                  ]}>
                  <ThemedText type="smallBold" style={mode === m ? { color: theme.accentOn } : undefined}>
                    {m === 'teclado' ? t('leccion.modeKeyboard') : t('leccion.modeMic')}
                  </ThemedText>
                </Pressable>
              ))}
            </View>

            <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
              <PianoKeyboard highlightNotes={step.expectedNotes} />
              <ThemedText type="label" themeColor="textSecondary">
                {step.kind === 'chord' ? t('leccion.playChord') : t('leccion.playNote')}
              </ThemedText>
              <ThemedText type="title" style={styles.instruction}>
                {step.kind === 'note'
                  ? `${step.displayName} (${pitchClassOf(step.expectedNotes[0])})`
                  : step.displayName}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {step.instructionText}
              </ThemedText>
              {step.fingerNumber && (
                <View style={[styles.fingerBadge, { backgroundColor: theme.accent }]}>
                  <ThemedText type="smallBold" style={{ color: theme.accentOn }}>
                    {t('leccion.finger', { number: step.fingerNumber })}
                  </ThemedText>
                </View>
              )}
              {step.fingerNumber && step.hand && (
                <HandDiagram side={step.hand} highlightFinger={step.fingerNumber} height={80} />
              )}

              {feedback === 'correct' && (
                <ThemedText type="smallBold" style={{ color: theme.accent, marginTop: Spacing.two }}>
                  {t('leccion.correct')}
                </ThemedText>
              )}
              {feedback === 'incorrect' && (
                <ThemedText type="smallBold" style={{ color: theme.doneStrong, marginTop: Spacing.two }}>
                  {t('leccion.incorrect')}
                </ThemedText>
              )}
            </View>

            {mode === 'teclado' ? (
              <TouchKeyboard selectedNotes={selectedNotes} onKeyPress={handleKeyPress} />
            ) : (
              <View style={styles.micArea}>
                {hasPermission === false && (
                  <ThemedText type="small" style={{ color: theme.doneStrong }}>
                    {t('leccion.micPermissionDenied')}
                  </ThemedText>
                )}
                <ThemedText type="small" themeColor="textSecondary">
                  {isListening ? t('leccion.listening') : t('leccion.micHint')}
                </ThemedText>
                {step.kind === 'chord' && heardRef.current.length > 0 && (
                  <ThemedText type="small" themeColor="textSecondary">
                    {t('leccion.heardNotes', { notes: heardRef.current.join(', ') })}
                  </ThemedText>
                )}
                <PressButton
                  label={isListening ? t('leccion.stopListening') : t('leccion.startListening')}
                  onPress={() => (isListening ? stop() : start())}
                  style={{ marginTop: Spacing.three }}
                />
              </View>
            )}
          </>
          )}
        </Animated.View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, paddingTop: Spacing.two },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  progressTrack: {
    height: 8,
    borderRadius: Radii.pill,
    overflow: 'hidden',
    marginBottom: Spacing.three,
  },
  progressFill: { height: '100%', borderRadius: Radii.pill },
  stepContent: { flex: 1 },
  modeRow: { flexDirection: 'row', gap: Spacing.two, marginBottom: Spacing.three },
  modeTab: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: Radii.pill,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  card: {
    borderRadius: Radii.md,
    padding: Spacing.four,
    alignItems: 'center',
    marginBottom: Spacing.four,
    gap: Spacing.two,
  },
  instruction: { marginVertical: Spacing.one },
  micArea: { alignItems: 'center', gap: Spacing.one },
  infoCard: { alignItems: 'flex-start', gap: Spacing.two },
  infoText: { lineHeight: 22 },
  fingerBadge: {
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    marginTop: Spacing.two,
  },
  backLink: {
    marginTop: Spacing.three,
    alignSelf: 'center',
  },
});
