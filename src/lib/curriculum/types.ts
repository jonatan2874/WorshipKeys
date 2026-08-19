export type LevelRole =
  | 'melodia'
  | 'acordes'
  | 'acompanamiento'
  | 'solista'
  | 'fundamentos'
  | 'escalas'
  | 'tonalidades'
  | 'ritmo'
  | 'oido'
  | 'repertorio'
  | 'lectura';

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
  /** Puntos clave opcionales (solo pasos 'info') — si están presentes se
   * muestran como una lista de renglones "etiqueta + descripción" en vez
   * de un solo párrafo. Opcional y retrocompatible: los pasos sin esto
   * siguen mostrando `instructionText` como párrafo único. */
  keyPoints?: { label: string; description: string }[];
  timing?: { beat: number; durationBeats: number };
}

/** Nota disponible para armar pasos de identificación al azar. */
export interface NotePoolItem {
  note: string;
  displayName: string;
  fingerNumber?: number;
  hand: 'left' | 'right';
}

/** Acorde disponible para armar pasos de práctica al azar. */
export interface ChordPoolItem {
  notes: string[];
  displayName: string;
}

/** Fuente para generar pasos de práctica/repaso al azar en cada intento del
 * nivel (incluyendo "repetir nivel"), en vez de un orden fijo memorizable. */
export interface PracticePool {
  notes?: NotePoolItem[];
  /** Cuántos pasos de identificación de nota se generan por intento. */
  noteQuizCount?: number;
  chords?: ChordPoolItem[];
}

export interface Level {
  id: string;
  /** Clave de i18n (no texto literal) — usar t(title) al mostrarlo. */
  title: string;
  /** Clave de i18n (no texto literal) — usar t(subtitle) al mostrarlo. */
  subtitle: string;
  role: LevelRole;
  /** Clave de i18n opcional — nombre de la etapa a la que pertenece este
   * nivel (p. ej. "Primeros pasos"), para el banner del nivel actual. Se
   * repite igual en todos los niveles de la misma etapa. */
  stage?: string;
  /** Clave de i18n opcional — si está presente, el camino de niveles
   * dibuja un separador con este texto justo antes de este nivel (para
   * agrupar varios niveles bajo una misma sub-sección visualmente, p. ej.
   * "Práctica" antes de "Mano derecha"/"Mano izquierda"). */
  divider?: string;
  /** Pasos fijos (enseñanza inicial, info, melodías con orden fijo, etc.). */
  steps: Step[];
  /** Si está presente, se generan pasos adicionales al azar (distintos en
   * cada intento) y se agregan después de `steps`. */
  practicePool?: PracticePool;
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
  chordsLearned: string[];
  /** Último paso alcanzado por nivel (id de nivel -> índice de paso), para
   * poder retomar donde se quedó sin repetir lo ya visto. */
  stepProgress: Record<string, number>;
  /** Días 'YYYY-MM-DD' (hora local del dispositivo) en los que hubo al
   * menos una interacción real de práctica, sin duplicados — base del
   * calendario semanal del perfil. */
  practiceDates: string[];
}
