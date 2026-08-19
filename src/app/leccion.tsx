import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HandDiagram } from '@/components/illustrations/hand-diagram';
import { IconClose, IconMicOff } from '@/components/icons';
import { PianoKeyboard } from '@/components/illustrations/piano-keyboard';
import { PracticeRoll } from '@/components/practice/practice-roll';
import { PressButton } from '@/components/press-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TouchKeyboard } from '@/components/touch-keyboard';
import { Radii, Spacing } from '@/constants/theme';
import { useProgress } from '@/contexts/progress-context';
import { useTheme } from '@/hooks/use-theme';
import { buildLevelSteps } from '@/lib/curriculum/generate-steps';
import { getLevelStatuses } from '@/lib/curriculum/progress';
import { sampleLevels } from '@/lib/curriculum/sample-data';
import { evaluateAttempt, pitchClassOf } from '@/lib/evaluation/note-match';
import { useMicPitchDetector } from '@/lib/pitch/use-mic-pitch-detector';

type Mode = 'teclado' | 'microfono';

// Cuánto tiempo sin captar ninguna señal de audio antes de avisar que el
// micrófono no está escuchando bien (no bloquea la pantalla, solo informa).
const MIC_TROUBLE_DELAY_MS = 6000;

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
    // El progreso se carga de forma asíncrona desde el storage — si esta
    // pantalla es la primera en montar (deep link/recarga directa), al
    // principio progress.completedLevelIds está vacío. Depender de él acá
    // hace que el nivel se recalcule apenas termina de cargar, en vez de
    // quedarse pegado con el resultado (potencialmente "bloqueado") de ese
    // primer render.
  }, [levelId, progress.completedLevelIds]);

  // Se recalcula (nueva secuencia al azar) cada vez que cambia el nivel o
  // se repite el intento — así el repaso nunca sale igual dos veces.
  const [randomSeed, setRandomSeed] = useState(0);
  const steps = useMemo(
    () => buildLevelSteps(level),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [level.id, randomSeed],
  );

  const [stepIndex, setStepIndex] = useState(() =>
    Math.min(progress.stepProgress[level.id] ?? 0, steps.length),
  );
  const [mode, setMode] = useState<Mode>('microfono');
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const step = steps[stepIndex];
  const { isListening, hasPermission, detectedNote, isSupported, start, stop } = useMicPitchDetector();
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

  // Aviso no bloqueante: si llevamos un rato escuchando sin captar ninguna
  // señal, es probable que el micrófono no esté oyendo bien el instrumento
  // (volumen bajo, celular lejos, etc.). Se reinicia cada vez que sí se
  // detecta algo, y se oculta apenas hay actividad de nuevo.
  const [micTrouble, setMicTrouble] = useState(false);
  useEffect(() => {
    if (mode !== 'microfono' || !isListening || step?.kind === 'info') return;
    const timer = setTimeout(() => setMicTrouble(true), MIC_TROUBLE_DELAY_MS);
    return () => {
      clearTimeout(timer);
      setMicTrouble(false);
    };
  }, [mode, isListening, step, detectedNote]);

  // Al cambiar de nivel, retoma el paso donde se quedó (no repite lo ya
  // visto) en vez de arrancar siempre desde 0. Se ajusta durante el render
  // (no en un efecto), siguiendo el patrón recomendado por React para esto.
  const prevLevelIdRef = useRef(level.id);
  if (prevLevelIdRef.current !== level.id) {
    prevLevelIdRef.current = level.id;
    setRandomSeed((s) => s + 1);
    const resumeIndex = Math.min(progress.stepProgress[level.id] ?? 0, steps.length);
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

  const isLevelComplete = stepIndex >= steps.length;

  useEffect(() => {
    if (isLevelComplete && steps.length > 0) {
      completeLevel(level.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLevelComplete, level.id]);

  if (!step) {
    const levelIndex = sampleLevels.findIndex((l) => l.id === level.id);
    const nextLevel = sampleLevels[levelIndex + 1];
    const hasSteps = steps.length > 0;

    function repeatLevel() {
      heardRef.current = [];
      setSelectedNotes([]);
      setFeedback(null);
      setStepIndex(0);
      // Nueva secuencia al azar en cada repaso — nunca la misma dos veces.
      setRandomSeed((s) => s + 1);
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
          <Pressable onPress={() => safeBack()} hitSlop={12} style={styles.backLink}>
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
    const nextIndex = Math.min(stepIndex + 1, steps.length);
    setStepIndex(nextIndex);
    updateStepProgress(level.id, nextIndex);
  }

  function previousStep() {
    heardRef.current = [];
    setSelectedNotes([]);
    setFeedback(null);
    setStepIndex((i) => Math.max(i - 1, 0));
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

  // safeBack() lanza un error de navegación si esta pantalla es la
  // primera del stack (p. ej. se entró por URL directa) — sin historial al
  // cual volver, se manda a Inicio en su lugar.
  function safeBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }

  const progressPct = (stepIndex / steps.length) * 100;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topRow}>
          <Pressable onPress={() => safeBack()} hitSlop={12}>
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
              {!step.illustration && (
                <View style={[styles.heroBox, { backgroundColor: theme.backgroundSelected }]}>
                  <ThemedText style={styles.heroEmoji}>💡</ThemedText>
                </View>
              )}
              <ThemedText type="title" style={styles.instruction}>
                {step.displayName}
              </ThemedText>
              {step.keyPoints ? (
                <View style={styles.keyPoints}>
                  {step.keyPoints.map((kp, i) => (
                    <View key={i} style={[styles.keyPointRow, i > 0 && { borderTopColor: theme.border, borderTopWidth: 1 }]}>
                      <ThemedText type="smallBold" style={{ color: theme.accentStrong }}>
                        {kp.label}
                      </ThemedText>
                      <ThemedText type="small" themeColor="textSecondary" style={styles.infoText}>
                        {kp.description}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              ) : (
                <ThemedText type="default" themeColor="textSecondary" style={styles.infoText}>
                  {step.instructionText}
                </ThemedText>
              )}
            </View>
            <View style={styles.infoActions}>
              {stepIndex > 0 && (
                <PressButton
                  label={t('leccion.previous')}
                  onPress={previousStep}
                  variant="secondary"
                  style={styles.infoBackButton}
                />
              )}
              <PressButton label={t('leccion.continue')} onPress={advanceStep} style={styles.infoContinueButton} />
            </View>
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

            <PracticeRoll steps={steps} currentIndex={stepIndex} feedback={feedback} />

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
                {!isSupported ? (
                  <ThemedText type="small" style={{ color: theme.doneStrong, textAlign: 'center' }}>
                    {t('leccion.micNotSupported')}
                  </ThemedText>
                ) : (
                  <>
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
                  </>
                )}
              </View>
            )}
          </>
          )}
        </Animated.View>

        {micTrouble && mode === 'microfono' && (
          <Animated.View
            entering={FadeInDown.duration(300)}
            exiting={FadeOutUp.duration(200)}
            style={[styles.micToast, { backgroundColor: theme.micToastBg }]}>
            <View style={styles.micToastIcon}>
              <IconMicOff size={18} color="#fff" />
            </View>
            <View style={styles.micToastBody}>
              <ThemedText type="smallBold" style={styles.micToastText}>
                {t('leccion.micTrouble')}
              </ThemedText>
              <ThemedText type="small" style={[styles.micToastText, { opacity: 0.82 }]}>
                {t('leccion.micTroubleBody')}
              </ThemedText>
              <Pressable onPress={() => switchMode('teclado')} hitSlop={8} style={styles.micToastAction}>
                <ThemedText type="smallBold" style={{ color: theme.accent }}>
                  {t('leccion.micTroubleSwitchToKeyboard')}
                </ThemedText>
              </Pressable>
            </View>
            <Pressable
              onPress={() => setMicTrouble(false)}
              hitSlop={12}
              accessibilityLabel={t('leccion.micTroubleDismiss')}
              style={styles.micToastDismiss}>
              <IconClose size={12} color="#fff" />
            </Pressable>
          </Animated.View>
        )}
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
  heroBox: {
    width: '100%',
    height: 100,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: { fontSize: 36 },
  keyPoints: { width: '100%' },
  keyPointRow: { paddingVertical: Spacing.two, gap: 2 },
  infoActions: { flexDirection: 'row', gap: Spacing.two },
  infoBackButton: { flex: 1, paddingHorizontal: Spacing.two },
  infoContinueButton: { flex: 2 },
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
  micToast: {
    position: 'absolute',
    left: Spacing.four,
    right: Spacing.four,
    bottom: Spacing.four,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: Radii.md,
    padding: Spacing.three,
    gap: Spacing.two,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  micToastIcon: {
    width: 28,
    height: 28,
    borderRadius: Radii.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  micToastBody: { flex: 1, gap: 2 },
  micToastText: { color: '#fff' },
  micToastAction: { marginTop: Spacing.one },
  micToastDismiss: {
    width: 22,
    height: 22,
    borderRadius: Radii.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
});
