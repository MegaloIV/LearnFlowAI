import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, ThumbsUp, ThumbsDown, Bookmark, X, RefreshCw, TrendingUp, TrendingDown, Minus, Briefcase, Rocket,
} from 'lucide-react';
import { recommendContent, adaptDifficulty } from '@/lib/mockAI';
import { useStore } from '@/store/useStore';
import {
  useCurrentUser, useProfile, useGoals, useLatestDiagnostic, useRecommendations, useActivities,
} from '@/store/selectors';
import { Button, Card, Loader, Pill, SectionTitle, cx } from '@/components/ui';
import { MODULE_BY_ID } from '@/data/modules';
import { SKILL_BY_ID } from '@/data/skills';
import { toast } from '@/store/useToast';

export function RecommendationsPage() {
  const user = useCurrentUser();
  const profile = useProfile();
  const goals = useGoals();
  const diagnostic = useLatestDiagnostic();
  const recommendations = useRecommendations();
  const activities = useActivities();
  const setRecommendations = useStore((s) => s.setRecommendations);
  const rate = useStore((s) => s.rateRecommendation);
  const dismiss = useStore((s) => s.dismissRecommendation);
  const save = useStore((s) => s.saveRecommendation);
  const [loading, setLoading] = useState(false);

  const visible = recommendations.filter((r) => !r.isDismissed);
  const adapt = adaptDifficulty(activities);

  async function regenerate() {
    if (!user || !profile) return;
    setLoading(true);
    const recs = await recommendContent(profile, diagnostic, goals, user.id);
    setRecommendations(recs);
    setLoading(false);
    toast.success('Recomendaciones actualizadas.');
  }

  useEffect(() => {
    if (recommendations.length === 0 && user && profile) regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Recomendaciones para ti"
        subtitle="Sugerencias personalizadas según tu perfil, diagnóstico y objetivos."
        action={<Button variant="outline" size="sm" icon={<RefreshCw className="h-4 w-4" />} onClick={regenerate}>Actualizar</Button>}
      />

      {/* Indicadores HU-35 / HU-36 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Priorización automática</p>
            <p className="text-xs text-slate-500">
              {diagnostic
                ? `Priorizamos ${SKILL_BY_ID[[...diagnostic.perSkill].sort((a, b) => a.score - b.score)[0]?.skillId]?.name ?? 'tus brechas'} por tu diagnóstico.`
                : 'Haz tu diagnóstico para afinar la priorización.'}
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className={cx('grid h-10 w-10 place-items-center rounded-xl',
            adapt.suggestion === 'subir' ? 'bg-emerald-50 text-emerald-600' : adapt.suggestion === 'bajar' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500')}>
            {adapt.suggestion === 'subir' ? <TrendingUp className="h-5 w-5" /> : adapt.suggestion === 'bajar' ? <TrendingDown className="h-5 w-5" /> : <Minus className="h-5 w-5" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Adaptación de dificultad</p>
            <p className="text-xs text-slate-500">
              {activities.length === 0
                ? 'Completa actividades para ajustar la dificultad.'
                : adapt.suggestion === 'subir'
                ? `Tu promedio reciente es ${adapt.avg}%: podemos subir el nivel.`
                : adapt.suggestion === 'bajar'
                ? `Tu promedio reciente es ${adapt.avg}%: bajaremos el nivel para reforzar.`
                : `Promedio ${adapt.avg}%: mantenemos tu nivel actual.`}
            </p>
          </div>
        </Card>
      </div>

      {loading ? (
        <Loader label="El motor de recomendaciones está pensando…" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((r) => {
            const mod = MODULE_BY_ID[r.contentId];
            if (!mod) return null;
            return (
              <Card key={r.id} className="flex flex-col">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <Pill tone="brand">{SKILL_BY_ID[mod.skillId]?.name}</Pill>
                  <button onClick={() => dismiss(r.id)} className="text-slate-300 hover:text-red-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="font-bold text-slate-900">{mod.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{mod.description}</p>
                <div className="mt-2 rounded-lg bg-brand-50/60 px-3 py-2 text-xs text-brand-700">
                  💡 {r.reason}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-1">
                    <button
                      onClick={() => rate(r.id, 'up')}
                      className={cx('rounded-md p-1.5', r.rating === 'up' ? 'bg-emerald-100 text-emerald-600' : 'text-slate-400 hover:bg-slate-100')}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => rate(r.id, 'down')}
                      className={cx('rounded-md p-1.5', r.rating === 'down' ? 'bg-red-100 text-red-600' : 'text-slate-400 hover:bg-slate-100')}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                  </div>
                  <Button
                    size="sm"
                    variant={r.saved ? 'secondary' : 'outline'}
                    icon={<Bookmark className={cx('h-4 w-4', r.saved && 'fill-current')} />}
                    onClick={() => { save(r.id); toast.info(r.saved ? 'Quitado de guardados' : 'Guardado'); }}
                  >
                    {r.saved ? 'Guardado' : 'Guardar'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Sección especializada HU-40 / HU-41 */}
      <Card className="border-brand-200 bg-brand-50/40">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-brand-600">
            {profile?.type === 'student' ? <Briefcase className="h-5 w-5" /> : <Rocket className="h-5 w-5" />}
          </div>
          <div>
            <p className="font-bold text-slate-900">
              {profile?.type === 'student' ? 'Camino a la empleabilidad' : 'Crecimiento profesional'}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {profile?.type === 'student'
                ? 'Como estudiante, te sugerimos reforzar tu CV, preparar entrevistas y construir tu marca personal.'
                : 'Como profesional, enfócate en liderazgo, toma de decisiones y comunicación para acelerar tu carrera.'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(profile?.type === 'student'
                ? ['mod-cv-1', 'mod-cv-2', 'mod-pb-1']
                : ['mod-lead-1', 'mod-dec-1', 'mod-neg-1']
              ).map((id) => {
                const m = MODULE_BY_ID[id];
                return m ? <Pill key={id} tone="brand">{m.title}</Pill> : null;
              })}
            </div>
          </div>
        </div>
      </Card>

      <p className="text-center text-sm text-slate-400">
        ¿Buscas más orientación?{' '}
        <Link to="/assistant" className="font-semibold text-brand-600 hover:underline">Pregúntale al asistente IA</Link>.
      </p>
    </div>
  );
}
