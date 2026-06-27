import type { GoalType, LearningStyle } from '@/types';

export const GOAL_OPTIONS: { value: GoalType; label: string; desc: string }[] = [
  { value: 'empleabilidad', label: 'Conseguir empleo', desc: 'Prepararme para entrevistas y destacar.' },
  { value: 'ascenso', label: 'Crecer profesionalmente', desc: 'Subir de nivel en mi trabajo actual.' },
  { value: 'cambio_carrera', label: 'Cambiar de carrera', desc: 'Reconvertirme hacia un nuevo campo.' },
  { value: 'examen', label: 'Preparar un examen', desc: 'Estudiar para una certificación o prueba.' },
  { value: 'proyecto_personal', label: 'Proyecto personal', desc: 'Aprender para un proyecto propio.' },
  { value: 'curiosidad', label: 'Curiosidad', desc: 'Aprender por interés personal.' },
];

export const LEARNING_STYLES: { value: LearningStyle; label: string }[] = [
  { value: 'teorico', label: 'Teórico' },
  { value: 'practico', label: 'Práctico' },
  { value: 'mixto', label: 'Mixto' },
  { value: 'video', label: 'Video' },
  { value: 'ejercicios', label: 'Ejercicios' },
  { value: 'ejemplos_reales', label: 'Ejemplos reales' },
];

export const LEVEL_OPTIONS: { value: 'basico' | 'intermedio' | 'avanzado'; label: string; desc: string }[] = [
  { value: 'basico', label: 'Básico', desc: 'Estoy empezando desde cero.' },
  { value: 'intermedio', label: 'Intermedio', desc: 'Tengo algo de experiencia.' },
  { value: 'avanzado', label: 'Avanzado', desc: 'Domino bastante el tema.' },
];

export const GOAL_LABEL: Record<GoalType, string> = {
  empleabilidad: 'Conseguir empleo',
  ascenso: 'Crecer profesionalmente',
  cambio_carrera: 'Cambiar de carrera',
  examen: 'Preparar un examen',
  proyecto_personal: 'Proyecto personal',
  curiosidad: 'Curiosidad',
  otro: 'Otro',
};
