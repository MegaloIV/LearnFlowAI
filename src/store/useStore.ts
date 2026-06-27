import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Activity,
  Certificate,
  ChatMessage,
  Diagnostic,
  LearningGap,
  LearningPath,
  ModuleStatus,
  Notification,
  PersonalGoal,
  Recommendation,
  StudySession,
  User,
  UserBadge,
  UserGoal,
  UserProfile,
} from '@/types';
import { uid } from '@/lib/storage';
import { BADGE_BY_TYPE } from '@/data/badges';

const PERSIST_KEY = 'learnflow:store';

// Adaptador de almacenamiento: Zustand persist sobre localStorage.
const jsonStorage = createJSONStorage(() => localStorage);

export interface Favorite {
  userId: string;
  contentId: string;
}

export interface AppState {
  // sesión
  currentUserId: string | null;

  // entidades
  users: User[];
  profiles: UserProfile[];
  goals: UserGoal[];
  diagnostics: Diagnostic[];
  gaps: LearningGap[];
  paths: LearningPath[];
  activities: Activity[];
  recommendations: Recommendation[];
  badges: UserBadge[];
  certificates: Certificate[];
  personalGoals: PersonalGoal[];
  sessions: StudySession[];
  notifications: Notification[];
  favorites: Favorite[];
  chat: ChatMessage[];

  // ===== Auth =====
  register: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => { ok: boolean; error?: string };
  deleteAccount: () => void;

  // ===== Profile =====
  saveProfile: (profile: UserProfile) => void;
  setGoals: (goals: UserGoal[]) => void;

  // ===== Diagnostic =====
  addDiagnostic: (d: Diagnostic) => void;
  setGaps: (gaps: LearningGap[]) => void;

  // ===== Paths =====
  setActivePath: (path: LearningPath) => void;
  setModuleStatus: (pathId: string, pathModuleId: string, status: ModuleStatus) => void;

  // ===== Activities =====
  addActivity: (a: Activity) => void;

  // ===== Recommendations =====
  setRecommendations: (recs: Recommendation[]) => void;
  rateRecommendation: (id: string, rating: 'up' | 'down') => void;
  dismissRecommendation: (id: string) => void;
  saveRecommendation: (id: string) => void;

  // ===== Gamification =====
  awardBadge: (badgeType: UserBadge['badgeType']) => UserBadge | null;
  addCertificate: (pathId: string, pathTitle: string) => Certificate;
  upsertPersonalGoal: (goal: PersonalGoal) => void;
  deletePersonalGoal: (id: string) => void;

  // ===== Productivity =====
  upsertSession: (s: StudySession) => void;
  deleteSession: (id: string) => void;

  // ===== Notifications =====
  pushNotification: (n: Omit<Notification, 'id' | 'userId' | 'isRead' | 'sentAt'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // ===== Favorites =====
  toggleFavorite: (contentId: string) => void;

  // ===== Chat =====
  addChatMessage: (m: ChatMessage) => void;
  clearChat: () => void;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUserId: null,
      users: [],
      profiles: [],
      goals: [],
      diagnostics: [],
      gaps: [],
      paths: [],
      activities: [],
      recommendations: [],
      badges: [],
      certificates: [],
      personalGoals: [],
      sessions: [],
      notifications: [],
      favorites: [],
      chat: [],

      register: (name, email, password) => {
        const e = email.trim().toLowerCase();
        if (!name.trim()) return { ok: false, error: 'El nombre es obligatorio.' };
        if (!isValidEmail(e)) return { ok: false, error: 'Correo con formato inválido.' };
        if (password.length < 6)
          return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
        if (get().users.some((u) => u.email === e))
          return { ok: false, error: 'Ya existe una cuenta con ese correo.' };
        const user: User = {
          id: uid('user'),
          name: name.trim(),
          email: e,
          password,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ users: [...s.users, user], currentUserId: user.id }));
        return { ok: true };
      },

      login: (email, password) => {
        const e = email.trim().toLowerCase();
        if (!isValidEmail(e)) return { ok: false, error: 'Correo con formato inválido.' };
        const user = get().users.find((u) => u.email === e);
        if (!user || user.password !== password)
          return { ok: false, error: 'Correo o contraseña incorrectos.' };
        set({ currentUserId: user.id });
        return { ok: true };
      },

      logout: () => set({ currentUserId: null, chat: [] }),

      resetPassword: (email, newPassword) => {
        const e = email.trim().toLowerCase();
        const user = get().users.find((u) => u.email === e);
        if (!user) return { ok: false, error: 'No existe una cuenta con ese correo.' };
        if (newPassword.length < 6)
          return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
        set((s) => ({
          users: s.users.map((u) => (u.id === user.id ? { ...u, password: newPassword } : u)),
        }));
        return { ok: true };
      },

      deleteAccount: () => {
        const uId = get().currentUserId;
        if (!uId) return;
        set((s) => ({
          currentUserId: null,
          users: s.users.filter((u) => u.id !== uId),
          profiles: s.profiles.filter((p) => p.userId !== uId),
          goals: s.goals.filter((g) => g.userId !== uId),
          diagnostics: s.diagnostics.filter((d) => d.userId !== uId),
          gaps: s.gaps.filter((g) => g.userId !== uId),
          paths: s.paths.filter((p) => p.userId !== uId),
          activities: s.activities.filter((a) => a.userId !== uId),
          recommendations: s.recommendations.filter((r) => r.userId !== uId),
          badges: s.badges.filter((b) => b.userId !== uId),
          certificates: s.certificates.filter((c) => c.userId !== uId),
          personalGoals: s.personalGoals.filter((g) => g.userId !== uId),
          sessions: s.sessions.filter((x) => x.userId !== uId),
          notifications: s.notifications.filter((n) => n.userId !== uId),
          favorites: s.favorites.filter((f) => f.userId !== uId),
          chat: [],
        }));
      },

      saveProfile: (profile) =>
        set((s) => ({
          profiles: [...s.profiles.filter((p) => p.userId !== profile.userId), profile],
        })),

      setGoals: (goals) => {
        const uId = get().currentUserId;
        if (!uId) return;
        set((s) => ({ goals: [...s.goals.filter((g) => g.userId !== uId), ...goals] }));
      },

      addDiagnostic: (d) => set((s) => ({ diagnostics: [...s.diagnostics, d] })),

      setGaps: (gaps) => {
        const uId = get().currentUserId;
        if (!uId) return;
        set((s) => ({ gaps: [...s.gaps.filter((g) => g.userId !== uId), ...gaps] }));
      },

      setActivePath: (path) =>
        set((s) => ({
          paths: [
            ...s.paths.map((p) =>
              p.userId === path.userId && p.status === 'active' ? { ...p, status: 'paused' as const } : p,
            ),
            path,
          ],
        })),

      setModuleStatus: (pathId, pathModuleId, status) =>
        set((s) => ({
          paths: s.paths.map((p) => {
            if (p.id !== pathId) return p;
            const modules = p.modules.map((m) =>
              m.id === pathModuleId ? { ...m, status } : m,
            );
            const completed = modules.filter((m) => m.status === 'completed').length;
            const progressPct = Math.round((completed / modules.length) * 100);
            return {
              ...p,
              modules,
              progressPct,
              status: progressPct === 100 ? ('completed' as const) : p.status,
            };
          }),
        })),

      addActivity: (a) => set((s) => ({ activities: [...s.activities, a] })),

      setRecommendations: (recs) => {
        const uId = get().currentUserId;
        if (!uId) return;
        set((s) => ({
          recommendations: [...s.recommendations.filter((r) => r.userId !== uId), ...recs],
        }));
      },

      rateRecommendation: (id, rating) =>
        set((s) => ({
          recommendations: s.recommendations.map((r) => (r.id === id ? { ...r, rating } : r)),
        })),

      dismissRecommendation: (id) =>
        set((s) => ({
          recommendations: s.recommendations.map((r) =>
            r.id === id ? { ...r, isDismissed: true } : r,
          ),
        })),

      saveRecommendation: (id) =>
        set((s) => ({
          recommendations: s.recommendations.map((r) =>
            r.id === id ? { ...r, saved: !r.saved } : r,
          ),
        })),

      awardBadge: (badgeType) => {
        const uId = get().currentUserId;
        if (!uId) return null;
        if (get().badges.some((b) => b.userId === uId && b.badgeType === badgeType)) return null;
        const badge: UserBadge = {
          id: uid('badge'),
          userId: uId,
          badgeType,
          earnedAt: new Date().toISOString(),
        };
        set((s) => ({
          badges: [...s.badges, badge],
          notifications: [
            {
              id: uid('notif'),
              userId: uId,
              type: 'badge',
              message: `¡Insignia desbloqueada: ${BADGE_BY_TYPE[badgeType]?.name ?? badgeType}!`,
              isRead: false,
              sentAt: new Date().toISOString(),
            },
            ...s.notifications,
          ],
        }));
        return badge;
      },

      addCertificate: (pathId, pathTitle) => {
        const uId = get().currentUserId!;
        const existing = get().certificates.find((c) => c.userId === uId && c.pathId === pathId);
        if (existing) return existing;
        const cert: Certificate = {
          id: uid('cert'),
          userId: uId,
          pathId,
          pathTitle,
          issuedAt: new Date().toISOString(),
        };
        set((s) => ({ certificates: [...s.certificates, cert] }));
        return cert;
      },

      upsertPersonalGoal: (goal) =>
        set((s) => ({
          personalGoals: s.personalGoals.some((g) => g.id === goal.id)
            ? s.personalGoals.map((g) => (g.id === goal.id ? goal : g))
            : [...s.personalGoals, goal],
        })),

      deletePersonalGoal: (id) =>
        set((s) => ({ personalGoals: s.personalGoals.filter((g) => g.id !== id) })),

      upsertSession: (sess) =>
        set((s) => ({
          sessions: s.sessions.some((x) => x.id === sess.id)
            ? s.sessions.map((x) => (x.id === sess.id ? sess : x))
            : [...s.sessions, sess],
        })),

      deleteSession: (id) =>
        set((s) => ({ sessions: s.sessions.filter((x) => x.id !== id) })),

      pushNotification: (n) => {
        const uId = get().currentUserId;
        if (!uId) return;
        set((s) => ({
          notifications: [
            {
              id: uid('notif'),
              userId: uId,
              isRead: false,
              sentAt: new Date().toISOString(),
              ...n,
            },
            ...s.notifications,
          ],
        }));
      },

      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        })),

      markAllNotificationsRead: () => {
        const uId = get().currentUserId;
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.userId === uId ? { ...n, isRead: true } : n,
          ),
        }));
      },

      toggleFavorite: (contentId) => {
        const uId = get().currentUserId;
        if (!uId) return;
        set((s) => {
          const exists = s.favorites.some((f) => f.userId === uId && f.contentId === contentId);
          return {
            favorites: exists
              ? s.favorites.filter((f) => !(f.userId === uId && f.contentId === contentId))
              : [...s.favorites, { userId: uId, contentId }],
          };
        });
      },

      addChatMessage: (m) => set((s) => ({ chat: [...s.chat, m] })),
      clearChat: () => set({ chat: [] }),
    }),
    {
      name: PERSIST_KEY,
      storage: jsonStorage,
      // el chat es de sesión: no lo persistimos
      partialize: (s) => {
        const { chat: _chat, ...rest } = s;
        return rest;
      },
    },
  ),
);
