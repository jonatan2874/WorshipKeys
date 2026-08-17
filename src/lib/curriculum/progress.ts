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
