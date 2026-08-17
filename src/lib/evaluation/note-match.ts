/**
 * Motor de evaluación de notas/acordes, agnóstico a la fuente de entrada.
 * Teclado táctil, micrófono y (más adelante) MIDI alimentan esta misma función
 * con la lista de notas tocadas — la comparación no sabe de dónde vinieron.
 */

export interface EvaluationResult {
  correct: boolean;
  /** Notas esperadas que todavía no se tocaron. */
  missing: string[];
  /** Notas tocadas que no correspondían al paso actual. */
  wrong: string[];
}

/** 'C#4' -> 'C#'. Por defecto se compara por clase de nota (ignora octava);
 * el rol "solista" necesitará comparar octava exacta más adelante. */
export function pitchClassOf(note: string): string {
  return note.replace(/-?\d+$/, '');
}

export function evaluateAttempt(expectedNotes: string[], playedNotes: string[]): EvaluationResult {
  const expected = new Set(expectedNotes.map(pitchClassOf));
  const played = new Set(playedNotes.map(pitchClassOf));

  const missing = [...expected].filter((note) => !played.has(note));
  const wrong = [...played].filter((note) => !expected.has(note));

  return { correct: missing.length === 0 && wrong.length === 0, missing, wrong };
}
