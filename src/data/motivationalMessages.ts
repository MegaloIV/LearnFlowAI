export const MOTIVATIONAL_MESSAGES: string[] = [
  'Cada módulo te acerca un paso más a tu objetivo. ¡Sigue así! 🚀',
  'La constancia vence al talento. Un poco hoy suma mucho mañana.',
  'No tienes que ser perfecto, solo un poco mejor que ayer. 💪',
  '¡Gran ritmo! Tu cerebro está construyendo conexiones nuevas ahora mismo.',
  'El progreso real se construye con pequeños pasos diarios.',
  'Tómate un respiro si lo necesitas, pero no abandones. Vas muy bien.',
  'Aprender es un superpoder. Hoy lo estás entrenando. ⚡',
  '¡Lo estás logrando! Mira cuánto has avanzado desde que empezaste.',
  'La curiosidad es tu mejor aliada. Sigue haciéndote preguntas.',
  'Un objetivo sin acción es solo un deseo. Hoy estás actuando. 🎯',
];

export function randomMotivational(): string {
  return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
}
