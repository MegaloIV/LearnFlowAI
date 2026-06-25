import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Dumbbell, BrainCircuit, Flag, ClipboardCheck, CheckCircle2 } from 'lucide-react';
import { MODULES, MODULE_BY_ID } from '@/data/modules';
import { SKILL_BY_ID } from '@/data/skills';
import { CHALLENGES } from '@/data/challenges';
import { useStore } from '@/store/useStore';
import { useCurrentUser, useActivePath, useActivities } from '@/store/selectors';
import { Card, Pill, SectionTitle, cx, Button } from '@/components/ui';
import { QuizRunner } from './QuizRunner';
import { uid } from '@/lib/storage';
import { evaluateBadges } from '@/lib/gamification';
import { toast } from '@/store/useToast';

type Tab = 'quiz' | 'exercise' | 'challenge' | 'test';

const TABS: { id: Tab; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'quiz', label: 'Repaso', icon: BrainCircuit, desc: 'Preguntas con feedback inmediato.' },
  { id: 'exercise', label: 'Ejercicios', icon: Dumbbell, desc: 'Práctica clasificada por dificultad.' },
  { id: 'challenge', label: 'Retos', icon: Flag, desc: 'Retos diarios y semanales.' },
  { id: 'test', label: 'Prueba corta', icon: ClipboardCheck, desc: 'Evaluación al cerrar el módulo.' },
];

export function ActivitiesPage() {
  const [params] = useSearchParams();
  const activePath = useActivePath();

  // módulos disponibles: los de la ruta activa o, si no hay, todos
  const pathModuleIds = activePath?.modules.map((m) => m.moduleId) ?? [];
  const available = pathModuleIds.length
    ? pathModuleIds.map((id) => MODULE_BY_ID[id]).filter(Boolean)
    : MODULES.slice(0, 10);

  const initialModule = params.get('module') ?? available[0]?.id ?? MODULES[0].id;
  const [moduleId, setModuleId] = useState(initialModule);
  const [tab, setTab] = useState<Tab>('quiz');

  return (
    <div className="space-y-6">
      <SectionTitle title="Actividades de aprendizaje" subtitle="Practica de forma activa para fijar lo aprendido." />

      <Card>
        <label className="label">Módulo</label>
        <select className="input" value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
          {available.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title} · {SKILL_BY_ID[m.skillId]?.name}
            </option>
          ))}
        </select>
      </Card>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cx(
              'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition',
              tab === t.id ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50',
            )}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-500">{TABS.find((t) => t.id === tab)!.desc}</p>

      {tab === 'quiz' && <QuizRunner key={`quiz-${moduleId}`} moduleId={moduleId} type="quiz" count={4} passThreshold={60} />}
      {tab === 'exercise' && <QuizRunner key={`ex-${moduleId}`} moduleId={moduleId} type="exercise" count={3} passThreshold={60} />}
      {tab === 'test' && <QuizRunner key={`test-${moduleId}`} moduleId={moduleId} type="test" count={5} passThreshold={60} />}
      {tab === 'challenge' && <Challenges />}
    </div>
  );
}

function Challenges() {
  const user = useCurrentUser();
  const activities = useActivities();
  const addActivity = useStore((s) => s.addActivity);

  const today = new Date().toDateString();
  const completedTodayIds = new Set(
    activities
      .filter((a) => a.type === 'challenge' && new Date(a.completedAt).toDateString() === today)
      .map((a) => a.moduleId),
  );

  function complete(challengeId: string) {
    if (!user) return;
    addActivity({
      id: uid('act'),
      userId: user.id,
      moduleId: challengeId, // usamos moduleId como referencia del reto
      type: 'challenge',
      score: 100,
      timeSpentS: 0,
      completedAt: new Date().toISOString(),
    });
    evaluateBadges();
    toast.success('¡Reto completado! 🏆');
  }

  return (
    <div className="space-y-3">
      {CHALLENGES.map((c) => {
        const done = completedTodayIds.has(c.id);
        return (
          <Card key={c.id} className={cx('flex items-center gap-4', done && 'bg-emerald-50/40')}>
            <button
              onClick={() => !done && complete(c.id)}
              className={cx(
                'grid h-7 w-7 shrink-0 place-items-center rounded-md border-2 transition',
                done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 hover:border-brand-400',
              )}
            >
              {done && <CheckCircle2 className="h-5 w-5" />}
            </button>
            <div className="min-w-0 flex-1">
              <p className={cx('font-semibold', done ? 'text-slate-500 line-through' : 'text-slate-800')}>{c.title}</p>
              <p className="text-sm text-slate-500">{c.description}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Pill tone={c.cadence === 'daily' ? 'brand' : 'violet'}>{c.cadence === 'daily' ? 'Diario' : 'Semanal'}</Pill>
              {!done && <Button size="sm" variant="ghost" onClick={() => complete(c.id)}>Completar</Button>}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
