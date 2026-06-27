// Reglas simples de gamificación (HU-26). Se evalúan tras eventos relevantes
// y otorgan insignias automáticamente vía el store.

import { useStore } from '@/store/useStore';

/** Evalúa y otorga insignias según el estado actual del usuario. */
export function evaluateBadges(): void {
  const state = useStore.getState();
  const uId = state.currentUserId;
  if (!uId) return;

  const award = state.awardBadge;
  const activities = state.activities.filter((a) => a.userId === uId);
  const diagnostics = state.diagnostics.filter((d) => d.userId === uId);
  const paths = state.paths.filter((p) => p.userId === uId);

  const completedModules = paths.flatMap((p) =>
    p.modules.filter((m) => m.status === 'completed'),
  ).length;

  if (completedModules >= 1) award('primer_paso');
  if (completedModules >= 5) award('modulo_maestro');
  if (diagnostics.length >= 1) award('diagnostico_completo');
  if (activities.length >= 3) award('racha_3');
  if (activities.some((a) => a.type === 'challenge')) award('reto_aceptado');
  if (activities.some((a) => a.type === 'test' && a.score === 100)) award('perfeccionista');
  if (paths.some((p) => p.progressPct === 100)) award('ruta_completa');

  // "Constante": actividades en 3 días distintos
  const days = new Set(activities.map((a) => new Date(a.completedAt).toDateString()));
  if (days.size >= 3) award('madrugador');
}
