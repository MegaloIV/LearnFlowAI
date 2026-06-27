import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';
import type { GoalType, LearningStyle, Level, UserProfile, UserType } from '@/types';
import { SKILLS, CATEGORY_LABELS } from '@/data/skills';
import { useStore } from '@/store/useStore';
import { useCurrentUser } from '@/store/selectors';
import { Button, cx } from '@/components/ui';
import { toast } from '@/store/useToast';
import { uid } from '@/lib/storage';
import { GOAL_OPTIONS, LEARNING_STYLES, LEVEL_OPTIONS } from './constants';

const STEPS = ['Tipo', 'Intereses', 'Objetivo', 'Disponibilidad', 'Nivel'];

export function ProfileWizard() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const saveProfile = useStore((s) => s.saveProfile);
  const setGoals = useStore((s) => s.setGoals);

  const [step, setStep] = useState(0);
  const [type, setType] = useState<UserType>('student');
  const [career, setCareer] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [goal, setGoal] = useState<GoalType>('empleabilidad');
  const [availabilityMinutes, setAvailability] = useState(30);
  const [frequencyWeekly, setFrequency] = useState(3);
  const [perceivedLevel, setLevel] = useState<Level>('basico');
  const [styles, setStyles] = useState<LearningStyle[]>(['mixto']);

  function toggleInterest(id: string) {
    setInterests((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );
  }
  function toggleStyle(s: LearningStyle) {
    setStyles((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  }

  function canAdvance(): boolean {
    if (step === 1) return interests.length > 0;
    if (step === 4) return styles.length > 0;
    return true;
  }

  function finish() {
    if (!user) return;
    const profile: UserProfile = {
      userId: user.id,
      type,
      career: type === 'student' ? career : undefined,
      profession: type === 'professional' ? career : undefined,
      availabilityMinutes,
      frequencyWeekly,
      perceivedLevel,
      learningStyle: styles,
      interestSkillIds: interests,
    };
    saveProfile(profile);
    setGoals([
      { id: uid('goal'), userId: user.id, goalType: goal, isActive: true },
    ]);
    toast.success('¡Perfil configurado! Vamos a tu diagnóstico.');
    navigate('/diagnostic');
  }

  const grouped = SKILLS.reduce<Record<string, typeof SKILLS>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-slate-900">Configura tu perfil</span>
        </div>

        {/* Stepper */}
        <div className="mb-6 flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div
                className={cx(
                  'grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold',
                  i < step && 'bg-emerald-500 text-white',
                  i === step && 'bg-brand-600 text-white',
                  i > step && 'bg-slate-200 text-slate-500',
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={cx('h-0.5 flex-1 rounded', i < step ? 'bg-emerald-400' : 'bg-slate-200')} />
              )}
            </div>
          ))}
        </div>

        <div className="card p-6">
          <h2 className="mb-1 text-xl font-bold text-slate-900">{stepTitle(step)}</h2>
          <p className="mb-5 text-sm text-slate-500">{stepSubtitle(step)}</p>

          {step === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {(['student', 'professional'] as UserType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={cx(
                      'rounded-xl border-2 p-4 text-left transition',
                      type === t ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300',
                    )}
                  >
                    <p className="font-semibold text-slate-800">
                      {t === 'student' ? '🎓 Estudiante' : '💼 Profesional'}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {t === 'student' ? 'Universitario o en formación.' : 'Trabajando o buscando crecer.'}
                    </p>
                  </button>
                ))}
              </div>
              <div>
                <label className="label">
                  {type === 'student' ? 'Carrera (opcional)' : 'Profesión (opcional)'}
                </label>
                <input
                  className="input"
                  placeholder={type === 'student' ? 'Ej. Ingeniería de Software' : 'Ej. Analista de datos'}
                  value={career}
                  onChange={(e) => setCareer(e.target.value)}
                />
                <p className="mt-1 text-xs text-slate-400">
                  Lo usamos para sugerirte rutas afines (HU-59/HU-60).
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              {Object.entries(grouped).map(([cat, skills]) => (
                <div key={cat}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                    {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => toggleInterest(s.id)}
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
              {interests.length === 0 && (
                <p className="text-sm text-amber-600">Selecciona al menos una habilidad.</p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {GOAL_OPTIONS.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setGoal(g.value)}
                  className={cx(
                    'rounded-xl border-2 p-4 text-left transition',
                    goal === g.value ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300',
                  )}
                >
                  <p className="font-semibold text-slate-800">{g.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{g.desc}</p>
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="label">Tiempo por sesión: {availabilityMinutes} min</label>
                <input
                  type="range" min={15} max={120} step={5}
                  value={availabilityMinutes}
                  onChange={(e) => setAvailability(Number(e.target.value))}
                  className="w-full accent-brand-600"
                />
                <div className="flex justify-between text-xs text-slate-400"><span>15 min</span><span>120 min</span></div>
              </div>
              <div>
                <label className="label">Sesiones por semana: {frequencyWeekly}</label>
                <input
                  type="range" min={1} max={7} step={1}
                  value={frequencyWeekly}
                  onChange={(e) => setFrequency(Number(e.target.value))}
                  className="w-full accent-brand-600"
                />
                <div className="flex justify-between text-xs text-slate-400"><span>1</span><span>7</span></div>
              </div>
              <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700">
                Esto ajusta la duración de tu ruta: ~{availabilityMinutes * frequencyWeekly} min/semana.
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <p className="label">¿Cómo describirías tu nivel general?</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {LEVEL_OPTIONS.map((l) => (
                    <button
                      key={l.value}
                      onClick={() => setLevel(l.value)}
                      className={cx(
                        'rounded-xl border-2 p-3 text-left transition',
                        perceivedLevel === l.value ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300',
                      )}
                    >
                      <p className="font-semibold text-slate-800">{l.label}</p>
                      <p className="mt-1 text-xs text-slate-500">{l.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="label">Estilos de aprendizaje preferidos</p>
                <div className="flex flex-wrap gap-2">
                  {LEARNING_STYLES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => toggleStyle(s.value)}
                      className={cx(
                        'rounded-full border px-3 py-1.5 text-sm transition',
                        styles.includes(s.value)
                          ? 'border-brand-500 bg-brand-600 text-white'
                          : 'border-slate-300 text-slate-600 hover:border-brand-300',
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              icon={<ChevronLeft className="h-4 w-4" />}
            >
              Atrás
            </Button>
            {step < STEPS.length - 1 ? (
              <Button
                onClick={() => canAdvance() && setStep((s) => s + 1)}
                disabled={!canAdvance()}
              >
                Siguiente <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={finish} disabled={!canAdvance()} icon={<Check className="h-4 w-4" />}>
                Finalizar y continuar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function stepTitle(step: number): string {
  return [
    '¿Cómo te describes?',
    '¿Qué te interesa aprender?',
    '¿Cuál es tu objetivo principal?',
    '¿Cuánto tiempo tienes?',
    'Tu nivel y estilo',
  ][step];
}
function stepSubtitle(step: number): string {
  return [
    'Personalizaremos tu experiencia según tu contexto.',
    'Elige las habilidades que quieres desarrollar.',
    'Orientaremos tus recomendaciones hacia esta meta.',
    'Ajustamos la carga de tu ruta a tu disponibilidad real.',
    'Esto afina la dificultad y el formato del contenido.',
  ][step];
}
