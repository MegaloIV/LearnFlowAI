import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useProfile } from '@/store/selectors';

/** Requiere sesión activa. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const userId = useStore((s) => s.currentUserId);
  if (!userId) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/** Requiere sesión + perfil configurado (si no, va al onboarding). */
export function RequireProfile({ children }: { children: ReactNode }) {
  const userId = useStore((s) => s.currentUserId);
  const profile = useProfile();
  if (!userId) return <Navigate to="/login" replace />;
  if (!profile) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

/** Solo para páginas de auth: si ya hay sesión, redirige al panel. */
export function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const userId = useStore((s) => s.currentUserId);
  if (userId) return <Navigate to="/" replace />;
  return <>{children}</>;
}
