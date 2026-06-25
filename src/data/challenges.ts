import type { Challenge } from '@/types';

export const CHALLENGES: Challenge[] = [
  { id: 'ch-1', title: 'Reto del día: 1 pomodoro de enfoque', description: 'Completa un bloque de 25 minutos sin distracciones.', skillId: 'sk-focus', cadence: 'daily', rewardBadge: 'reto_aceptado' },
  { id: 'ch-2', title: 'Reto del día: resuelve 3 ejercicios', description: 'Practica 3 ejercicios de tu habilidad principal.', skillId: 'sk-js', cadence: 'daily' },
  { id: 'ch-3', title: 'Reto del día: escribe un resumen', description: 'Resume en 5 líneas lo aprendido hoy.', skillId: 'sk-writing', cadence: 'daily' },
  { id: 'ch-4', title: 'Reto semanal: completa un módulo', description: 'Termina un módulo completo esta semana.', skillId: 'sk-react', cadence: 'weekly', rewardBadge: 'modulo_maestro' },
  { id: 'ch-5', title: 'Reto semanal: practica inglés 4 días', description: 'Dedica al menos 15 minutos al inglés en 4 días.', skillId: 'sk-english', cadence: 'weekly' },
  { id: 'ch-6', title: 'Reto semanal: prepara una presentación', description: 'Estructura una mini-presentación de 3 minutos.', skillId: 'sk-public-speaking', cadence: 'weekly' },
];
