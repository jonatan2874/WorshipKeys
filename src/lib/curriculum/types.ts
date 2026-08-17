export type LevelRole = 'melodia' | 'acordes' | 'acompanamiento' | 'solista' | 'fundamentos';

/** 'info' = paso explicativo, no requiere tocar nada (solo "Continuar"). */
export type StepKind = 'note' | 'chord' | 'info';

/** Ilustración explicativa opcional para un paso (solo pasos 'info'; los
 * pasos 'note'/'chord' derivan su propio teclado de expectedNotes). */
export type StepIllustration = { kind: 'keyboard'; highlightNotes: string[]; markMiddleC?: boolean } | { kind: 'hand'; side: 'left' | 'right' };

export interface Step {
  kind: StepKind;
  /** Vacío para pasos 'info'. */
  expectedNotes: string[];
  instructionText: string;
  displayName: string;
  /** Dedo sugerido (1 = pulgar … 5 = meñique), solo para pasos 'note'/'chord'. */
  fingerNumber?: number;
  /** Qué mano toca este paso — determina qué diagrama de mano mostrar. */
  hand?: 'left' | 'right';
  illustration?: StepIllustration;
  timing?: { beat: number; durationBeats: number };
  /** Modo de entrada sugerido al entrar a este paso (el usuario lo puede
   * cambiar igual). Útil para práctica en bloque (teclado, ya que el
   * micrófono no puede captar varias notas a la vez) vs. arpegiada (mic). */
  recommendedMode?: 'teclado' | 'microfono';
}

export interface Level {
  id: string;
  /** Clave de i18n (no texto literal) — usar t(title) al mostrarlo. */
  title: string;
  /** Clave de i18n (no texto literal) — usar t(subtitle) al mostrarlo. */
  subtitle: string;
  role: LevelRole;
  steps: Step[];
}

export type SongLicenseStatus = 'verificado' | 'pendiente_revision_humana';

export interface Song {
  id: string;
  /** Clave de i18n (no texto literal) — usar t(title) al mostrarlo. */
  title: string;
  source: 'dominio_publico' | 'licenciada';
  licenseStatus: SongLicenseStatus;
  licenseInfo?: string;
  levelIds: string[];
}

export interface UserProgress {
  completedLevelIds: string[];
  currentStreak: number;
  lastPracticeDate: string | null;
  chordsLearned: string[];
  /** Último paso alcanzado por nivel (id de nivel -> índice de paso), para
   * poder retomar donde se quedó sin repetir lo ya visto. */
  stepProgress: Record<string, number>;
}
