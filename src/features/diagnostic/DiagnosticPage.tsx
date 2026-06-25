import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, ChevronRight, Clock, AlertTriangle } from 'lucide-react';
import type { Diagnostic, DiagnosticQuestion } from '@/types';
import {
  generateDiagnosticQuestions,
  evaluateDiagnostic,
  detectLearningGaps,
} from '@/lib/mockAI';
import { useStore } from '@/store/useStore';
import { useCurrentUser, useProfile, useLatestDiagnostic } from '@/store/selectors';
import { Button, Card, Loader, Pill, SectionTitle, ProgressBar, cx } from '@/components/ui';
import { SKILL_BY_ID } from '@/data/skills';
import { evaluateBadges } from '@/lib/gamification';
import { uid } from '@/lib/storage';
import { toast } from '@/store/useToast';

type Phase = 'intro' | 'loading' | 'quiz' | 'evaluating';

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export function DiagnosticPage() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const profile = useProfile();
  const latest = useLatestDiagnostic();
  const addDiagnostic = useStore((s) => s.addDiagnostic);
  const setGaps = useStore((s) => s.setGaps);

  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [idx, setIdx] = useState(0);

  const daysSinceLast = latest
    ? (Date.now() - new Date(latest.attemptedAt).getTime()) / (24 * 60 * 60 * 1000)
    : Infinity;
  const lockedByCooldown = latest ? Date.now() - new Date(latest.attemptedAt).getTime() < SEVEN_DAYS : false;

  async function startQuiz() {
    if (!profile) return;
    setPhase('loading');
    const qs = await generateDiagnosticQuestions(profile.interestSkillIds, 9);
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(-1));
    setIdx(0);
    setPhase('quiz');
  }

  function answer(optionIndex: number) {
    setAnswers((cur) => {
      const next = [...cur];
      next[idx] = optionIndex;
      return next;
    });
  }

  async function finish() {
    if (!user) return;
    setPhase('evaluating');
    const { score, level, perSkill } = await evaluateDiagnostic(questions, answers);
    const diagnostic: Diagnostic = {
      id: uid('diag'),
      userId: user.id,
      skillIds: [...new Set(questions.map((q) => q.skillId))],
      level,
      score,
      attemptedAt: new Date().toISOString(),
      questionIds: questions.map((q) => q.id),
      answers,
      perSkill,
    };
    addDiagnostic(diagnostic);
    setGaps(detectLearningGaps(diagnostic, user.id));
    evaluateBadges();
    toast.success('Diagnóstico completado.');
    navigate('/diagnostic/results');
  }

  if (phase === 'loading')
    return <Loader label="Generando tu diagnóstico personalizado…" />;
  if (phase === 'evaluating')
    return <Loader label="Evaluando tus respuestas con el motor de IA…" />;

  if (phase === 'quiz') {
    const q = questions[idx];
    const answered = answers[idx] !== -1;
    const isLast = idx === questions.length - 1;
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="flex items-center justify-between">
          <Pill tone="brand">Pregunta {idx + 1} de {questions.length}</Pill>
          <Pill tone="slate">{SKILL_BY_ID[q.skillId]?.name}</Pill>
        </div>
        <ProgressBar value={((idx) / questions.length) * 100} />
        <Card>
          <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Nivel {q.level}</p>
          <h2 className="mb-5 text-lg font-bold text-slate-900">{q.prompt}</h2>
          <div className="space-y-2">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => answer(i)}
                className={cx(
                  'flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm transition',
                  answers[idx] === i
                    ? 'border-brand-500 bg-brand-50 text-brand-800'
                    : 'border-slate-200 hover:border-slate-300',
                )}
              >
                <span className={cx(
                  'grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-bold',
                  answers[idx] === i ? 'border-brand-500 bg-brand-600 text-white' : 'border-slate-300 text-slate-500',
                )}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            ))}
          </div>
        </Card>
        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0}>
            Anterior
          </Button>
          {isLast ? (
            <Button onClick={finish} disabled={!answered}>Finalizar diagnóstico</Button>
          ) : (
            <Button onClick={() => setIdx((i) => i + 1)} disabled={!answered}>
              Siguiente <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // intro
  return (
    <div className="space-y-6">
      <SectionTitle
        title="Diagnóstico inteligente"
        subtitle="Mide tu nivel actual por habilidad para personalizar tu ruta."
      />
      <Card className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <Stethoscope className="h-7 w-7" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900">
            {latest ? 'Repetir diagnóstico' : 'Tu primer diagnóstico'}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Responderás ~9 preguntas de tus habilidades de interés, mezclando niveles básico,
            intermedio y avanzado. Es una sesión continua y toma unos minutos.
          </p>
        </div>
      </Card>

      {latest && (
        <Card className="bg-slate-50">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <p className="text-sm text-slate-600">
              Último diagnóstico: <b>{new Date(latest.attemptedAt).toLocaleDateString()}</b> · nivel{' '}
              <b>{latest.level}</b> · {latest.score}%
            </p>
          </div>
          {lockedByCooldown && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Por buenas prácticas se recomienda esperar 7 días entre diagnósticos (han pasado{' '}
                {Math.floor(daysSinceLast)}). Puedes repetirlo igualmente en este prototipo.
              </span>
            </div>
          )}
        </Card>
      )}

      <Button size="lg" onClick={startQuiz}>
        {latest ? 'Repetir diagnóstico' : 'Comenzar diagnóstico'}
      </Button>
    </div>
  );
}
