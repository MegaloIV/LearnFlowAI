import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Stethoscope,
  Route as RouteIcon,
  Sparkles,
  Dumbbell,
  LineChart,
  Timer,
  Trophy,
  Compass,
  Bell,
  LogOut,
  Menu,
  X,
  GraduationCap,
  MessageCircle,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useCurrentUser, useNotifications } from '@/store/selectors';
import { cx, Pill } from '@/components/ui';

const NAV = [
  { to: '/', label: 'Panel principal', icon: LayoutDashboard, end: true },
  { to: '/diagnostic', label: 'Diagnóstico', icon: Stethoscope },
  { to: '/path', label: 'Mi ruta', icon: RouteIcon },
  { to: '/activities', label: 'Actividades', icon: Dumbbell },
  { to: '/recommendations', label: 'Recomendaciones', icon: Sparkles },
  { to: '/progress', label: 'Progreso', icon: LineChart },
  { to: '/productivity', label: 'Productividad', icon: Timer },
  { to: '/gamification', label: 'Logros y metas', icon: Trophy },
  { to: '/explore', label: 'Explorar', icon: Compass },
];

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useCurrentUser();
  const navigate = useNavigate();
  const logout = useStore((s) => s.logout);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <Brand />
        <Nav onNavigate={() => {}} />
        <UserFooter name={user?.name} onLogout={handleLogout} />
      </aside>

      {/* Sidebar (mobile drawer) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between pr-2">
              <Brand />
              <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <Nav onNavigate={() => setMobileOpen(false)} />
            <UserFooter name={user?.name} onLogout={handleLogout} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2 px-5 py-5">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
        <GraduationCap className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-extrabold leading-tight text-slate-900">LearnFlow</p>
        <p className="text-[11px] font-semibold leading-tight text-brand-600">AI · Prototipo</p>
      </div>
    </div>
  );
}

function Nav({ onNavigate }: { onNavigate: () => void }) {
  return (
    <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cx(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
              isActive
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            )
          }
        >
          <item.icon className="h-[18px] w-[18px]" />
          {item.label}
        </NavLink>
      ))}
      <NavLink
        to="/assistant"
        onClick={onNavigate}
        className={({ isActive }) =>
          cx(
            'mt-2 flex items-center gap-3 rounded-lg border border-dashed border-brand-200 px-3 py-2 text-sm font-medium transition',
            isActive ? 'bg-brand-50 text-brand-700' : 'text-brand-600 hover:bg-brand-50',
          )
        }
      >
        <MessageCircle className="h-[18px] w-[18px]" />
        Asistente IA
      </NavLink>
    </nav>
  );
}

function UserFooter({ name, onLogout }: { name?: string; onLogout: () => void }) {
  return (
    <div className="border-t border-slate-100 p-3">
      <NavLink
        to="/profile"
        className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-100"
      >
        <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
          {name?.charAt(0).toUpperCase() ?? 'U'}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">{name ?? 'Usuario'}</p>
          <p className="text-xs text-slate-400">Ver perfil</p>
        </div>
      </NavLink>
      <button
        onClick={onLogout}
        className="mt-1 flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-slate-500 hover:bg-red-50 hover:text-red-600"
      >
        <LogOut className="h-[18px] w-[18px]" />
        Cerrar sesión
      </button>
    </div>
  );
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  const [open, setOpen] = useState(false);
  const notifications = useNotifications();
  const markAll = useStore((s) => s.markAllNotificationsRead);
  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur sm:px-6 lg:justify-end">
      <button onClick={onMenu} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden">
        <Menu className="h-5 w-5" />
      </button>
      <div className="relative">
        <button
          onClick={() => {
            setOpen((o) => !o);
            if (!open) markAll();
          }}
          className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 z-20 mt-2 w-80 animate-fade-in overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-bold text-slate-800">Notificaciones</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-slate-400">
                    No tienes notificaciones.
                  </p>
                ) : (
                  notifications.slice(0, 12).map((n) => (
                    <div key={n.id} className="border-b border-slate-50 px-4 py-3">
                      <div className="mb-1 flex items-center gap-2">
                        <Pill tone={n.type === 'badge' ? 'amber' : 'brand'}>{n.type}</Pill>
                        <span className="text-[11px] text-slate-400">
                          {new Date(n.sentAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
