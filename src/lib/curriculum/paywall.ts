import { Level } from './types';

/** Desde esta etapa (número, no índice) el contenido requiere cuenta
 * iniciada. Por ahora, sin pagos reales todavía integrados, cualquier
 * cuenta de Google desbloquea todo (ver AuthProvider) — cuando haya
 * suscripción real, este mismo punto de corte pasa a exigirla también. */
export const PAYWALL_FROM_STAGE = 3;

/** Extrae el número de etapa de la clave i18n del nivel (ej.
 * 'curriculum.stage3.title' -> 3) y lo compara contra el punto de corte. */
export function isPremiumLevel(level: Level): boolean {
  const match = level.stage?.match(/stage(\d+)/);
  if (!match) return false;
  return Number(match[1]) >= PAYWALL_FROM_STAGE;
}
