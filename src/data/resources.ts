import type { Resource } from '@/types';

export const RESOURCES: Resource[] = [
  { id: 'res-1', title: 'Guía interactiva de JavaScript moderno', description: 'Tutorial práctico con ejercicios autoevaluados.', durationMinutes: 60, type: 'ejercicios', level: 'basico', skillId: 'sk-js', url: '#' },
  { id: 'res-2', title: 'Patrones de hooks en React', description: 'Artículo con ejemplos reales de custom hooks.', durationMinutes: 25, type: 'ejemplos_reales', level: 'avanzado', skillId: 'sk-react', url: '#' },
  { id: 'res-3', title: 'Curso visual de SQL', description: 'Video corto explicando JOINs paso a paso.', durationMinutes: 18, type: 'video', level: 'intermedio', skillId: 'sk-sql', url: '#' },
  { id: 'res-4', title: 'Pandas en 30 minutos', description: 'Notebook guiado de manipulación de datos.', durationMinutes: 30, type: 'practico', level: 'intermedio', skillId: 'sk-python', url: '#' },
  { id: 'res-5', title: 'Plantillas de prompts efectivos', description: 'Colección de prompts reutilizables comentados.', durationMinutes: 15, type: 'ejemplos_reales', level: 'basico', skillId: 'sk-prompting', url: '#' },
  { id: 'res-6', title: 'Fundamentos de Machine Learning', description: 'Serie de videos introductorios.', durationMinutes: 90, type: 'video', level: 'basico', skillId: 'sk-ml', url: '#' },
  { id: 'res-7', title: 'Inglés para emails: 50 frases', description: 'Lista de fórmulas listas para usar.', durationMinutes: 20, type: 'teorico', level: 'intermedio', skillId: 'sk-english', url: '#' },
  { id: 'res-8', title: 'Cómo estructurar una charla TED', description: 'Análisis de presentaciones memorables.', durationMinutes: 35, type: 'ejemplos_reales', level: 'intermedio', skillId: 'sk-public-speaking', url: '#' },
  { id: 'res-9', title: 'El método Pomodoro explicado', description: 'Guía rápida con plantillas descargables.', durationMinutes: 12, type: 'teorico', level: 'basico', skillId: 'sk-timemgmt', url: '#' },
  { id: 'res-10', title: 'Feedback efectivo: modelo SBI', description: 'Ejercicios prácticos de feedback.', durationMinutes: 28, type: 'ejercicios', level: 'intermedio', skillId: 'sk-leadership', url: '#' },
  { id: 'res-11', title: 'Valida tu MVP en una semana', description: 'Caso de estudio real de validación.', durationMinutes: 40, type: 'ejemplos_reales', level: 'intermedio', skillId: 'sk-entrepreneurship', url: '#' },
  { id: 'res-12', title: 'Tu CV en una página', description: 'Plantillas y ejemplos comentados.', durationMinutes: 22, type: 'ejemplos_reales', level: 'basico', skillId: 'sk-cv', url: '#' },
  { id: 'res-13', title: 'Trabajo profundo: rutinas de enfoque', description: 'Estrategias para concentración sostenida.', durationMinutes: 33, type: 'teorico', level: 'intermedio', skillId: 'sk-focus', url: '#' },
  { id: 'res-14', title: 'Visualización: elige el gráfico correcto', description: 'Catálogo visual de tipos de gráfico.', durationMinutes: 18, type: 'video', level: 'basico', skillId: 'sk-dataviz', url: '#' },
  { id: 'res-15', title: 'Negociación basada en intereses', description: 'Resumen del método Harvard.', durationMinutes: 26, type: 'teorico', level: 'intermedio', skillId: 'sk-negotiation', url: '#' },
];

export const RESOURCE_BY_ID: Record<string, Resource> = Object.fromEntries(
  RESOURCES.map((r) => [r.id, r]),
);
