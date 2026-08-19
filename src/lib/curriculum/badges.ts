import { getCurrentStreak } from './progress';
import { StageGroup } from './stages';
import { UserProgress } from './types';

export interface Badge {
  id: string;
  /** Clave de i18n del nombre del logro. */
  labelKey: string;
  earned: boolean;
}

/** Logros derivados directamente del progreso real — nunca fijos ni
 * decorativos. Cada uno se calcula de un dato que ya existe en
 * `UserProgress`/`StageGroup`, no de un contador aparte que se pueda
 * desincronizar. */
export function getEarnedBadges(progress: UserProgress, stages: StageGroup[]): Badge[] {
  const badges: Badge[] = [];

  stages.forEach((stage) => {
    badges.push({
      id: `stage-${stage.key}`,
      labelKey: stage.key,
      earned: stage.status === 'done',
    });
  });

  badges.push({
    id: 'streak-7',
    labelKey: 'perfil.badges.racha7',
    earned: getCurrentStreak(progress.practiceDates) >= 7,
  });

  badges.push({
    id: 'first-chord',
    labelKey: 'perfil.badges.primerAcorde',
    earned: progress.chordsLearned.length > 0,
  });

  return badges;
}
