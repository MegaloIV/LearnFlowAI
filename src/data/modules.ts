import type { ModuleContent } from '@/types';

export const MODULES: ModuleContent[] = [
  // JavaScript
  { id: 'mod-js-1', title: 'Variables, tipos y operadores', description: 'Bases del lenguaje: let/const, tipos primitivos y coerción.', skillId: 'sk-js', durationMinutes: 25, difficulty: 'basico', contentType: 'teorico', objectives: ['Declarar variables correctamente', 'Entender tipos primitivos', 'Evitar coerciones inesperadas'] },
  { id: 'mod-js-2', title: 'Funciones y closures', description: 'Funciones, ámbito léxico y closures en la práctica.', skillId: 'sk-js', durationMinutes: 35, difficulty: 'intermedio', contentType: 'mixto', objectives: ['Crear funciones reutilizables', 'Comprender closures', 'Aplicar callbacks'] },
  { id: 'mod-js-3', title: 'Asincronía: Promesas y async/await', description: 'Manejo de operaciones asíncronas modernas.', skillId: 'sk-js', durationMinutes: 45, difficulty: 'avanzado', contentType: 'ejercicios', objectives: ['Usar promesas', 'Encadenar async/await', 'Manejar errores async'] },

  // React
  { id: 'mod-react-1', title: 'Componentes y props', description: 'Tu primer componente y paso de props.', skillId: 'sk-react', durationMinutes: 30, difficulty: 'basico', contentType: 'practico', objectives: ['Crear componentes', 'Pasar props', 'Componer UI'] },
  { id: 'mod-react-2', title: 'Estado con useState y efectos', description: 'Manejo de estado local y efectos secundarios.', skillId: 'sk-react', durationMinutes: 40, difficulty: 'intermedio', contentType: 'mixto', objectives: ['Usar useState', 'Aplicar useEffect', 'Evitar renders innecesarios'] },
  { id: 'mod-react-3', title: 'Hooks personalizados y contexto', description: 'Reutiliza lógica y comparte estado global.', skillId: 'sk-react', durationMinutes: 50, difficulty: 'avanzado', contentType: 'ejercicios', objectives: ['Crear custom hooks', 'Usar Context API', 'Estructurar estado global'] },

  // Python
  { id: 'mod-py-1', title: 'Sintaxis y estructuras de datos', description: 'Listas, diccionarios y control de flujo en Python.', skillId: 'sk-python', durationMinutes: 30, difficulty: 'basico', contentType: 'teorico', objectives: ['Usar listas y dicts', 'Escribir bucles', 'Definir funciones'] },
  { id: 'mod-py-2', title: 'Manipulación de datos con pandas', description: 'Carga y transformación de datos tabulares.', skillId: 'sk-python', durationMinutes: 45, difficulty: 'intermedio', contentType: 'practico', objectives: ['Cargar CSVs', 'Filtrar y agrupar', 'Crear columnas'] },

  // SQL
  { id: 'mod-sql-1', title: 'Consultas SELECT básicas', description: 'Filtrado, orden y agregaciones simples.', skillId: 'sk-sql', durationMinutes: 25, difficulty: 'basico', contentType: 'ejercicios', objectives: ['Escribir SELECT', 'Filtrar con WHERE', 'Ordenar resultados'] },
  { id: 'mod-sql-2', title: 'JOINs y relaciones', description: 'Combinar tablas con distintos tipos de JOIN.', skillId: 'sk-sql', durationMinutes: 40, difficulty: 'intermedio', contentType: 'mixto', objectives: ['Usar INNER JOIN', 'Comprender LEFT JOIN', 'Modelar relaciones'] },

  // Algoritmos
  { id: 'mod-algo-1', title: 'Complejidad y notación Big-O', description: 'Cómo medir la eficiencia de un algoritmo.', skillId: 'sk-algorithms', durationMinutes: 35, difficulty: 'intermedio', contentType: 'teorico', objectives: ['Entender Big-O', 'Comparar algoritmos', 'Estimar costos'] },
  { id: 'mod-algo-2', title: 'Búsqueda y ordenamiento', description: 'Algoritmos clásicos y cuándo usarlos.', skillId: 'sk-algorithms', durationMinutes: 50, difficulty: 'avanzado', contentType: 'ejercicios', objectives: ['Implementar búsqueda binaria', 'Comparar sorts', 'Elegir el algoritmo adecuado'] },

  // Machine Learning
  { id: 'mod-ml-1', title: 'Introducción al ML', description: '¿Qué es el aprendizaje automático y para qué sirve?', skillId: 'sk-ml', durationMinutes: 30, difficulty: 'basico', contentType: 'video', objectives: ['Definir ML', 'Distinguir tipos de aprendizaje', 'Identificar casos de uso'] },
  { id: 'mod-ml-2', title: 'Regresión y clasificación', description: 'Modelos supervisados fundamentales.', skillId: 'sk-ml', durationMinutes: 55, difficulty: 'avanzado', contentType: 'mixto', objectives: ['Entrenar un modelo', 'Evaluar métricas', 'Evitar overfitting'] },

  // Prompt Engineering
  { id: 'mod-prompt-1', title: 'Anatomía de un buen prompt', description: 'Estructura, contexto y restricciones efectivas.', skillId: 'sk-prompting', durationMinutes: 25, difficulty: 'basico', contentType: 'ejemplos_reales', objectives: ['Estructurar prompts', 'Dar contexto', 'Definir formato de salida'] },
  { id: 'mod-prompt-2', title: 'Técnicas avanzadas de prompting', description: 'Few-shot, chain-of-thought y patrones de razonamiento.', skillId: 'sk-prompting', durationMinutes: 40, difficulty: 'avanzado', contentType: 'ejemplos_reales', objectives: ['Aplicar few-shot', 'Guiar el razonamiento', 'Iterar prompts'] },

  // Visualización
  { id: 'mod-dv-1', title: 'Principios de visualización', description: 'Elegir el gráfico correcto para cada dato.', skillId: 'sk-dataviz', durationMinutes: 30, difficulty: 'basico', contentType: 'teorico', objectives: ['Elegir gráficos', 'Evitar distorsiones', 'Diseñar para claridad'] },

  // Inglés
  { id: 'mod-en-1', title: 'Inglés para reuniones', description: 'Frases clave para participar en reuniones en inglés.', skillId: 'sk-english', durationMinutes: 30, difficulty: 'basico', contentType: 'practico', objectives: ['Presentarte', 'Pedir aclaraciones', 'Resumir acuerdos'] },
  { id: 'mod-en-2', title: 'Escribir correos en inglés', description: 'Tono, estructura y fórmulas de cortesía.', skillId: 'sk-english', durationMinutes: 35, difficulty: 'intermedio', contentType: 'ejemplos_reales', objectives: ['Estructurar emails', 'Ajustar el tono', 'Evitar errores comunes'] },

  // Portugués
  { id: 'mod-pt-1', title: 'Portugués: primeras conversaciones', description: 'Saludos, presentaciones y frases útiles.', skillId: 'sk-portuguese', durationMinutes: 25, difficulty: 'basico', contentType: 'video', objectives: ['Saludar', 'Presentarte', 'Frases cotidianas'] },

  // Hablar en público
  { id: 'mod-ps-1', title: 'Vencer el miedo escénico', description: 'Técnicas para gestionar los nervios.', skillId: 'sk-public-speaking', durationMinutes: 25, difficulty: 'basico', contentType: 'teorico', objectives: ['Gestionar nervios', 'Respiración', 'Lenguaje corporal'] },
  { id: 'mod-ps-2', title: 'Estructura de una presentación', description: 'Apertura, desarrollo y cierre memorables.', skillId: 'sk-public-speaking', durationMinutes: 40, difficulty: 'intermedio', contentType: 'mixto', objectives: ['Diseñar apertura', 'Ordenar ideas', 'Cerrar con impacto'] },

  // Escritura
  { id: 'mod-wr-1', title: 'Escritura clara y concisa', description: 'Elimina la paja y comunica con precisión.', skillId: 'sk-writing', durationMinutes: 30, difficulty: 'basico', contentType: 'ejercicios', objectives: ['Simplificar frases', 'Estructurar párrafos', 'Revisar y editar'] },

  // Negociación
  { id: 'mod-neg-1', title: 'Fundamentos de negociación', description: 'Intereses, posiciones y zona de acuerdo.', skillId: 'sk-negotiation', durationMinutes: 35, difficulty: 'intermedio', contentType: 'ejemplos_reales', objectives: ['Identificar intereses', 'Definir tu BATNA', 'Crear valor'] },

  // Liderazgo
  { id: 'mod-lead-1', title: 'De colaborador a líder', description: 'El cambio de mentalidad al liderar.', skillId: 'sk-leadership', durationMinutes: 30, difficulty: 'basico', contentType: 'teorico', objectives: ['Delegar', 'Dar feedback', 'Construir confianza'] },
  { id: 'mod-lead-2', title: 'Feedback que impulsa', description: 'Modelos de feedback efectivo y empático.', skillId: 'sk-leadership', durationMinutes: 40, difficulty: 'intermedio', contentType: 'practico', objectives: ['Usar el modelo SBI', 'Dar feedback difícil', 'Hacer seguimiento'] },

  // Decisiones
  { id: 'mod-dec-1', title: 'Marcos de decisión', description: 'Herramientas para decidir con claridad.', skillId: 'sk-decision', durationMinutes: 35, difficulty: 'intermedio', contentType: 'mixto', objectives: ['Aplicar matrices', 'Ponderar criterios', 'Decidir bajo incertidumbre'] },

  // Gestión del tiempo
  { id: 'mod-tm-1', title: 'Priorización con Eisenhower', description: 'Distinguir lo urgente de lo importante.', skillId: 'sk-timemgmt', durationMinutes: 20, difficulty: 'basico', contentType: 'practico', objectives: ['Clasificar tareas', 'Eliminar lo trivial', 'Planificar el día'] },
  { id: 'mod-tm-2', title: 'Técnica Pomodoro en profundidad', description: 'Aprovecha al máximo los bloques de enfoque.', skillId: 'sk-timemgmt', durationMinutes: 25, difficulty: 'basico', contentType: 'teorico', objectives: ['Configurar pomodoros', 'Gestionar descansos', 'Medir tu enfoque'] },

  // Concentración
  { id: 'mod-fo-1', title: 'Trabajo profundo', description: 'Crea las condiciones para concentrarte de verdad.', skillId: 'sk-focus', durationMinutes: 30, difficulty: 'intermedio', contentType: 'teorico', objectives: ['Diseñar tu entorno', 'Bloquear distracciones', 'Rituales de enfoque'] },

  // Emprendimiento
  { id: 'mod-ent-1', title: 'Valida tu idea de negocio', description: 'Del problema al MVP con menos riesgo.', skillId: 'sk-entrepreneurship', durationMinutes: 40, difficulty: 'intermedio', contentType: 'ejemplos_reales', objectives: ['Detectar problemas reales', 'Diseñar un MVP', 'Medir aprendizaje'] },
  { id: 'mod-fin-1', title: 'Finanzas básicas para tu proyecto', description: 'Flujo de caja, costos y precios.', skillId: 'sk-finance', durationMinutes: 35, difficulty: 'basico', contentType: 'mixto', objectives: ['Estimar costos', 'Fijar precios', 'Proyectar caja'] },

  // Empleabilidad
  { id: 'mod-cv-1', title: 'Un CV que destaca', description: 'Estructura y logros que captan atención.', skillId: 'sk-cv', durationMinutes: 30, difficulty: 'basico', contentType: 'ejemplos_reales', objectives: ['Resaltar logros', 'Adaptar a la vacante', 'Evitar errores comunes'] },
  { id: 'mod-cv-2', title: 'Domina la entrevista', description: 'Responde con el método STAR y prepara preguntas.', skillId: 'sk-cv', durationMinutes: 40, difficulty: 'intermedio', contentType: 'practico', objectives: ['Usar método STAR', 'Manejar nervios', 'Preguntar con criterio'] },
  { id: 'mod-pb-1', title: 'Construye tu marca personal', description: 'Presencia profesional y networking efectivo.', skillId: 'sk-personal-brand', durationMinutes: 30, difficulty: 'basico', contentType: 'teorico', objectives: ['Definir tu propuesta', 'Optimizar tu perfil', 'Hacer networking'] },
];

export const MODULE_BY_ID: Record<string, ModuleContent> = Object.fromEntries(
  MODULES.map((m) => [m.id, m]),
);
