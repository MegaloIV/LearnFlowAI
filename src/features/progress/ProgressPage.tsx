import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import {
  PlayCircle, ListTodo, CalendarRange, History, Target as TargetIcon,
} from 'lucide-react';
import { useActivePath, useActivities, usePersonalGoals, useLatestDiagnostic } from '@/store/selectors';
import { Card, EmptyState, Pill, ProgressBar, SectionTitle, Button, cx } from '@/components/ui';
import { MODULE_BY_ID } from '@/data/modules';
import { SKILL_BY_ID } from '@/data/skills';
import { suggestNextActivity } from '@/lib/mockAI';

export function ProgressPage() {
  const activePath = useActivePath();
  const activities = useActivities();
  const personalGoals = usePersonalGoals();
  const diagnostic = useLatestDiagnostic();
  const [showWeekly, setShowWeekly] = useState(false);

  const completed = activePath?.modules.filter((m) => m.status === 'completed').length ?? 0;
  const totalModules = activePath?.modules.length ?? 0;
  const pending = activePath?.modules.filter((m) => m.status !== 'completed') ?? [];
  const nextModule = suggestNextActivity(activePath?.modules);

  // progreso por habilidad: promedio de actividades por skill + diagnóstico
  const perSkill = useMemo(() => {
    const map: Record<string, { sum: number; n: number }> = {};
    for (const a of activities) {
      const skillId = MODULE_BY_ID[a.moduleId]?.skillId;
      if (!skillId) continue;
      map[skillId] ??= { sum: 0, n: 0 };
      map[skillId].sum += a.score;
      map[skillId].n += 1;
    }
    diagnostic?.perSkill.forEach((p) => {
      map[p.skillId] ??= { sum: 0, n: 0 };
      map[p.skillId].sum += p.score;
      map[p.skillId].n += 1;
    });
    return Object.entries(map).map(([skillId, v]) => ({
      skill: SKILL_BY_ID[skillId]?.name ?? skillId,
      score: Math.round(v.sum / v.n),
    }));
  }, [activities, diagnostic]);

  // resumen semanal (últimos 7 días)
  const weekActivities = activities.filter(
    (a) => Date.now() - new Date(a.completedAt).getTime() < 7 * 24 * 60 * 60 * 1000,
  );
  const weekAvg = weekActivities.length
    ? Math.round(weekActivities.reduce((s, a) => s + a.score, 0) / weekActivities.length)
    : 0;

  return (
    <div className="space-y-6">
      <SectionTitle title="Seguimiento de progreso" subtitle="Visualiza tu avance, fortalezas y lo que sigue." />

      {/* Continuar donde lo dejé (HU-34) */}
      {nextModule && (
        <Card className="flex flex-col items-start gap-4 border-brand-200 bg-brand-50/40 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <PlayCircle className="h-9 w-9 text-brand-600" />
            <div>
              <p className="text-xs font-semibold uppercase text-brand-600">Continuar donde lo dejé</p>
              <p className="font-bold text-slate-900">{nextModule.title}</p>
            </div>
          </div>
          <Link to={`/path/module/${nextModule.id}`}><Button>Retomar</Button></Link>
        </Card>
      )}

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Avance de ruta" value={`${activePath?.progressPct ?? 0}%`} sub={`${completed}/${totalModules} módulos`} />
        <Kpi label="Actividades hechas" value={`${activities.length}`} sub="ejercicios, retos y pruebas" />
        <Kpi label="Promedio reciente" value={`${weekAvg}%`} sub="últimos 7 días" />
      </div>

      {activePath ? (
        <Card>
          <p className="mb-2 text-sm font-semibold text-slate-700">Avance general de la ruta</p>
          <ProgressBar value={activePath.progressPct} />
        </Card>
      ) : (
        <EmptyState title="Sin ruta activa" description="Genera tu ruta para empezar a medir tu progreso." action={<Link to="/path"><Button>Generar ruta</Button></Link>} />
      )}

      {/* Progreso por habilidad (HU-19) */}
      {perSkill.length > 0 && (
        <Card>
          <p className="mb-3 text-sm font-semibold text-slate-700">Progreso por habilidad</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perSkill} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="skill" width={120} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                  {perSkill.map((d, i) => (
                    <Cell key={i} fill={d.score >= 75 ? '#10b981' : d.score >= 40 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {/* Pendientes por prioridad (HU-45) */}
        <Card>
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <ListTodo className="h-4 w-4 text-brand-600" /> Pendientes por prioridad
          </p>
          {pending.length === 0 ? (
            <p className="text-sm text-slate-400">¡No tienes pendientes! 🎉</p>
          ) : (
            <ul className="space-y-2">
              {pending.slice(0, 5).map((m, i) => (
                <li key={m.id} className="flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">{i + 1}</span>
                  <Link to={`/path/module/${m.id}`} className="flex-1 truncate text-sm text-slate-700 hover:text-brand-600">{m.title}</Link>
                  <Pill tone={m.status === 'in_progress' ? 'brand' : 'slate'}>{m.status === 'in_progress' ? 'En curso' : 'Pendiente'}</Pill>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Comparación vs metas (HU-49) */}
        <Card>
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <TargetIcon className="h-4 w-4 text-brand-600" /> Avance vs. metas
          </p>
          {personalGoals.length === 0 ? (
            <p className="text-sm text-slate-400">
              No tienes metas.{' '}
              <Link to="/gamification" className="text-brand-600 hover:underline">Crea una</Link>.
            </p>
          ) : (
            <div className="space-y-3">
              {personalGoals.slice(0, 4).map((g) => (
                <div key={g.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="truncate text-slate-700">{g.name}</span>
                    <span className="text-slate-500">{g.progressPct}%</span>
                  </div>
                  <ProgressBar value={g.progressPct} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Resumen semanal on-demand (HU-44) */}
      <Card>
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <CalendarRange className="h-4 w-4 text-brand-600" /> Resumen semanal
          </p>
          <Button size="sm" variant="outline" onClick={() => setShowWeekly((v) => !v)}>
            {showWeekly ? 'Ocultar' : 'Ver resumen de esta semana'}
          </Button>
        </div>
        {showWeekly && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <MiniStat label="Actividades" value={weekActivities.length} />
            <MiniStat label="Promedio" value={`${weekAvg}%`} />
            <MiniStat label="Tiempo total" value={`${Math.round(weekActivities.reduce((s, a) => s + a.timeSpentS, 0) / 60)} min`} />
            <p className="sm:col-span-3 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700">
              {weekActivities.length === 0
                ? 'Esta semana aún no registras actividad. ¡Empieza con un repaso corto!'
                : `¡Buen ritmo! Completaste ${weekActivities.length} actividad(es) con un promedio de ${weekAvg}%.`}
            </p>
          </div>
        )}
      </Card>

      {/* Historial / actividad reciente (HU-20 / HU-51) */}
      <Card>
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <History className="h-4 w-4 text-brand-600" /> Historial de aprendizaje
        </p>
        {activities.length === 0 ? (
          <p className="text-sm text-slate-400">Sin actividad todavía.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {activities.slice(0, 10).map((a) => (
              <li key={a.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <span className={cx('grid h-8 w-8 place-items-center rounded-lg text-xs font-bold',
                    a.score >= 60 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600')}>
                    {a.score}%
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {MODULE_BY_ID[a.moduleId]?.title ?? 'Reto'}
                    </p>
                    <p className="text-xs text-slate-400">{labelType(a.type)}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">{new Date(a.completedAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Kpi({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <Card>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-slate-900">{value}</p>
      <p className="text-xs text-slate-400">{sub}</p>
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 text-center">
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}

function labelType(t: string): string {
  return { quiz: 'Repaso', exercise: 'Ejercicio', challenge: 'Reto', test: 'Prueba corta' }[t] ?? t;
}
