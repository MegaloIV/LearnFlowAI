import { useState } from 'react';
import {
  Trophy, Plus, Trash2, Award, Star, Lock, Smile, BellOff, Bell,
} from 'lucide-react';
import type { PersonalGoal } from '@/types';
import { BADGES } from '@/data/badges';
import { SKILLS, SKILL_BY_ID } from '@/data/skills';
import { useStore } from '@/store/useStore';
import {
  useCurrentUser, useProfile, useBadges, useCertificates, usePersonalGoals,
} from '@/store/selectors';
import { Button, Card, Modal, Pill, ProgressBar, SectionTitle, cx } from '@/components/ui';
import { uid } from '@/lib/storage';
import { toast } from '@/store/useToast';

export function GamificationPage() {
  return (
    <div className="space-y-6">
      <SectionTitle title="Logros y metas" subtitle="Tus insignias, certificados y objetivos personales." />
      <Certificates />
      <BadgesGrid />
      <PersonalGoals />
      <div className="grid gap-5 md:grid-cols-2">
        <MotivationalSettings />
        <SatisfactionSurvey />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
function Certificates() {
  const certificates = useCertificates();
  const user = useCurrentUser();
  const [viewing, setViewing] = useState<string | null>(null);
  const cert = certificates.find((c) => c.id === viewing);

  if (certificates.length === 0) {
    return (
      <Card className="bg-slate-50">
        <p className="flex items-center gap-2 text-sm text-slate-500">
          <Award className="h-4 w-4" /> Completa una ruta al 100% para obtener tu certificado descargable.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Award className="h-4 w-4 text-brand-600" /> Certificados
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {certificates.map((c) => (
          <button key={c.id} onClick={() => setViewing(c.id)}
            className="rounded-xl border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-white p-4 text-left transition hover:shadow-md">
            <Award className="mb-2 h-7 w-7 text-brand-600" />
            <p className="font-bold text-slate-900">{c.pathTitle}</p>
            <p className="text-xs text-slate-500">Emitido el {new Date(c.issuedAt).toLocaleDateString()}</p>
          </button>
        ))}
      </div>

      <Modal open={!!cert} onClose={() => setViewing(null)} title="Certificado de finalización" maxWidth="max-w-2xl"
        footer={<>
          <Button variant="ghost" onClick={() => setViewing(null)}>Cerrar</Button>
          <Button onClick={() => toast.success('Tu certificado se ha descargado correctamente.')}>Descargar</Button>
        </>}>
        {cert && (
          <div className="rounded-2xl border-4 border-double border-brand-300 bg-gradient-to-br from-white to-brand-50 p-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">LearnFlow AI</p>
            <p className="mt-4 text-sm text-slate-500">Certifica que</p>
            <p className="my-2 text-2xl font-extrabold text-slate-900">{user?.name}</p>
            <p className="text-sm text-slate-500">ha completado exitosamente la ruta</p>
            <p className="my-2 text-lg font-bold text-brand-700">“{cert.pathTitle}”</p>
            <div className="mx-auto my-4 h-px w-24 bg-brand-300" />
            <p className="text-xs text-slate-400">Emitido el {new Date(cert.issuedAt).toLocaleDateString()}</p>
            <Award className="mx-auto mt-4 h-10 w-10 text-brand-500" />
          </div>
        )}
      </Modal>
    </Card>
  );
}

// ---------------------------------------------------------------------------
function BadgesGrid() {
  const earned = useBadges();
  const earnedTypes = new Set(earned.map((b) => b.badgeType));
  return (
    <Card>
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Trophy className="h-4 w-4 text-brand-600" /> Insignias ({earned.length}/{BADGES.length})
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {BADGES.map((b) => {
          const has = earnedTypes.has(b.type);
          return (
            <div key={b.type} className={cx('rounded-xl border p-4 text-center transition', has ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-slate-50 opacity-70')}>
              <div className="relative mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full bg-white text-2xl shadow-sm">
                {has ? b.icon : <Lock className="h-5 w-5 text-slate-300" />}
              </div>
              <p className="text-sm font-semibold text-slate-800">{b.name}</p>
              <p className="text-[11px] text-slate-500">{b.description}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
function PersonalGoals() {
  const user = useCurrentUser();
  const goals = usePersonalGoals();
  const upsert = useStore((s) => s.upsertPersonalGoal);
  const remove = useStore((s) => s.deletePersonalGoal);
  const awardBadge = useStore((s) => s.awardBadge);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PersonalGoal | null>(null);
  const [name, setName] = useState('');
  const [skillId, setSkillId] = useState(SKILLS[0].id);
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');

  function openNew() {
    setEditing(null); setName(''); setSkillId(SKILLS[0].id); setDescription('');
    setTargetDate(new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10));
    setOpen(true);
  }
  function openEdit(g: PersonalGoal) {
    setEditing(g); setName(g.name); setSkillId(g.skillId); setDescription(g.description);
    setTargetDate(g.targetDate.slice(0, 10)); setOpen(true);
  }
  function save() {
    if (!user || !name.trim()) { toast.error('Ponle un nombre a tu meta.'); return; }
    upsert({
      id: editing?.id ?? uid('pgoal'),
      userId: user.id,
      skillId, name: name.trim(), description,
      targetDate: new Date(targetDate).toISOString(),
      progressPct: editing?.progressPct ?? 0,
      isCompleted: editing?.isCompleted ?? false,
    });
    setOpen(false);
    toast.success(editing ? 'Meta actualizada.' : 'Meta creada.');
  }
  function setProgress(g: PersonalGoal, pct: number) {
    const completed = pct >= 100;
    upsert({ ...g, progressPct: pct, isCompleted: completed });
    if (completed && !g.isCompleted) {
      awardBadge('reto_aceptado');
      toast.success('¡Meta cumplida! 🎉');
    }
  }

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Star className="h-4 w-4 text-brand-600" /> Metas personales
        </p>
        <Button size="sm" icon={<Plus className="h-4 w-4" />} onClick={openNew}>Nueva meta</Button>
      </div>
      {goals.length === 0 ? (
        <p className="text-sm text-slate-400">Aún no tienes metas. Crea una para mantenerte enfocado.</p>
      ) : (
        <div className="space-y-3">
          {goals.map((g) => (
            <div key={g.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-800">{g.name}</p>
                  <p className="text-xs text-slate-500">
                    {SKILL_BY_ID[g.skillId]?.name} · meta para {new Date(g.targetDate).toLocaleDateString()}
                  </p>
                  {g.description && <p className="mt-1 text-sm text-slate-600">{g.description}</p>}
                </div>
                <div className="flex items-center gap-1">
                  {g.isCompleted && <Pill tone="green">Cumplida</Pill>}
                  <Button size="sm" variant="ghost" onClick={() => openEdit(g)}>Editar</Button>
                  <button onClick={() => remove(g.id)} className="text-slate-300 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>Progreso</span><span>{g.progressPct}%</span>
                </div>
                <ProgressBar value={g.progressPct} />
                <input type="range" min={0} max={100} step={10} value={g.progressPct}
                  onChange={(e) => setProgress(g, Number(e.target.value))}
                  className="mt-2 w-full accent-brand-600" />
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Editar meta' : 'Nueva meta'}
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={save}>Guardar</Button></>}>
        <div className="space-y-3">
          <div><label className="label">Nombre</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Dominar React" /></div>
          <div><label className="label">Habilidad asociada</label>
            <select className="input" value={skillId} onChange={(e) => setSkillId(e.target.value)}>
              {SKILLS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div><label className="label">Descripción (opcional)</label><input className="input" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div><label className="label">Fecha objetivo</label><input type="date" className="input" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} /></div>
        </div>
      </Modal>
    </Card>
  );
}

// ---------------------------------------------------------------------------
function MotivationalSettings() {
  const user = useCurrentUser();
  const profile = useProfile();
  const saveProfile = useStore((s) => s.saveProfile);
  const disabled = profile?.disableMotivational ?? false;

  function toggle() {
    if (!user || !profile) return;
    saveProfile({ ...profile, disableMotivational: !disabled });
    toast.info(!disabled ? 'Mensajes motivacionales desactivados.' : 'Mensajes motivacionales activados.');
  }

  return (
    <Card className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
          {disabled ? <BellOff className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Mensajes motivacionales</p>
          <p className="text-xs text-slate-500">Máximo unos pocos por sesión. {disabled ? 'Actualmente desactivados.' : 'Actualmente activados.'}</p>
        </div>
      </div>
      <Button size="sm" variant="outline" onClick={toggle}>{disabled ? 'Activar' : 'Desactivar'}</Button>
    </Card>
  );
}

// ---------------------------------------------------------------------------
function SatisfactionSurvey() {
  const pushNotification = useStore((s) => s.pushNotification);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(false);

  function submit() {
    if (rating === 0) { toast.error('Selecciona una calificación.'); return; }
    pushNotification({ type: 'system', message: `Gracias por tu evaluación (${rating}/5).` });
    setSent(true);
    toast.success('¡Gracias por tu opinión!');
  }

  return (
    <Card>
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Smile className="h-4 w-4 text-brand-600" /> Evaluación de satisfacción
      </p>
      {sent ? (
        <p className="text-sm text-emerald-600">¡Gracias! Tu evaluación fue registrada.</p>
      ) : (
        <>
          <p className="mb-3 text-sm text-slate-500">¿Qué tan satisfecho estás con tu experiencia de aprendizaje?</p>
          <div className="mb-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n)}>
                <Star className={cx('h-7 w-7', n <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300')} />
              </button>
            ))}
          </div>
          <textarea className="input" rows={2} placeholder="Comentario (opcional)" value={comment} onChange={(e) => setComment(e.target.value)} />
          <Button size="sm" className="mt-3" onClick={submit}>Enviar evaluación</Button>
        </>
      )}
    </Card>
  );
}
