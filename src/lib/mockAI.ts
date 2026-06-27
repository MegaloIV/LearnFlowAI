// Simulación del "motor de IA". NO usa ningún LLM real ni backend.
// Lógica determinista que filtra/ordena los datos mock según el perfil.

import type {
  Activity,
  Diagnostic,
  DiagnosticQuestion,
  LearningGap,
  Level,
  ModuleContent,
  PathModule,
  PathType,
  Recommendation,
  UserGoal,
  UserProfile,
} from '@/types';
import { QUESTIONS, questionsFor } from '@/data/questions';
import { MODULES, MODULE_BY_ID } from '@/data/modules';
import { SKILL_BY_ID } from '@/data/skills';
import {
  ASSISTANT_FALLBACK,
  ASSISTANT_RESPONSES,
  RESPONSIBLE_AI_NOTICE,
} from '@/data/assistantResponses';
import { fakeAsync } from './fakeAsync';
import { uid } from './storage';

const LEVELS: Level[] = ['basico', 'intermedio', 'avanzado'];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// MOD-05 / HU-07: seleccionar preguntas de diagnóstico mezclando niveles.
export async function generateDiagnosticQuestions(
  skillIds: string[],
  count = 9,
): Promise<DiagnosticQuestion[]> {
  return fakeAsync(() => {
    const pool: DiagnosticQuestion[] = [];
    const perSkill = Math.max(3, Math.ceil(count / Math.max(1, skillIds.length)));
    for (const skillId of skillIds) {
      // toma un mix de niveles por habilidad
      for (const level of LEVELS) {
        const qs = shuffle(questionsFor(skillId, level)).slice(0, Math.ceil(perSkill / 3));
        pool.push(...qs);
      }
    }
    const selected = shuffle(pool).slice(0, count);
    // fallback: si faltan, completa con cualquier pregunta
    if (selected.length < count) {
      const extra = shuffle(QUESTIONS).filter((q) => !selected.includes(q));
      selected.push(...extra.slice(0, count - selected.length));
    }
    return selected;
  });
}

function classify(score: number): Level {
  if (score < 40) return 'basico';
  if (score <= 75) return 'intermedio';
  return 'avanzado';
}

// MOD-03 / HU-08: evaluar el diagnóstico y clasificar nivel.
export async function evaluateDiagnostic(
  questions: DiagnosticQuestion[],
  answers: number[],
): Promise<{ score: number; level: Level; perSkill: Diagnostic['perSkill'] }> {
  return fakeAsync(() => {
    let correct = 0;
    const bySkill: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q, i) => {
      const ok = answers[i] === q.correctIndex;
      if (ok) correct++;
      bySkill[q.skillId] ??= { correct: 0, total: 0 };
      bySkill[q.skillId].total++;
      if (ok) bySkill[q.skillId].correct++;
    });
    const score = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    const perSkill = Object.entries(bySkill).map(([skillId, v]) => {
      const s = Math.round((v.correct / v.total) * 100);
      return { skillId, score: s, level: classify(s) };
    });
    return { score, level: classify(score), perSkill };
  });
}

// HU-09: detectar brechas priorizadas.
export function detectLearningGaps(diagnostic: Diagnostic, userId: string): LearningGap[] {
  const sorted = [...diagnostic.perSkill].sort((a, b) => a.score - b.score);
  return sorted.map((ps, i) => {
    const moduleForSkill = MODULES.filter((m) => m.skillId === ps.skillId).sort(
      (a, b) => difficultyRank(a.difficulty) - difficultyRank(b.difficulty),
    )[0];
    return {
      id: uid('gap'),
      userId,
      skillId: ps.skillId,
      gapScore: 100 - ps.score,
      priority: i + 1,
      isResolved: ps.score >= 75,
      recommendedModuleId: moduleForSkill?.id,
    };
  });
}

function difficultyRank(d: Level): number {
  return LEVELS.indexOf(d);
}

// HU-10 / HU-42 / HU-43: generar ruta personalizada.
export async function generateLearningPath(
  profile: UserProfile,
  diagnostic: Diagnostic | null,
  goals: UserGoal[],
  type: PathType,
): Promise<{ title: string; modules: Omit<PathModule, 'pathId'>[] }> {
  return fakeAsync(() => {
    const targetSkills = profile.interestSkillIds.length
      ? profile.interestSkillIds
      : MODULES.slice(0, 4).map((m) => m.skillId);

    // ordena habilidades por brecha (si hay diagnóstico)
    const skillOrder = [...new Set(targetSkills)].sort((a, b) => {
      const sa = diagnostic?.perSkill.find((p) => p.skillId === a)?.score ?? 50;
      const sb = diagnostic?.perSkill.find((p) => p.skillId === b)?.score ?? 50;
      return sa - sb; // menor score primero (más brecha)
    });

    let candidates: ModuleContent[] = [];
    for (const skillId of skillOrder) {
      const mods = MODULES.filter((m) => m.skillId === skillId).sort(
        (a, b) => difficultyRank(a.difficulty) - difficultyRank(b.difficulty),
      );
      candidates.push(...mods);
    }

    // ruta rápida: menos módulos y más cortos
    if (type === 'quick') {
      candidates = candidates
        .filter((m) => m.durationMinutes <= 40)
        .slice(0, 4);
    } else {
      candidates = candidates.slice(0, 8);
    }

    if (candidates.length === 0) candidates = MODULES.slice(0, 4);

    const goalLabel = goals.find((g) => g.isActive)?.goalType;
    const title =
      type === 'quick'
        ? 'Ruta rápida personalizada'
        : `Ruta completa${goalLabel ? ` · ${goalLabel}` : ''}`;

    const modules: Omit<PathModule, 'pathId'>[] = candidates.map((m, i) => ({
      id: uid('pm'),
      moduleId: m.id,
      title: m.title,
      description: m.description,
      orderIndex: i,
      durationMinutes: m.durationMinutes,
      difficulty: m.difficulty,
      status: i === 0 ? 'in_progress' : 'pending',
    }));

    return { title, modules };
  });
}

// RF-05 / HU-13: recomendar contenido con una razón breve.
export async function recommendContent(
  profile: UserProfile,
  diagnostic: Diagnostic | null,
  goals: UserGoal[],
  userId: string,
): Promise<Recommendation[]> {
  return fakeAsync(() => {
    const recs: Recommendation[] = [];
    const weakest = diagnostic
      ? [...diagnostic.perSkill].sort((a, b) => a.score - b.score)[0]
      : null;

    const pool = MODULES.filter((m) => profile.interestSkillIds.includes(m.skillId));
    const source = pool.length ? pool : MODULES;

    const picks = shuffle(source).slice(0, 5);
    for (const m of picks) {
      let reason = `Coincide con tu interés en ${SKILL_BY_ID[m.skillId]?.name ?? 'esta área'}.`;
      if (weakest && m.skillId === weakest.skillId) {
        reason = `Refuerza ${SKILL_BY_ID[m.skillId]?.name}, donde tienes más oportunidad de mejora.`;
      } else if (goals.some((g) => g.isActive && g.goalType === 'empleabilidad')) {
        reason = `Te ayuda con tu objetivo de empleabilidad.`;
      } else if (m.difficulty === profile.perceivedLevel) {
        reason = `Está ajustado a tu nivel ${m.difficulty}.`;
      }
      recs.push({
        id: uid('rec'),
        userId,
        contentId: m.id,
        reason,
        rating: null,
        isDismissed: false,
        saved: false,
      });
    }
    return recs;
  });
}

// HU-36: adaptar dificultad según desempeño reciente.
export function adaptDifficulty(history: Activity[]): {
  suggestion: 'subir' | 'bajar' | 'mantener';
  avg: number;
} {
  const recent = history.slice(-5);
  if (recent.length === 0) return { suggestion: 'mantener', avg: 0 };
  const avg = Math.round(recent.reduce((s, a) => s + a.score, 0) / recent.length);
  if (avg < 50) return { suggestion: 'bajar', avg };
  if (avg > 85) return { suggestion: 'subir', avg };
  return { suggestion: 'mantener', avg };
}

// HU-28 / panel principal: siguiente actividad recomendada.
export function suggestNextActivity(
  pathModules: PathModule[] | undefined,
): PathModule | null {
  if (!pathModules || pathModules.length === 0) return null;
  const inProgress = pathModules.find((m) => m.status === 'in_progress');
  if (inProgress) return inProgress;
  const pending = pathModules
    .filter((m) => m.status === 'pending')
    .sort((a, b) => a.orderIndex - b.orderIndex)[0];
  return pending ?? null;
}

// HU-14: asistente IA por keywords (no LLM real).
export async function chatWithAssistant(
  message: string,
  moduleContext?: string,
): Promise<string> {
  return fakeAsync(() => {
    const text = message.toLowerCase();
    const match = ASSISTANT_RESPONSES.find((entry) =>
      entry.keywords.some((k) => text.includes(k)),
    );
    let response = match?.response ?? ASSISTANT_FALLBACK;
    if (moduleContext) {
      response = `Sobre "${MODULE_BY_ID[moduleContext]?.title ?? 'este módulo'}": ${response}`;
    }
    return response;
  }, 900);
}

export { RESPONSIBLE_AI_NOTICE };
