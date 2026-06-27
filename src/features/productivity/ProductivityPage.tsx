import { useEffect, useRef, useState } from 'react';
import {
  Play, Pause, RotateCcw, Timer, CalendarPlus, Trash2, Bell, Coffee, Brain, Lightbulb,
} from 'lucide-react';
import type { StudySession } from '@/types';
import { useStore } from '@/store/useStore';
import { useCurrentUser, useProfile, useSessions } from '@/store/selectors';
import { Button, Card, Modal, Pill, SectionTitle, cx } from '@/components/ui';
import { uid } from '@/lib/storage';
import { toast } from '@/store/useToast';

export function ProductivityPage() {
  return (
    <div className="space-y-6">
      <SectionTitle title="Productividad" subtitle="Gestiona tu tiempo, planifica sesiones y mantén el enfoque." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Pomodoro />
        <AvailabilityAndReminders />
      </div>
      <SessionsCalendar />
    </div>
  );
}

// ---------------------------------------------------------------------------
type Mode = 'focus' | 'break';
const DURATIONS: Record<Mode, number> = { focus: 25 * 60, break: 5 * 60 };

function Pomodoro() {
  const [mode, setMode] = useState<Mode>('focus');
  const [remaining, setRemaining] = useState(DURATIONS.focus);
  const [running, setRunning] = useState(false);
  const [completedFocus, setCompletedFocus] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          // fin del bloque
          if (mode === 'focus') {
            setCompletedFocus((c) => c + 1);
            toast.success('¡Pomodoro completado! Tómate un descanso. ☕');
            switchMode('break');
          } else {
            toast.info('Descanso terminado. ¡A enfocarse! 🧠');
            switchMode('focus');
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, mode]);

  function switchMode(m: Mode) {
    setMode(m);
    setRemaining(DURATIONS[m]);
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    setRemaining(DURATIONS[mode]);
  }

  const minutes = String(Math.floor(remaining / 60)).padStart(2, '0');
  const seconds = String(remaining % 60).padStart(2, '0');
  const pct = 100 - (remaining / DURATIONS[mode]) * 100;

  return (
    <Card className="flex flex-col items-center">
      <div className="mb-4 flex gap-2">
        <button onClick={() => switchMode('focus')} className={cx('flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium', mode === 'focus' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600')}>
          <Brain className="h-4 w-4" /> Enfoque
        </button>
        <button onClick={() => switchMode('break')} className={cx('flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium', mode === 'break' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600')}>
          <Coffee className="h-4 w-4" /> Descanso
        </button>
      </div>

      <div className="relative my-2 grid h-44 w-44 place-items-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="45" fill="none"
            stroke={mode === 'focus' ? '#2563eb' : '#10b981'}
            strokeWidth="6" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={(2 * Math.PI * 45 * (100 - pct)) / 100}
            className="transition-all"
          />
        </svg>
        <div className="text-center">
          <p className="font-mono text-4xl font-extrabold text-slate-900">{minutes}:{seconds}</p>
          <p className="text-xs text-slate-400">{mode === 'focus' ? 'Tiempo de enfoque' : 'Descanso'}</p>
        </div>
      </div>

      <div className="mt-2 flex gap-2">
        <Button onClick={() => setRunning((r) => !r)} icon={running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}>
          {running ? 'Pausar' : 'Iniciar'}
        </Button>
        <Button variant="outline" onClick={reset} icon={<RotateCcw className="h-4 w-4" />}>Reiniciar</Button>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
        <Timer className="h-4 w-4" /> Pomodoros completados hoy: <b>{completedFocus}</b>
      </p>
    </Card>
  );
}

// ---------------------------------------------------------------------------
function AvailabilityAndReminders() {
  const user = useCurrentUser();
  const profile = useProfile();
  const saveProfile = useStore((s) => s.saveProfile);
  const pushNotification = useStore((s) => s.pushNotification);
  const [minutes, setMinutes] = useState(profile?.availabilityMinutes ?? 30);
  const [freq, setFreq] = useState(profile?.frequencyWeekly ?? 3);

  function saveAvailability() {
    if (!user || !profile) return;
    saveProfile({ ...profile, availabilityMinutes: minutes, frequencyWeekly: freq });
    toast.success('Disponibilidad actualizada. Tu ruta se ajustará a este ritmo.');
  }

  // recomendación de tiempo de sesión (HU-37)
  const recommended = minutes >= 50 ? '2 pomodoros (≈50 min) con un descanso' : '1 pomodoro de enfoque (25 min)';

  return (
    <Card className="flex flex-col gap-5">
      <div>
        <p className="mb-3 text-sm font-semibold text-slate-700">Disponibilidad</p>
        <label className="label">Minutos por sesión: {minutes}</label>
        <input type="range" min={15} max={120} step={5} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="w-full accent-brand-600" />
        <label className="label mt-3">Sesiones por semana: {freq}</label>
        <input type="range" min={1} max={7} step={1} value={freq} onChange={(e) => setFreq(Number(e.target.value))} className="w-full accent-brand-600" />
        <Button size="sm" className="mt-3" onClick={saveAvailability}>Guardar disponibilidad</Button>
      </div>

      <div className="rounded-xl bg-brand-50/60 p-3">
        <p className="flex items-center gap-2 text-sm font-medium text-brand-700">
          <Lightbulb className="h-4 w-4" /> Recomendación de sesión
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Para una próxima actividad, te sugerimos: <b>{recommended}</b>.
        </p>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700">Recordatorios</p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" icon={<Bell className="h-4 w-4" />}
            onClick={() => { pushNotification({ type: 'reminder', message: '⏰ Recordatorio: es un buen momento para estudiar.' }); toast.info('Recordatorio de estudio programado (simulado).'); }}>
            Recordarme estudiar
          </Button>
          <Button size="sm" variant="outline" icon={<Bell className="h-4 w-4" />}
            onClick={() => { pushNotification({ type: 'reminder', message: '🔁 Recordatorio: repasa el último módulo para fijar lo aprendido.' }); toast.info('Recordatorio de repaso programado (simulado).'); }}>
            Recordarme repasar
          </Button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          En este prototipo los recordatorios aparecen como notificaciones dentro de la app (no correos reales).
        </p>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
function SessionsCalendar() {
  const user = useCurrentUser();
  const sessions = useSessions();
  const upsertSession = useStore((s) => s.upsertSession);
  const deleteSession = useStore((s) => s.deleteSession);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<StudySession | null>(null);
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState('');

  function openNew() {
    setEditing(null);
    setDate(new Date().toISOString().slice(0, 16));
    setDuration(30);
    setNotes('');
    setOpen(true);
  }
  function openEdit(s: StudySession) {
    setEditing(s);
    setDate(s.scheduledAt.slice(0, 16));
    setDuration(s.durationMinutes);
    setNotes(s.notes);
    setOpen(true);
  }
  function save() {
    if (!user || !date) { toast.error('Indica fecha y hora.'); return; }
    upsertSession({
      id: editing?.id ?? uid('sess'),
      userId: user.id,
      scheduledAt: new Date(date).toISOString(),
      durationMinutes: duration,
      notes,
      isCompleted: editing?.isCompleted ?? false,
    });
    setOpen(false);
    toast.success(editing ? 'Sesión actualizada.' : 'Sesión planificada.');
  }

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">Calendario de sesiones</p>
        <Button size="sm" icon={<CalendarPlus className="h-4 w-4" />} onClick={openNew}>Planificar sesión</Button>
      </div>
      {sessions.length === 0 ? (
        <p className="text-sm text-slate-400">No tienes sesiones planificadas.</p>
      ) : (
        <ul className="space-y-2">
          {sessions.map((s) => (
            <li key={s.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {new Date(s.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
                <p className="text-xs text-slate-500">{s.durationMinutes} min{s.notes ? ` · ${s.notes}` : ''}</p>
              </div>
              <div className="flex items-center gap-2">
                <Pill tone={s.isCompleted ? 'green' : 'slate'}>{s.isCompleted ? 'Hecha' : 'Pendiente'}</Pill>
                {!s.isCompleted && (
                  <Button size="sm" variant="ghost" onClick={() => { upsertSession({ ...s, isCompleted: true }); toast.success('Sesión marcada como completada.'); }}>
                    Completar
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => openEdit(s)}>Editar</Button>
                <button onClick={() => deleteSession(s.id)} className="text-slate-300 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Editar sesión' : 'Planificar sesión'}
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={save}>Guardar</Button></>}
      >
        <div className="space-y-3">
          <div>
            <label className="label">Fecha y hora</label>
            <input type="datetime-local" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="label">Duración: {duration} min</label>
            <input type="range" min={15} max={120} step={5} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full accent-brand-600" />
          </div>
          <div>
            <label className="label">Notas (opcional)</label>
            <input className="input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ej. Repasar JavaScript" />
          </div>
        </div>
      </Modal>
    </Card>
  );
}
