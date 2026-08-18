import { Level } from './types';

export type LessonKind = 'teoria' | 'practica' | 'proximamente';

/** Tipo de lección para el ícono/etiqueta de cada fila dentro del
 * acordeón — derivado del contenido real del nivel, no un campo aparte
 * que se pueda desincronizar de los pasos reales. */
export function getLessonKind(level: Level): LessonKind {
  if (level.steps.length === 0 && !level.practicePool) return 'proximamente';
  const first = level.steps[0];
  if (first?.kind === 'info' && !level.practicePool) return 'teoria';
  return 'practica';
}
