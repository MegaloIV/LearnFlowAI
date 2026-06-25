// Banco de respuestas del asistente simulado. NO es un LLM real:
// se hace matching simple por palabras clave sobre el mensaje del usuario.

export interface AssistantEntry {
  keywords: string[];
  response: string;
}

export const ASSISTANT_RESPONSES: AssistantEntry[] = [
  {
    keywords: ['ruta', 'camino', 'plan', 'empezar', 'por donde'],
    response:
      'Tu ruta de aprendizaje se arma según tu diagnóstico, objetivos y tiempo disponible. Te recomiendo empezar por el primer módulo pendiente: avanza en orden para construir bases sólidas. Puedes verla en la sección "Mi Ruta".',
  },
  {
    keywords: ['diagnostico', 'diagnóstico', 'nivel', 'evaluar', 'evaluación'],
    response:
      'El diagnóstico mide tu nivel actual por habilidad (básico, intermedio o avanzado) con preguntas cortas. Sus resultados ajustan tus recomendaciones. Puedes repetirlo para comparar tu progreso.',
  },
  {
    keywords: ['motivacion', 'motivación', 'desanimado', 'cansado', 'rendir', 'abandonar'],
    response:
      'Es normal sentirse así. Recuerda por qué empezaste y divide tu meta en pasos pequeños. Un solo pomodoro de 25 minutos ya es un avance. ¡Tú puedes! 💪',
  },
  {
    keywords: ['tiempo', 'horario', 'organizar', 'productividad', 'pomodoro'],
    response:
      'Para aprovechar tu tiempo, prueba la técnica Pomodoro (25 min de enfoque + 5 de descanso) desde la sección Productividad, y planifica tus sesiones en el calendario. Bloques cortos y constantes funcionan mejor que maratones.',
  },
  {
    keywords: ['javascript', 'js', 'react', 'frontend', 'programar', 'código', 'codigo'],
    response:
      'Para programación, combina teoría con práctica: por cada concepto, escribe código. En JavaScript domina funciones y asincronía antes de saltar a React. Revisa los módulos de la habilidad correspondiente y haz los ejercicios.',
  },
  {
    keywords: ['examen', 'prueba', 'test', 'aprobar', 'estudiar para'],
    response:
      'Para prepararte: identifica los temas con más brecha en tu diagnóstico, prioriza repasos cortos y haz las pruebas cortas de cada módulo. La repetición espaciada mejora la retención.',
  },
  {
    keywords: ['ingles', 'inglés', 'idioma', 'english'],
    response:
      'Para mejorar tu inglés profesional, practica un poco cada día: lee correos en inglés, escucha reuniones y usa frases clave. Los módulos de idioma incluyen ejemplos reales que puedes reutilizar.',
  },
  {
    keywords: ['trabajo', 'empleo', 'cv', 'entrevista', 'empleabilidad'],
    response:
      'Para tu empleabilidad: prepara un CV orientado a logros, practica entrevistas con el método STAR y trabaja tu marca personal. Tienes módulos dedicados a cada uno en la sección de habilidades de empleabilidad.',
  },
  {
    keywords: ['certificado', 'insignia', 'logro', 'badge'],
    response:
      'Ganas insignias automáticamente al cumplir hitos (completar tu primer módulo, retos, rachas...). Al terminar una ruta al 100% obtienes un certificado descargable. ¡Sigue avanzando para desbloquearlos!',
  },
];

export const ASSISTANT_FALLBACK =
  'Buena pregunta. Aún no tengo una respuesta específica para eso, pero te oriento: revisa tu diagnóstico para conocer tus brechas, avanza en tu ruta paso a paso y apóyate en las recomendaciones. ¿Quieres que te sugiera por dónde continuar?';

export const RESPONSIBLE_AI_NOTICE =
  '⚠️ Uso responsable de la IA: soy un asistente de orientación con respuestas simuladas. Verifica la información importante y úsala como apoyo, no como única fuente.';
