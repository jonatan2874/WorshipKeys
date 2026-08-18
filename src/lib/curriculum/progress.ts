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
