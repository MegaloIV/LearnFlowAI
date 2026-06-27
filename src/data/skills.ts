import type { Skill } from '@/types';

export const SKILLS: Skill[] = [
  { id: 'sk-js', name: 'JavaScript', category: 'programacion', description: 'Fundamentos y características modernas del lenguaje JavaScript.' },
  { id: 'sk-react', name: 'React', category: 'programacion', description: 'Construcción de interfaces con componentes, hooks y estado.' },
  { id: 'sk-python', name: 'Python', category: 'programacion', description: 'Programación con Python para automatización y análisis de datos.' },
  { id: 'sk-sql', name: 'Bases de datos y SQL', category: 'programacion', description: 'Modelado de datos y consultas relacionales.' },
  { id: 'sk-algorithms', name: 'Algoritmos y estructuras', category: 'programacion', description: 'Resolución de problemas y complejidad algorítmica.' },
  { id: 'sk-ml', name: 'Machine Learning', category: 'inteligencia_artificial', description: 'Modelos de aprendizaje supervisado y no supervisado.' },
  { id: 'sk-prompting', name: 'Prompt Engineering', category: 'inteligencia_artificial', description: 'Diseño de instrucciones efectivas para modelos de lenguaje.' },
  { id: 'sk-dataviz', name: 'Visualización de datos', category: 'inteligencia_artificial', description: 'Comunicación de hallazgos mediante gráficos claros.' },
  { id: 'sk-english', name: 'Inglés profesional', category: 'idiomas', description: 'Comunicación efectiva en inglés en contextos laborales.' },
  { id: 'sk-portuguese', name: 'Portugués', category: 'idiomas', description: 'Conversación y comprensión en portugués.' },
  { id: 'sk-public-speaking', name: 'Hablar en público', category: 'comunicacion', description: 'Presentaciones claras y persuasivas ante audiencias.' },
  { id: 'sk-writing', name: 'Escritura profesional', category: 'comunicacion', description: 'Redacción clara de correos, informes y documentación.' },
  { id: 'sk-negotiation', name: 'Negociación', category: 'comunicacion', description: 'Técnicas para acuerdos beneficiosos y manejo de conflictos.' },
  { id: 'sk-leadership', name: 'Liderazgo de equipos', category: 'liderazgo', description: 'Guiar, motivar y desarrollar equipos de alto rendimiento.' },
  { id: 'sk-decision', name: 'Toma de decisiones', category: 'liderazgo', description: 'Marcos para decidir con datos e incertidumbre.' },
  { id: 'sk-timemgmt', name: 'Gestión del tiempo', category: 'productividad', description: 'Priorización, enfoque y técnicas de productividad personal.' },
  { id: 'sk-focus', name: 'Concentración profunda', category: 'productividad', description: 'Estrategias para trabajo profundo y evitar distracciones.' },
  { id: 'sk-entrepreneurship', name: 'Emprendimiento', category: 'emprendimiento', description: 'Validación de ideas, modelos de negocio y MVPs.' },
  { id: 'sk-finance', name: 'Finanzas para emprendedores', category: 'emprendimiento', description: 'Conceptos financieros esenciales para tu proyecto.' },
  { id: 'sk-cv', name: 'CV y entrevistas', category: 'empleabilidad', description: 'Preparación de currículum y entrevistas de trabajo.' },
  { id: 'sk-personal-brand', name: 'Marca personal', category: 'empleabilidad', description: 'Construcción de presencia profesional y networking.' },
];

export const SKILL_BY_ID: Record<string, Skill> = Object.fromEntries(
  SKILLS.map((s) => [s.id, s]),
);

export const CATEGORY_LABELS: Record<Skill['category'], string> = {
  programacion: 'Programación',
  inteligencia_artificial: 'Inteligencia Artificial',
  idiomas: 'Idiomas',
  comunicacion: 'Comunicación',
  liderazgo: 'Liderazgo',
  productividad: 'Productividad',
  emprendimiento: 'Emprendimiento',
  empleabilidad: 'Empleabilidad',
};
