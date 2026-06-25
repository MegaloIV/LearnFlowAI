import { Link } from 'react-router-dom';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from 'recharts';
import { ArrowRight, TrendingUp, TrendingDown, Minus, Target } from 'lucide-react';
import { useDiagnostics, useGaps } from '@/store/selectors';
import { Card, EmptyState, Pill, SectionTitle, Button, ProgressBar } from '@/components/ui';
import { SKILL_BY_ID } from '@/data/skills';
import { MODULE_BY_ID } from '@/data/modules';

const LEVEL_TONE = { basico: 'red', intermedio: 'amber', avanzado: 'green' } as const;

export function DiagnosticResultsPage() {
  const diagnostics = useDiagnostics();
  const gaps = useGaps();
  const latest = diagnostics[0];
  const previous = diagnostics[1];

  if (!latest) {
    return (
      <EmptyState
        icon={<Target className="h-10 w-10" />}
        title="Aún no tienes resultados"
        description="Completa tu diagnóstico para ver tu nivel y brechas."
        action={<Link to="/diagnostic"><Button>Ir al diagnóstico</Button></Link>}
      />
    );
  }

  const radarData = latest.perSkill.map((p) => ({
    skill: SKILL_BY_ID[p.skillId]?.name ?? p.skillId,
    score: p.score,
  }));

  const strengths = [...latest.perSkill].sort((a, b) => b.score - a.score).slice(0, 2);
  const weaknesses = [...latest.perSkill].sort((a, b) => a.score - b.score).slice(0, 2);

  const trend = previous ? latest.score - previous.score : null;

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Resultados del diagnóstico"
        subtitle={`Realizado el ${new Date(latest.attemptedAt).toLocaleDateString()}`}
        action={<Link to="/path"><Button icon={<ArrowRight className="h-4 w-4" />}>Generar mi ruta</Button></Link>}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center text-center">
          <p className="text-sm text-slate-500">Nivel general</p>
          <p className="my-2 text-4xl font-extrabold text-brand-700">{latest.score}%</p>
          <Pill tone={LEVEL_TONE[latest.level]}>{latest.level.toUpperCase()}</Pill>
          {trend !== null && (
            <div className="mt-3 flex items-center gap-1 text-sm">
              {trend > 0 && <TrendingUp className="h-4 w-4 text-emerald-500" />}
              {trend < 0 && <TrendingDown className="h-4 w-4 text-red-500" />}
              {trend === 0 && <Minus className="h-4 w-4 text-slate-400" />}
              <span className={trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-red-600' : 'text-slate-500'}>
                {trend > 0 ? `+${trend}` : trend} pts vs. diagnóstico anterior
              </span>
            </div>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <p className="mb-2 text-sm font-semibold text-slate-700">Mapa de habilidades</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: '#64748b' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar dataKey="score" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <p className="mb-3 text-sm font-semibold text-emerald-700">💪 Fortalezas</p>
          <div className="space-y-3">
            {strengths.map((p) => (
              <SkillBar key={p.skillId} skillId={p.skillId} score={p.score} />
            ))}
          </div>
        </Card>
        <Card>
          <p className="mb-3 text-sm font-semibold text-amber-700">🎯 A reforzar</p>
          <div className="space-y-3">
            {weaknesses.map((p) => (
              <SkillBar key={p.skillId} skillId={p.skillId} score={p.score} />
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <p className="mb-1 text-sm font-semibold text-slate-700">Brechas de aprendizaje priorizadas</p>
        <p className="mb-4 text-sm text-slate-500">
          Ordenadas por prioridad, con un módulo recomendado para cerrarlas.
        </p>
        <div className="space-y-3">
          {gaps.map((g) => {
            const mod = g.recommendedModuleId ? MODULE_BY_ID[g.recommendedModuleId] : null;
            return (
              <div key={g.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                    {g.priority}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800">{SKILL_BY_ID[g.skillId]?.name}</p>
                    <p className="text-xs text-slate-500">
                      Brecha {g.gapScore}% · {g.isResolved ? 'sin brecha relevante' : 'requiere refuerzo'}
                    </p>
                  </div>
                </div>
                {mod && (
                  <div className="flex items-center gap-2">
                    <Pill tone="brand">{mod.title}</Pill>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function SkillBar({ skillId, score }: { skillId: string; score: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-slate-700">{SKILL_BY_ID[skillId]?.name}</span>
        <span className="font-semibold text-slate-500">{score}%</span>
      </div>
      <ProgressBar value={score} />
    </div>
  );
}
