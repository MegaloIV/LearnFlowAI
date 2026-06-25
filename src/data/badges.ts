import type { BadgeDef } from '@/types';

export const BADGES: BadgeDef[] = [
  { type: 'primer_paso', name: 'Primer paso', description: 'Completaste tu primer módulo.', icon: '🌱' },
  { type: 'diagnostico_completo', name: 'Conócete', description: 'Terminaste tu diagnóstico inicial.', icon: '🧭' },
  { type: 'racha_3', name: 'En racha', description: 'Completaste 3 actividades.', icon: '🔥' },
  { type: 'modulo_maestro', name: 'Módulo maestro', description: 'Completaste 5 módulos.', icon: '🎓' },
  { type: 'reto_aceptado', name: 'Reto aceptado', description: 'Completaste tu primer reto.', icon: '🏆' },
  { type: 'ruta_completa', name: 'Ruta completa', description: 'Terminaste una ruta de aprendizaje al 100%.', icon: '🚀' },
  { type: 'madrugador', name: 'Constante', description: 'Estudiaste varios días seguidos.', icon: '⏰' },
  { type: 'perfeccionista', name: 'Perfeccionista', description: 'Obtuviste 100% en una prueba.', icon: '💯' },
];

export const BADGE_BY_TYPE: Record<string, BadgeDef> = Object.fromEntries(
  BADGES.map((b) => [b.type, b]),
);
