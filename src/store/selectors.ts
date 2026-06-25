import { useShallow } from 'zustand/react/shallow';
import { useStore } from './useStore';

// Los selectores que derivan arrays (filter/sort/map) deben usar `useShallow`
// para devolver una referencia estable cuando el contenido no cambia. Si no,
// cada render produce un array nuevo y React entra en un bucle de actualización
// con useSyncExternalStore (pantalla en blanco / "Maximum update depth").

export function useCurrentUser() {
  return useStore((s) => s.users.find((u) => u.id === s.currentUserId) ?? null);
}

export function useProfile() {
  return useStore((s) => s.profiles.find((p) => p.userId === s.currentUserId) ?? null);
}

export function useGoals() {
  return useStore(useShallow((s) => s.goals.filter((g) => g.userId === s.currentUserId)));
}

export function useDiagnostics() {
  return useStore(
    useShallow((s) =>
      s.diagnostics
        .filter((d) => d.userId === s.currentUserId)
        .sort((a, b) => +new Date(b.attemptedAt) - +new Date(a.attemptedAt)),
    ),
  );
}

export function useLatestDiagnostic() {
  return useStore((s) => {
    const mine = s.diagnostics.filter((d) => d.userId === s.currentUserId);
    if (mine.length === 0) return null;
    return mine.reduce((latest, d) =>
      +new Date(d.attemptedAt) > +new Date(latest.attemptedAt) ? d : latest,
    );
  });
}

export function useGaps() {
  return useStore(
    useShallow((s) =>
      s.gaps.filter((g) => g.userId === s.currentUserId).sort((a, b) => a.priority - b.priority),
    ),
  );
}

export function useActivePath() {
  return useStore((s) => {
    const mine = s.paths.filter((p) => p.userId === s.currentUserId);
    const active = mine.find((p) => p.status === 'active');
    if (active) return active;
    if (mine.length === 0) return null;
    return mine.reduce((latest, p) =>
      +new Date(p.createdAt) > +new Date(latest.createdAt) ? p : latest,
    );
  });
}

export function usePaths() {
  return useStore(useShallow((s) => s.paths.filter((p) => p.userId === s.currentUserId)));
}

export function useActivities() {
  return useStore(
    useShallow((s) =>
      s.activities
        .filter((a) => a.userId === s.currentUserId)
        .sort((a, b) => +new Date(b.completedAt) - +new Date(a.completedAt)),
    ),
  );
}

export function useRecommendations() {
  return useStore(
    useShallow((s) => s.recommendations.filter((r) => r.userId === s.currentUserId)),
  );
}

export function useBadges() {
  return useStore(useShallow((s) => s.badges.filter((b) => b.userId === s.currentUserId)));
}

export function useCertificates() {
  return useStore(useShallow((s) => s.certificates.filter((c) => c.userId === s.currentUserId)));
}

export function usePersonalGoals() {
  return useStore(useShallow((s) => s.personalGoals.filter((g) => g.userId === s.currentUserId)));
}

export function useSessions() {
  return useStore(
    useShallow((s) =>
      s.sessions
        .filter((x) => x.userId === s.currentUserId)
        .sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt)),
    ),
  );
}

export function useNotifications() {
  return useStore(
    useShallow((s) =>
      s.notifications
        .filter((n) => n.userId === s.currentUserId)
        .sort((a, b) => +new Date(b.sentAt) - +new Date(a.sentAt)),
    ),
  );
}

export function useFavorites() {
  return useStore(
    useShallow((s) =>
      s.favorites.filter((f) => f.userId === s.currentUserId).map((f) => f.contentId),
    ),
  );
}
