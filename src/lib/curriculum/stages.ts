import { Level } from './types';
import { LevelStatus } from './progress';

/** Una de las 12 etapas del currículo (0–9 y 99) — agrupa varios `Level`
 * (lecciones) bajo un mismo título visible en el camino de niveles. */
export interface StageDef {
  /** Clave de i18n del título de la etapa. */
  key: string;
  /** Número mostrado ("0"…"9", "99") — no es un índice de array, así la
   * etapa opcional "99" no rompe la numeración de las demás. */
  number: string;
}

export interface StageGroup {
  key: string;
  number: string;
  levels: Level[];
  status: LevelStatus;
}

/** Agrupa `levels` (lista plana) según su campo `Level.stage`, en el orden
 * de `stageDefs` — no en el orden en que aparecen en el array de niveles,
 * así el agrupamiento no depende de que los niveles de una etapa estén
 * contiguos (aunque en la práctica sí lo están). */
export function groupLevelsByStage(
  levels: Level[],
  stageDefs: StageDef[],
  statuses: Record<string, LevelStatus>,
): StageGroup[] {
  return stageDefs
    .map((def) => {
      const stageLevels = levels.filter((l) => l.stage === def.key);
      if (stageLevels.length === 0) return null;

      const allDone = stageLevels.every((l) => statuses[l.id] === 'done');
      const allLocked = stageLevels.every((l) => statuses[l.id] === 'locked');
      const status: LevelStatus = allDone ? 'done' : allLocked ? 'locked' : 'current';

      return { key: def.key, number: def.number, levels: stageLevels, status };
    })
    .filter((group): group is StageGroup => group !== null);
}
