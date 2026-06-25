import { Link } from 'react-router-dom';
import {
  Stethoscope, Route as RouteIcon, Dumbbell, LineChart, MessageCircle, PlayCircle,
  Bell, Sparkles, ArrowRight, Trophy,
} from 'lucide-react';
import {
  useCurrentUser, useProfile, useActivePath, useActivities, useLatestDiagnostic,
  useNotifications, useBadges,
} from '@/store/selectors';
import { Card, Pill, ProgressBar, Button } from '@/components/ui';
import { suggestNextActivity } from '@/lib/mockAI';
import { randomMotivational } from '@/data/motivationalMessages';

export function DashboardPage() {
  const user = useCurrentUser();
  const profile = useProfile();
  const activePath = useActivePath();
  const activities = useActivities();
  const diagnostic = useLatestDiagnostic();
  const notifications = useNotifications();
  const badges = useBadges();

  const nextModule = suggestNextActivity(activePath?.modules);
  const reminders = notifications.filter((n) => n.type === 'reminder' && !n.isRead).slice(0, 3);
  const greeting = getGreeting();

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white">
        <p className="text-sm text-brand-100">{greeting},</p>
        <h1 className="text-2xl font-extrabold">{user?.name} 👋</h1>
        {!profile?.disableMotivational && (
          <p className="mt-2 max-w-lg text-sm text-brand-100">{randomMotivational()}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {!diagnostic && (
            <Link to="/diagnostic">
              <Button variant="secondary" size="sm" icon={<Stethoscope className="h-4 w-4" />}>Haz tu diagnóstico</Button>
            </Link>
          )}
          {!activePath && (
            <Link to="/path">
              <Button variant="secondary" size="sm" icon={<RouteIcon className="h-4 w-4" />}>Genera tu ruta</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Columna principal */}
        <div className="space-y-6 lg:col-span-2">
          {/* Ruta activa + progreso */}
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Tu ruta activa</p>
              <Link to="/path" className="text-sm text-brand-600 hover:underline">Ver ruta</Link>
            </div>
            {activePath ? (
              <>
                <p className="font-bold text-slate-900">{activePath.title}</p>
                <div className="mb-2 mt-3 flex justify-between text-sm text-slate-500">
                  <span>{activePath.modules.filter((m) => m.status === 'completed').length}/{activePath.modules.length} módulos</span>
                  <span>{activePath.progressPct}%</span>
                </div>
                <ProgressBar value={activePath.progressPct} />
              </>
            ) : (
              <div className="flex flex-col items-start gap-3 py-2">
                <p className="text-sm text-slate-500">Aún no tienes una ruta. Genérala para empezar.</p>
                <Link to="/path"><Button size="sm">Generar ruta</Button></Link>
              </div>
            )}
          </Card>

          {/* Siguiente actividad recomendada */}
          <Card className="border-brand-200 bg-brand-50/40">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-700">
              <Sparkles className="h-4 w-4" /> Siguiente actividad recomendada
            </p>
            {nextModule ? (
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <PlayCircle className="h-9 w-9 text-brand-600" />
                  <div>
                    <p className="font-bold text-slate-900">{nextModule.title}</p>
                    <p className="text-xs text-slate-500">{nextModule.durationMinutes} min · {nextModule.difficulty}</p>
                  </div>
                </div>
                <Link to={`/path/module/${nextModule.id}`}>
                  <Button icon={<ArrowRight className="h-4 w-4" />}>Continuar</Button>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Genera tu ruta para recibir una recomendación.</p>
            )}
          </Card>

          {/* Accesos rápidos */}
          <div>
            <p className="mb-3 text-sm font-semibold text-slate-700">Accesos rápidos</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <QuickLink to="/diagnostic" icon={<Stethoscope className="h-5 w-5" />} label="Diagnóstico" />
              <QuickLink to="/path" icon={<RouteIcon className="h-5 w-5" />} label="Mi ruta" />
              <QuickLink to="/activities" icon={<Dumbbell className="h-5 w-5" />} label="Ejercicios" />
              <QuickLink to="/progress" icon={<LineChart className="h-5 w-5" />} label="Progreso" />
            </div>
          </div>
        </div>

        {/* Columna lateral */}
        <div className="space-y-6">
          {/* KPIs */}
          <Card>
            <p className="mb-3 text-sm font-semibold text-slate-700">Tu resumen</p>
            <div className="space-y-3">
              <StatRow label="Nivel diagnóstico" value={diagnostic ? `${diagnostic.score}% · ${diagnostic.level}` : '—'} />
              <StatRow label="Actividades hechas" value={`${activities.length}`} />
              <StatRow label="Insignias" value={`${badges.length}`} />
              <StatRow label="Habilidades de interés" value={`${profile?.interestSkillIds.length ?? 0}`} />
            </div>
          </Card>

          {/* Recordatorios */}
          <Card>
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Bell className="h-4 w-4 text-brand-600" /> Recordatorios
            </p>
            {reminders.length === 0 ? (
              <p className="text-sm text-slate-400">
                Sin recordatorios pendientes.{' '}
                <Link to="/productivity" className="text-brand-600 hover:underline">Programa uno</Link>.
              </p>
            ) : (
              <ul className="space-y-2">
                {reminders.map((r) => (
                  <li key={r.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">{r.message}</li>
                ))}
              </ul>
            )}
          </Card>

          {/* Insignias recientes */}
          {badges.length > 0 && (
            <Card>
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Trophy className="h-4 w-4 text-amber-500" /> Logros recientes
              </p>
              <div className="flex flex-wrap gap-2">
                {badges.slice(-4).map((b) => (
                  <Pill key={b.id} tone="amber">{b.badgeType.replace('_', ' ')}</Pill>
                ))}
              </div>
            </Card>
          )}

          {/* Asistente */}
          <Link to="/assistant">
            <Card className="flex items-center gap-3 transition hover:shadow-md">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Asistente IA</p>
                <p className="text-xs text-slate-500">¿Dudas? Pregúntame lo que necesites.</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-center transition hover:border-brand-300 hover:shadow-sm">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">{icon}</span>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </Link>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}
