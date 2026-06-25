import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Route as RouteIcon, Zap, Layers, CheckCircle2, Circle, PlayCircle, Clock, Award, RefreshCw,
} from 'lucide-react';
import type { LearningPath, PathType } from '@/types';
import { generateLearningPath } from '@/lib/mockAI';
import { useStore } from '@/store/useStore';
import {
  useCurrentUser, useProfile, useGoals, useLatestDiagnostic, useActivePath,
} from '@/store/selectors';
import { Button, Card, Loader, Pill, ProgressBar, SectionTitle, cx } from '@/components/ui';
import { SKILL_BY_ID } from '@/data/skills';
import { MODULE_BY_ID } from '@/data/modules';
import { uid } from '@/lib/storage';
import { toast } from '@/store/useToast';

export function PathPage() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const profile = useProfile();
  const goals = useGoals();
  const diagnostic = useLatestDiagnostic();
  const activePath = useActivePath();
  const setActivePath = useStore((s) => s.setActivePath);
  const addCertificate = useStore((s) => s.addCertificate);
  const [loading, setLoading] = useState(false);

  async function generate(type: PathType) {
    if (!user || !profile) return;
    setLoading(true);
    const { title, modules } = await generateLearningPath(profile, diagnostic, goals, type);
    const pathId = uid('path');
    const path: LearningPath = {
      id: pathId,
      userId: user.id,
      title,
      type,
      status: 'active',
      progressPct: 0,
      createdAt: new Date().toISOString(),
      modules: modules.map((m) => ({ ...m, pathId })),
    };
    setActivePath(path);
    setLoading(false);
    toast.success(`¡Ruta generada con ${modules.length} módulos!`);
  }

  if (loading) return <Loader label="Construyendo tu ruta de aprendizaje…" />;

  if (!activePath) {
    return (
      <div className="space-y-6">
        <SectionTitle title="Tu ruta de aprendizaje" subtitle="Genera una ruta personalizada según tu diagnóstico, objetivos y tiempo disponible." />
        {!diagnostic && (
          <Card className="bg-amber-50">
            <p className="text-sm text-amber-700">
              Aún no has hecho tu diagnóstico. Puedes generar una ruta igualmente, pero será más
              precisa si primero lo completas.{' '}
              <Link to="/diagnostic" className="font-semibold underline">Ir al diagnóstico</Link>.
            </p>
          </Card>
        )}
        <div className="grid gap-5 md:grid-cols-2">
          <PathOption
            icon={<Zap className="h-6 w-6" />}
            title="Ruta rápida"
            desc="Pocos módulos cortos para avanzar ya. Ideal si tienes poco tiempo."
            cta="Generar ruta rápida"
            onClick={() => generate('quick')}
          />
          <PathOption
            icon={<Layers className="h-6 w-6" />}
            title="Ruta completa"
            desc="Recorrido más amplio y profundo para dominar tus habilidades."
            cta="Generar ruta completa"
            onClick={() => generate('full')}
          />
        </div>
      </div>
    );
  }

  const completed = activePath.modules.filter((m) => m.status === 'completed').length;

  function issueCertificate() {
    const cert = addCertificate(activePath!.id, activePath!.title);
    toast.success('¡Certificado generado!');
    navigate('/gamification', { state: { certificateId: cert.id } });
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title={activePath.title}
        subtitle={`${activePath.type === 'quick' ? 'Ruta rápida' : 'Ruta completa'} · ${activePath.modules.length} módulos`}
        action={
          <Button variant="outline" size="sm" icon={<RefreshCw className="h-4 w-4" />} onClick={() => generate(activePath.type)}>
            Regenerar
          </Button>
        }
      />

      <Card>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-700">Progreso de la ruta</span>
          <span className="text-slate-500">{completed}/{activePath.modules.length} completados</span>
        </div>
        <ProgressBar value={activePath.progressPct} />
        {activePath.progressPct === 100 && (
          <div className="mt-4 flex flex-col items-start gap-3 rounded-xl bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-emerald-700">
              <Award className="h-5 w-5" />
              <span className="text-sm font-semibold">¡Ruta completada al 100%! Has ganado un certificado.</span>
            </div>
            <Button onClick={issueCertificate} size="sm">Generar certificado</Button>
          </div>
        )}
      </Card>

      <div className="space-y-3">
        {activePath.modules
          .slice()
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((m) => {
            const mod = MODULE_BY_ID[m.moduleId];
            return (
              <Link
                key={m.id}
                to={`/path/module/${m.id}`}
                className="block"
              >
                <div className={cx(
                  'flex items-center gap-4 rounded-xl border bg-white p-4 transition hover:shadow-md',
                  m.status === 'in_progress' ? 'border-brand-300 ring-1 ring-brand-100' : 'border-slate-200',
                )}>
                  <StatusIcon status={m.status} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-800">
                      {m.orderIndex + 1}. {m.title}
                    </p>
                    <p className="truncate text-sm text-slate-500">{m.description}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <Pill tone="slate"><Clock className="h-3 w-3" /> {m.durationMinutes} min</Pill>
                      <Pill tone="violet">{m.difficulty}</Pill>
                      {mod && <Pill tone="brand">{SKILL_BY_ID[mod.skillId]?.name}</Pill>}
                    </div>
                  </div>
                  <StatusLabel status={m.status} />
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}

function PathOption({ icon, title, desc, cta, onClick }: {
  icon: React.ReactNode; title: string; desc: string; cta: string; onClick: () => void;
}) {
  return (
    <Card className="flex flex-col">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600">{icon}</div>
      <h3 className="font-bold text-slate-900">{title}</h3>
      <p className="mb-4 mt-1 flex-1 text-sm text-slate-500">{desc}</p>
      <Button onClick={onClick} icon={<RouteIcon className="h-4 w-4" />}>{cta}</Button>
    </Card>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'completed') return <CheckCircle2 className="h-7 w-7 shrink-0 text-emerald-500" />;
  if (status === 'in_progress') return <PlayCircle className="h-7 w-7 shrink-0 text-brand-600" />;
  return <Circle className="h-7 w-7 shrink-0 text-slate-300" />;
}

function StatusLabel({ status }: { status: string }) {
  const map: Record<string, { tone: 'green' | 'brand' | 'slate'; label: string }> = {
    completed: { tone: 'green', label: 'Completado' },
    in_progress: { tone: 'brand', label: 'En progreso' },
    pending: { tone: 'slate', label: 'Pendiente' },
  };
  const v = map[status];
  return <Pill tone={v.tone}>{v.label}</Pill>;
}
