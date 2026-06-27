import { useMemo, useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import type { ActivityType, DiagnosticQuestion } from '@/types';
import { questionsFor } from '@/data/questions';
import { MODULE_BY_ID } from '@/data/modules';
import { useStore } from '@/store/useStore';
import { useCurrentUser } from '@/store/selectors';
import { Button, Card, Pill, ProgressBar, cx } from '@/components/ui';
import { uid } from '@/lib/storage';
import { evaluateBadges } from '@/lib/gamification';
import { toast } from '@/store/useToast';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function QuizRunner({
  moduleId,
  type,
  count,
  passThreshold = 60,
}: {
  moduleId: string;
  type: ActivityType;
  count: number;
  passThreshold?: number;
}) {
  const user = useCurrentUser();
  const addActivity = useStore((s) => s.addActivity);

  const mod = MODULE_BY_ID[moduleId];
  const questions = useMemo<DiagnosticQuestion[]>(() => {
    if (!mod) return [];
    const pool = questionsFor(mod.skillId);
    return shuffle(pool).slice(0, count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, type]);

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [startedAt] = useState(Date.now());
  const [done, setDone] = useState(false);

  if (questions.length === 0) {
    return <p className="text-sm text-slate-500">No hay preguntas disponibles para este módulo.</p>;
  }

  const q = questions[idx];

  function check() {
    if (selected === null) return;
    setRevealed(true);
    if (selected === q.correctIndex) setCorrectCount((c) => c + 1);
  }

  function next() {
    if (idx + 1 >= questions.length) {
      finish();
      return;
    }
    setIdx((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  }

  function finish() {
    const finalCorrect = correctCount;
    const score = Math.round((finalCorrect / questions.length) * 100);
    if (user) {
      addActivity({
        id: uid('act'),
        userId: user.id,
        moduleId,
        type,
        score,
        timeSpentS: Math.round((Date.now() - startedAt) / 1000),
        completedAt: new Date().toISOString(),
      });
      evaluateBadges();
    }
    setDone(true);
  }

  function restart() {
    setIdx(0); setSelected(null); setRevealed(false); setCorrectCount(0); setDone(false);
  }

  if (done) {
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= passThreshold;
    return (
      <Card className="text-center">
        <div className={cx('mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full', passed ? 'bg-emerald-50' : 'bg-amber-50')}>
          {passed ? <CheckCircle2 className="h-9 w-9 text-emerald-500" /> : <RotateCcw className="h-9 w-9 text-amber-500" />}
        </div>
        <p className="text-3xl font-extrabold text-slate-900">{score}%</p>
        <p className="mt-1 text-sm text-slate-500">{correctCount} de {questions.length} correctas</p>
        <div className="mt-3">
          {type === 'test' ? (
            <Pill tone={passed ? 'green' : 'amber'}>
              {passed ? 'Aprobado' : 'Requiere repaso'}
            </Pill>
          ) : (
            <Pill tone={passed ? 'green' : 'amber'}>{passed ? '¡Buen trabajo!' : 'Sigue practicando'}</Pill>
          )}
        </div>
        {!passed && (
          <p className="mx-auto mt-3 max-w-sm text-sm text-amber-600">
            Te recomendamos repasar este módulo antes de continuar (HU-53).
          </p>
        )}
        <div className="mt-5 flex justify-center gap-2">
          <Button variant="outline" onClick={restart} icon={<RotateCcw className="h-4 w-4" />}>Reintentar</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Pill tone="brand">{idx + 1} / {questions.length}</Pill>
        <Pill tone="violet">{q.level}</Pill>
      </div>
      <ProgressBar value={(idx / questions.length) * 100} />
      <Card>
        <h3 className="mb-4 font-bold text-slate-900">{q.prompt}</h3>
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correctIndex;
            const isSelected = i === selected;
            return (
              <button
                key={i}
                disabled={revealed}
                onClick={() => setSelected(i)}
                className={cx(
                  'flex w-full items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm transition',
                  !revealed && isSelected && 'border-brand-500 bg-brand-50',
                  !revealed && !isSelected && 'border-slate-200 hover:border-slate-300',
                  revealed && isCorrect && 'border-emerald-400 bg-emerald-50',
                  revealed && isSelected && !isCorrect && 'border-red-400 bg-red-50',
                  revealed && !isCorrect && !isSelected && 'border-slate-200 opacity-60',
                )}
              >
                <span>{opt}</span>
                {revealed && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                {revealed && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500" />}
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className={cx('mt-4 rounded-lg px-3 py-2 text-sm', selected === q.correctIndex ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700')}>
            {selected === q.correctIndex ? '✓ ¡Correcto!' : `✗ Incorrecto. La respuesta correcta es "${q.options[q.correctIndex]}".`}
          </div>
        )}

        <div className="mt-5 flex justify-end">
          {!revealed ? (
            <Button onClick={check} disabled={selected === null}>Comprobar</Button>
          ) : (
            <Button onClick={next}>{idx + 1 >= questions.length ? 'Ver resultado' : 'Siguiente'}</Button>
          )}
        </div>
      </Card>
    </div>
  );
}

export function toastFeedback(passed: boolean) {
  if (passed) toast.success('¡Bien hecho!');
  else toast.info('Sigue practicando, vas mejorando.');
}
