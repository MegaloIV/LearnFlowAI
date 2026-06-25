import type { DiagnosticQuestion, Level } from '@/types';
import { SKILLS } from './skills';

// Preguntas curadas para las habilidades más representativas.
const CURATED: DiagnosticQuestion[] = [
  // JavaScript
  { id: 'q-js-b1', skillId: 'sk-js', level: 'basico', prompt: '¿Qué palabra clave declara una variable que no puede ser reasignada?', options: ['const', 'var', 'let', 'static'], correctIndex: 0 },
  { id: 'q-js-b2', skillId: 'sk-js', level: 'basico', prompt: '¿Cuál es el resultado de typeof []?', options: ['"object"', '"array"', '"list"', '"undefined"'], correctIndex: 0 },
  { id: 'q-js-b3', skillId: 'sk-js', level: 'basico', prompt: '¿Qué método convierte un JSON string en objeto?', options: ['JSON.parse', 'JSON.stringify', 'JSON.toObject', 'JSON.read'], correctIndex: 0 },
  { id: 'q-js-i1', skillId: 'sk-js', level: 'intermedio', prompt: 'Un closure permite a una función...', options: ['Acceder a variables de su ámbito externo', 'Ejecutarse en paralelo', 'Eliminar variables globales', 'Convertirse en clase'], correctIndex: 0 },
  { id: 'q-js-i2', skillId: 'sk-js', level: 'intermedio', prompt: '¿Qué hace Array.prototype.map?', options: ['Crea un nuevo array transformando cada elemento', 'Filtra elementos', 'Suma los elementos', 'Ordena el array'], correctIndex: 0 },
  { id: 'q-js-a1', skillId: 'sk-js', level: 'avanzado', prompt: '¿Qué devuelve una función async?', options: ['Una promesa', 'Un callback', 'Un generador', 'Undefined siempre'], correctIndex: 0 },
  { id: 'q-js-a2', skillId: 'sk-js', level: 'avanzado', prompt: 'Para esperar varias promesas en paralelo usamos...', options: ['Promise.all', 'Promise.then', 'await loop', 'setTimeout'], correctIndex: 0 },

  // React
  { id: 'q-react-b1', skillId: 'sk-react', level: 'basico', prompt: '¿Cómo se pasan datos de un componente padre a un hijo?', options: ['Mediante props', 'Mediante estado global obligatorio', 'Con variables globales', 'No se puede'], correctIndex: 0 },
  { id: 'q-react-b2', skillId: 'sk-react', level: 'basico', prompt: 'JSX permite...', options: ['Escribir markup dentro de JavaScript', 'Reemplazar CSS', 'Conectar a la base de datos', 'Compilar Python'], correctIndex: 0 },
  { id: 'q-react-i1', skillId: 'sk-react', level: 'intermedio', prompt: '¿Qué hook gestiona estado local?', options: ['useState', 'useFetch', 'useRouter', 'useStyle'], correctIndex: 0 },
  { id: 'q-react-i2', skillId: 'sk-react', level: 'intermedio', prompt: '¿Cuándo se ejecuta useEffect con arreglo de dependencias vacío?', options: ['Solo al montar', 'En cada render', 'Nunca', 'Solo al desmontar'], correctIndex: 0 },
  { id: 'q-react-a1', skillId: 'sk-react', level: 'avanzado', prompt: '¿Para qué sirve un custom hook?', options: ['Reutilizar lógica con estado entre componentes', 'Reemplazar el DOM', 'Crear rutas', 'Definir estilos'], correctIndex: 0 },

  // Python
  { id: 'q-py-b1', skillId: 'sk-python', level: 'basico', prompt: '¿Qué estructura usa pares clave-valor en Python?', options: ['dict', 'list', 'tuple', 'set'], correctIndex: 0 },
  { id: 'q-py-b2', skillId: 'sk-python', level: 'basico', prompt: '¿Cómo se define una función en Python?', options: ['def nombre():', 'function nombre()', 'func nombre()', 'fn nombre()'], correctIndex: 0 },
  { id: 'q-py-i1', skillId: 'sk-python', level: 'intermedio', prompt: 'En pandas, ¿qué representa un DataFrame?', options: ['Una tabla bidimensional', 'Un único valor', 'Un gráfico', 'Una conexión'], correctIndex: 0 },

  // SQL
  { id: 'q-sql-b1', skillId: 'sk-sql', level: 'basico', prompt: '¿Qué cláusula filtra filas en SQL?', options: ['WHERE', 'ORDER BY', 'GROUP', 'SELECTIF'], correctIndex: 0 },
  { id: 'q-sql-i1', skillId: 'sk-sql', level: 'intermedio', prompt: '¿Qué JOIN devuelve solo filas con coincidencia en ambas tablas?', options: ['INNER JOIN', 'LEFT JOIN', 'FULL JOIN', 'CROSS JOIN'], correctIndex: 0 },

  // Prompt Engineering
  { id: 'q-prompt-b1', skillId: 'sk-prompting', level: 'basico', prompt: 'Un buen prompt normalmente incluye...', options: ['Contexto, tarea y formato esperado', 'Solo una palabra', 'Únicamente emojis', 'El código fuente del modelo'], correctIndex: 0 },
  { id: 'q-prompt-a1', skillId: 'sk-prompting', level: 'avanzado', prompt: '¿Qué es "few-shot prompting"?', options: ['Dar ejemplos en el prompt', 'Usar pocos tokens', 'Entrenar el modelo', 'Reducir la temperatura'], correctIndex: 0 },

  // Inglés
  { id: 'q-en-b1', skillId: 'sk-english', level: 'basico', prompt: 'En una reunión, "Could you clarify that?" sirve para...', options: ['Pedir una aclaración', 'Despedirte', 'Agradecer', 'Interrumpir groseramente'], correctIndex: 0 },

  // Gestión del tiempo
  { id: 'q-tm-b1', skillId: 'sk-timemgmt', level: 'basico', prompt: 'La matriz de Eisenhower clasifica tareas por...', options: ['Urgencia e importancia', 'Color y tamaño', 'Costo y duración', 'Orden alfabético'], correctIndex: 0 },

  // Liderazgo
  { id: 'q-lead-b1', skillId: 'sk-leadership', level: 'basico', prompt: 'Delegar eficazmente implica...', options: ['Confiar y dar contexto claro', 'Hacer todo tú mismo', 'No dar seguimiento', 'Ocultar información'], correctIndex: 0 },
];

// Generador determinista de preguntas de relleno para garantizar variedad
// en cualquier combinación habilidad + nivel.
const LEVELS: Level[] = ['basico', 'intermedio', 'avanzado'];

function generateForSkill(skillId: string, skillName: string): DiagnosticQuestion[] {
  const out: DiagnosticQuestion[] = [];
  for (const level of LEVELS) {
    for (let i = 1; i <= 4; i++) {
      out.push({
        id: `q-${skillId}-${level}-gen${i}`,
        skillId,
        level,
        prompt: `(${level}) Pregunta ${i}: ¿cuál es una buena práctica al aplicar "${skillName}"?`,
        options: [
          `Aplicar fundamentos de ${skillName} de forma deliberada`,
          `Ignorar por completo el contexto`,
          `Memorizar sin entender`,
          `Evitar practicar`,
        ],
        correctIndex: 0,
      });
    }
  }
  return out;
}

const GENERATED: DiagnosticQuestion[] = SKILLS.flatMap((s) =>
  generateForSkill(s.id, s.name),
);

export const QUESTIONS: DiagnosticQuestion[] = [...CURATED, ...GENERATED];

export function questionsFor(skillId: string, level?: Level): DiagnosticQuestion[] {
  return QUESTIONS.filter((q) => q.skillId === skillId && (!level || q.level === level));
}

export const QUESTION_BY_ID: Record<string, DiagnosticQuestion> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q]),
);
