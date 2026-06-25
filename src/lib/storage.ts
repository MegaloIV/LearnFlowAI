// Wrapper sobre localStorage que imita un cliente de "base de datos".
// Simula la persistencia exigida por RNF-09 sin backend real.

const PREFIX = 'learnflow:';

function key(k: string): string {
  return `${PREFIX}${k}`;
}

export const db = {
  get<T>(k: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key(k));
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  set<T>(k: string, value: T): void {
    try {
      localStorage.setItem(key(k), JSON.stringify(value));
    } catch (err) {
      console.warn('storage.set falló', err);
    }
  },

  update<T>(k: string, fallback: T, updater: (current: T) => T): T {
    const current = db.get<T>(k, fallback);
    const next = updater(current);
    db.set(k, next);
    return next;
  },

  remove(k: string): void {
    localStorage.removeItem(key(k));
  },

  /** Borra todos los datos de la app (usado al eliminar la cuenta). */
  clearAll(): void {
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const fullKey = localStorage.key(i);
      if (fullKey && fullKey.startsWith(PREFIX)) toRemove.push(fullKey);
    }
    toRemove.forEach((fk) => localStorage.removeItem(fk));
  },
};

export function uid(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
