import { Level } from './types';

export type LevelStatus = 'done' | 'current' | 'locked';

export function getLevelStatuses(levels: Level[], completedLevelIds: string[]): Record<string, LevelStatus> {
  const completed = new Set(completedLevelIds);
  const statuses: Record<string, LevelStatus> = {};
  let currentAssigned = false;

  for (const level of levels) {
    if (completed.has(level.id)) {
      statuses[level.id] = 'done';
    } else if (!currentAssigned) {
      statuses[level.id] = 'current';
      currentAssigned = true;
    } else {
      statuses[level.id] = 'locked';
    }
  }

  return statuses;
}

/** Clave de i18n de la etapa (p. ej. "Primeros pasos") para el banner del
 * nivel actual: mientras se está en "Teoría", "Mano derecha" o "Mano
 * izquierda" debe seguir diciendo "Primeros pasos", no el nombre corto de
 * cada botón individual. Si el nivel no pertenece a ninguna etapa
 * (`stage` sin definir), se usa directamente su propio título. */
export function getStageLabel(level: Level): string {
  return level.stage ?? level.title;
}

function localISODate(d: Date): string {
  return d.toLocaleDateString('sv-SE'); // 'sv-SE' da YYYY-MM-DD en hora local
}

/** Racha de días consecutivos de práctica real, contada hacia atrás desde
 * hoy. Si todavía no se practicó hoy, la racha sigue "viva" mientras se
 * haya practicado ayer (se rompe recién al pasar un día completo sin
 * practicar) — derivada de `practiceDates`, nunca un contador aparte que
 * se pueda desincronizar de los datos reales. */
export function getCurrentStreak(practiceDates: string[]): number {
  const practiced = new Set(practiceDates);
  const cursor = new Date();
  if (!practiced.has(localISODate(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (practiced.has(localISODate(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
