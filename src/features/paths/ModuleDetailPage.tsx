import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, PlayCircle, Clock, Target, BookOpen, Dumbbell } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button, Card, EmptyState, Pill, SectionTitle } from '@/components/ui';
import { MODULE_BY_ID } from '@/data/modules';
import { SKILL_BY_ID } from '@/data/skills';
import { RESOURCES } from '@/data/resources';
import { evaluateBadges } from '@/lib/gamification';
import { randomMotivational } from '@/data/motivationalMessages';
import { toast } from '@/store/useToast';

export function ModuleDetailPage() {
  const { pathModuleId } = useParams();
  const navigate = useNavigate();
  const setModuleStatus = useStore((s) => s.setModuleStatus);
  const pushNotification = useStore((s) => s.pushNotification);

  const { path, pm } = useStore((s) => {
    for (const p of s.paths.filter((x) => x.userId === s.currentUserId)) {
      const found = p.modules.find((m) => m.id === pathModuleId);
      if (found) return { path: p, pm: found };
    }
    return { path: null, pm: null };
  });

  if (!path || !pm) {
    return (
      <EmptyState
        title="Módulo no encontrado"
        description="Es posible que la ruta haya cambiado."
        action={<Link to="/path"><Button>Volver a mi ruta</Button></Link>}
      />
    );
  }

  const mod = MODULE_BY_ID[pm.moduleId];
  const skill = mod ? SKILL_BY_ID[mod.skillId] : null;
  const relatedResources = RESOURCES.filter((r) => mod && r.skillId === mod.skillId).slice(0, 3);

  function markStarted() {
    setModuleStatus(path!.id, pm!.id, 'in_progress');
    toast.info('Módulo marcado como iniciado.');
  }

  function markCompleted() {
    setModuleStatus(path!.id, pm!.id, 'completed');
    evaluateBadges();
    pushNotification({ type: 'motivational', message: randomMotivational() });
    toast.success('¡Módulo completado! Tu progreso se actualizó.');
    navigate('/path');
  }

  return (
    <div className="space-y-6">
      <Link to="/path" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" /> Volver a mi ruta
      </Link>

      <SectionTitle
        title={mod?.title ?? pm.title}
        subtitle={mod?.description ?? pm.description}
        action={<Pill tone={pm.status === 'completed' ? 'green' : pm.status === 'in_progress' ? 'brand' : 'slate'}>
          {pm.status === 'completed' ? 'Completado' : pm.status === 'in_progress' ? 'En progreso' : 'Pendiente'}
        </Pill>}
      />

      <div className="flex flex-wrap gap-2">
        <Pill tone="slate"><Clock className="h-3 w-3" /> {pm.durationMinutes} min</Pill>
        <Pill tone="violet">{pm.difficulty}</Pill>
        {skill && <Pill tone="brand">{skill.name}</Pill>}
        {mod && <Pill tone="amber">{mod.contentType.replace('_', ' ')}</Pill>}
      </div>

      <Card>
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Target className="h-4 w-4 text-brand-600" /> Objetivos de aprendizaje
        </p>
        <ul className="space-y-2">
          {mod?.objectives.map((o, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {o}
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Dumbbell className="h-4 w-4 text-brand-600" /> Actividades
          </p>
          <p className="mb-3 text-sm text-slate-500">
            Pon a prueba lo aprendido con preguntas, ejercicios y una prueba corta.
          </p>
          <Link to={`/activities?module=${pm.moduleId}`}>
            <Button variant="outline" className="w-full">Ir a las actividades</Button>
          </Link>
        </Card>
        <Card>
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <BookOpen className="h-4 w-4 text-brand-600" /> Recursos recomendados
          </p>
          <div className="space-y-2">
            {relatedResources.length === 0 && <p className="text-sm text-slate-400">Sin recursos asociados.</p>}
            {relatedResources.map((r) => (
              <div key={r.id} className="rounded-lg border border-slate-200 px-3 py-2">
                <p className="text-sm font-medium text-slate-700">{r.title}</p>
                <p className="text-xs text-slate-400">{r.durationMinutes} min · {r.type.replace('_', ' ')}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        {pm.status !== 'in_progress' && pm.status !== 'completed' && (
          <Button onClick={markStarted} icon={<PlayCircle className="h-4 w-4" />}>Marcar como iniciado</Button>
        )}
        {pm.status !== 'completed' && (
          <Button onClick={markCompleted} variant={pm.status === 'in_progress' ? 'primary' : 'outline'} icon={<CheckCircle2 className="h-4 w-4" />}>
            Marcar como completado
          </Button>
        )}
        {pm.status === 'completed' && (
          <p className="flex items-center gap-2 text-sm text-emerald-600">
            <CheckCircle2 className="h-5 w-5" /> ¡Ya completaste este módulo!
          </p>
        )}
      </div>
    </div>
  );
}
