import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Save } from 'lucide-react';
import type { GoalType, LearningStyle, Level, UserType } from '@/types';
import { SKILLS, CATEGORY_LABELS } from '@/data/skills';
import { useStore } from '@/store/useStore';
import { useCurrentUser, useProfile, useGoals } from '@/store/selectors';
import { Button, Card, Modal, SectionTitle, cx } from '@/components/ui';
import { toast } from '@/store/useToast';
import { uid } from '@/lib/storage';
import { GOAL_OPTIONS, LEARNING_STYLES, LEVEL_OPTIONS } from './constants';

export function ProfilePage() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const profile = useProfile();
  const goals = useGoals();
  const saveProfile = useStore((s) => s.saveProfile);
  const setGoals = useStore((s) => s.setGoals);
  const deleteAccount = useStore((s) => s.deleteAccount);

  const activeGoal = goals.find((g) => g.isActive)?.goalType ?? 'empleabilidad';

  const [type, setType] = useState<UserType>(profile!.type);
  const [career, setCareer] = useState(profile!.career ?? profile!.profession ?? '');
  const [interests, setInterests] = useState<string[]>(profile!.interestSkillIds);
  const [goal, setGoal] = useState<GoalType>(activeGoal);
  const [availabilityMinutes, setAvailability] = useState(profile!.availabilityMinutes);
  const [frequencyWeekly, setFrequency] = useState(profile!.frequencyWeekly);
  const [perceivedLevel, setLevel] = useState<Level>(profile!.perceivedLevel);
  const [styles, setStyles] = useState<LearningStyle[]>(profile!.learningStyle);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function toggle<T>(list: T[], v: T): T[] {
    return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
  }

  function save() {
    if (!user) return;
    if (interests.length === 0) {
      toast.error('Selecciona al menos una habilidad de interés.');
      return;
    }
    saveProfile({
      userId: user.id,
      type,
      career: type === 'student' ? career : undefined,
      profession: type === 'professional' ? career : undefined,
      availabilityMinutes,
      frequencyWeekly,
      perceivedLevel,
      learningStyle: styles,
      interestSkillIds: interests,
      disableMotivational: profile!.disableMotivational,
    });
    setGoals([{ id: uid('goal'), userId: user.id, goalType: goal, isActive: true }]);
    toast.success('Perfil actualizado. Tus recomendaciones y ruta se ajustarán.');
  }

  function handleDelete() {
    deleteAccount();
    navigate('/register');
  }

  const grouped = SKILLS.reduce<Record<string, typeof SKILLS>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <SectionTitle title="Mi perfil" subtitle="Edita tu información; los cambios se reflejan en tu ruta y recomendaciones." />

      <Card>
        <p className="mb-3 text-sm font-semibold text-slate-700">Cuenta</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Nombre</label>
            <input className="input" value={user?.name ?? ''} disabled />
          </div>
          <div>
            <label className="label">Correo</label>
            <input className="input" value={user?.email ?? ''} disabled />
          </div>
        </div>
      </Card>

      <Card>
        <p className="mb-3 text-sm font-semibold text-slate-700">Tipo y contexto</p>
        <div className="grid grid-cols-2 gap-3 sm:max-w-md">
          {(['student', 'professional'] as UserType[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cx(
                'rounded-xl border-2 p-3 text-left text-sm transition',
                type === t ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300',
              )}
            >
              {t === 'student' ? '🎓 Estudiante' : '💼 Profesional'}
            </button>
          ))}
        </div>
        <div className="mt-4 sm:max-w-md">
          <label className="label">{type === 'student' ? 'Carrera' : 'Profesión'}</label>
          <input className="input" value={career} onChange={(e) => setCareer(e.target.value)} />
        </div>
      </Card>

      <Card>
        <p className="mb-3 text-sm font-semibold text-slate-700">Habilidades de interés</p>
        <div className="space-y-4">
          {Object.entries(grouped).map(([cat, skills]) => (
            <div key={cat}>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setInterests((cur) => toggle(cur, s.id))}
                    className={cx(
                      'rounded-full border px-3 py-1.5 text-sm transition',
                      interests.includes(s.id)
                        ? 'border-brand-500 bg-brand-600 text-white'
                        : 'border-slate-300 text-slate-600 hover:border-brand-300',
                    )}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <p className="mb-3 text-sm font-semibold text-slate-700">Objetivo principal</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {GOAL_OPTIONS.map((g) => (
            <button
              key={g.value}
              onClick={() => setGoal(g.value)}
              className={cx(
                'rounded-xl border-2 p-3 text-left text-sm transition',
                goal === g.value ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300',
              )}
            >
              <p className="font-semibold text-slate-800">{g.label}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <p className="mb-3 text-sm font-semibold text-slate-700">Disponibilidad, nivel y estilo</p>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="label">Tiempo por sesión: {availabilityMinutes} min</label>
            <input type="range" min={15} max={120} step={5} value={availabilityMinutes} onChange={(e) => setAvailability(Number(e.target.value))} className="w-full accent-brand-600" />
          </div>
          <div>
            <label className="label">Sesiones por semana: {frequencyWeekly}</label>
            <input type="range" min={1} max={7} step={1} value={frequencyWeekly} onChange={(e) => setFrequency(Number(e.target.value))} className="w-full accent-brand-600" />
          </div>
        </div>
        <div className="mt-4">
          <p className="label">Nivel percibido</p>
          <div className="flex flex-wrap gap-2">
            {LEVEL_OPTIONS.map((l) => (
              <button
                key={l.value}
                onClick={() => setLevel(l.value)}
                className={cx(
                  'rounded-full border px-3 py-1.5 text-sm transition',
                  perceivedLevel === l.value ? 'border-brand-500 bg-brand-600 text-white' : 'border-slate-300 text-slate-600',
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <p className="label">Estilos de aprendizaje</p>
          <div className="flex flex-wrap gap-2">
            {LEARNING_STYLES.map((s) => (
              <button
                key={s.value}
                onClick={() => setStyles((cur) => toggle(cur, s.value))}
                className={cx(
                  'rounded-full border px-3 py-1.5 text-sm transition',
                  styles.includes(s.value) ? 'border-brand-500 bg-brand-600 text-white' : 'border-slate-300 text-slate-600',
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button onClick={save} icon={<Save className="h-4 w-4" />}>Guardar cambios</Button>
        <Button variant="danger" onClick={() => setConfirmDelete(true)} icon={<Trash2 className="h-4 w-4" />}>
          Eliminar cuenta
        </Button>
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Eliminar cuenta"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>Cancelar</Button>
            <Button variant="danger" onClick={handleDelete}>Sí, eliminar todo</Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Esta acción es <b>irreversible</b>. Se borrarán tu perfil, progreso, rutas, insignias y
          todos tus datos guardados localmente. ¿Deseas continuar?
        </p>
      </Modal>
    </div>
  );
}
