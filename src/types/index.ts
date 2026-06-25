// ============================================================================
// LearnFlow AI — Tipos de dominio (frontend puro, sin SQL/FKs reales).
// Las relaciones se modelan por `id` en memoria.
// ============================================================================

export type UserType = 'student' | 'professional';
export type Level = 'basico' | 'intermedio' | 'avanzado';
export type LearningStyle =
  | 'teorico'
  | 'practico'
  | 'mixto'
  | 'video'
  | 'ejercicios'
  | 'ejemplos_reales';

export interface User {
  id: string;
  name: string;
  email: string;
  /** Campo ficticio solo para el demo — NO es un hash real. */
  password: string;
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  type: UserType;
  career?: string;
  profession?: string;
  availabilityMinutes: number; // minutos por sesión
  frequencyWeekly: number; // sesiones por semana
  perceivedLevel: Level;
  learningStyle: LearningStyle[];
  interestSkillIds: string[];
  disableMotivational?: boolean;
}

export type GoalType =
  | 'empleabilidad'
  | 'ascenso'
  | 'cambio_carrera'
  | 'examen'
  | 'proyecto_personal'
  | 'curiosidad'
  | 'otro';

export interface UserGoal {
  id: string;
  userId: string;
  goalType: GoalType;
  customDescription?: string;
  isActive: boolean;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  priority: number;
}

export type SkillCategory =
  | 'programacion'
  | 'inteligencia_artificial'
  | 'idiomas'
  | 'comunicacion'
  | 'liderazgo'
  | 'productividad'
  | 'emprendimiento'
  | 'empleabilidad';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
}

export interface DiagnosticQuestion {
  id: string;
  skillId: string;
  level: Level;
  prompt: string;
  options: string[];
  correctIndex: number;
}

export interface Diagnostic {
  id: string;
  userId: string;
  skillIds: string[];
  level: Level;
  score: number; // 0-100
  attemptedAt: string;
  questionIds: string[];
  answers: number[]; // índice elegido por pregunta
  perSkill: { skillId: string; score: number; level: Level }[];
}

export interface LearningGap {
  id: string;
  userId: string;
  skillId: string;
  gapScore: number; // 0-100, mayor = más brecha
  priority: number;
  isResolved: boolean;
  recommendedModuleId?: string;
}

export type ContentType =
  | 'teorico'
  | 'practico'
  | 'mixto'
  | 'video'
  | 'ejercicios'
  | 'ejemplos_reales';

export interface ModuleContent {
  id: string;
  title: string;
  description: string;
  skillId: string;
  durationMinutes: number;
  difficulty: Level;
  contentType: ContentType;
  objectives: string[];
}

export type PathType = 'quick' | 'full';
export type PathStatus = 'active' | 'completed' | 'paused';
export type ModuleStatus = 'pending' | 'in_progress' | 'completed';

export interface PathModule {
  id: string;
  pathId: string;
  moduleId: string;
  title: string;
  description: string;
  orderIndex: number;
  durationMinutes: number;
  difficulty: Level;
  status: ModuleStatus;
}

export interface LearningPath {
  id: string;
  userId: string;
  title: string;
  type: PathType;
  status: PathStatus;
  progressPct: number;
  createdAt: string;
  modules: PathModule[];
}

export type ActivityType = 'quiz' | 'exercise' | 'challenge' | 'test';

export interface Activity {
  id: string;
  userId: string;
  moduleId: string;
  type: ActivityType;
  score: number; // 0-100
  timeSpentS: number;
  completedAt: string;
}

export interface Recommendation {
  id: string;
  userId: string;
  contentId: string;
  reason: string;
  rating: 'up' | 'down' | null;
  isDismissed: boolean;
  saved: boolean;
}

export type BadgeType =
  | 'primer_paso'
  | 'racha_3'
  | 'modulo_maestro'
  | 'reto_aceptado'
  | 'diagnostico_completo'
  | 'ruta_completa'
  | 'madrugador'
  | 'perfeccionista';

export interface BadgeDef {
  type: BadgeType;
  name: string;
  description: string;
  icon: string;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeType: BadgeType;
  earnedAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  pathId: string;
  pathTitle: string;
  issuedAt: string;
}

export interface PersonalGoal {
  id: string;
  userId: string;
  skillId: string;
  name: string;
  description: string;
  targetDate: string;
  progressPct: number;
  isCompleted: boolean;
}

export interface StudySession {
  id: string;
  userId: string;
  scheduledAt: string;
  durationMinutes: number;
  notes: string;
  isCompleted: boolean;
}

export type NotificationType =
  | 'reminder'
  | 'badge'
  | 'recommendation'
  | 'difficulty'
  | 'motivational'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  sentAt: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  type: ContentType;
  level: Level;
  skillId: string;
  url: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  skillId: string;
  cadence: 'daily' | 'weekly';
  rewardBadge?: BadgeType;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  at: string;
}
