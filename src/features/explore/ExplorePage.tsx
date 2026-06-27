import { useMemo, useState } from 'react';
import { Search, Heart, X, SlidersHorizontal, Clock, Sparkles } from 'lucide-react';
import type { ContentType, LearningStyle, Level } from '@/types';
import { MODULES, MODULE_BY_ID } from '@/data/modules';
import { RESOURCES } from '@/data/resources';
import { SKILL_BY_ID } from '@/data/skills';
import { useStore } from '@/store/useStore';
import { useCurrentUser, useProfile, useFavorites, useActivePath } from '@/store/selectors';
import { Card, EmptyState, Pill, SectionTitle, cx } from '@/components/ui';
import { LEARNING_STYLES } from '@/features/profile/constants';
import { toast } from '@/store/useToast';

interface Item {
  id: string;
  kind: 'module' | 'resource';
  title: string;
  description: string;
  durationMinutes: number;
  level: Level;
  type: ContentType;
  skillId: string;
}

const ALL_ITEMS: Item[] = [
  ...MODULES.map((m) => ({
    id: m.id, kind: 'module' as const, title: m.title, description: m.description,
    durationMinutes: m.durationMinutes, level: m.difficulty, type: m.contentType, skillId: m.skillId,
  })),
  ...RESOURCES.map((r) => ({
    id: r.id, kind: 'resource' as const, title: r.title, description: r.description,
    durationMinutes: r.durationMinutes, level: r.level, type: r.type, skillId: r.skillId,
  })),
];

const LEVELS: Level[] = ['basico', 'intermedio', 'avanzado'];
const TYPES: ContentType[] = ['teorico', 'practico', 'mixto', 'video', 'ejercicios', 'ejemplos_reales'];
const DURATIONS = [
  { id: 'short', label: '≤ 25 min', test: (d: number) => d <= 25 },
  { id: 'medium', label: '26–45 min', test: (d: number) => d > 25 && d <= 45 },
  { id: 'long', label: '> 45 min', test: (d: number) => d > 45 },
];

export function ExplorePage() {
  const favorites = useFavorites();
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const activePath = useActivePath();

  const [query, setQuery] = useState('');
  const [levels, setLevels] = useState<Level[]>([]);
  const [types, setTypes] = useState<ContentType[]>([]);
  const [durations, setDurations] = useState<string[]>([]);
  const [onlyFavs, setOnlyFavs] = useState(false);

  function toggle<T>(list: T[], v: T, set: (l: T[]) => void) {
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_ITEMS.filter((it) => {
      if (q && !(it.title.toLowerCase().includes(q) || it.description.toLowerCase().includes(q) || SKILL_BY_ID[it.skillId]?.name.toLowerCase().includes(q))) return false;
      if (levels.length && !levels.includes(it.level)) return false;
      if (types.length && !types.includes(it.type)) return false;
      if (durations.length && !durations.some((d) => DURATIONS.find((x) => x.id === d)!.test(it.durationMinutes))) return false;
      if (onlyFavs && !favorites.includes(it.id)) return false;
      return true;
    });
  }, [query, levels, types, durations, onlyFavs, favorites]);

  const activeFilters = levels.length + types.length + durations.length + (onlyFavs ? 1 : 0);

  // recursos del módulo activo (HU-50)
  const activeModule = activePath?.modules.find((m) => m.status === 'in_progress');
  const moduleResources = activeModule
    ? RESOURCES.filter((r) => r.skillId === MODULE_BY_ID[activeModule.moduleId]?.skillId).slice(0, 3)
    : [];

  return (
    <div className="space-y-6">
      <SectionTitle title="Explorar y recursos" subtitle="Busca módulos y recursos, filtra y guarda tus favoritos." />

      <ExperiencePreferences />

      {moduleResources.length > 0 && (
        <Card className="border-brand-200 bg-brand-50/40">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-700">
            <Sparkles className="h-4 w-4" /> Recursos para tu módulo activo
          </p>
          <div className="flex flex-wrap gap-2">
            {moduleResources.map((r) => (
              <Pill key={r.id} tone="brand">{r.title} · {r.durationMinutes} min</Pill>
            ))}
          </div>
        </Card>
      )}

      {/* búsqueda */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <input
          className="input pl-9"
          placeholder="Busca por palabra clave (ej. React, inglés, liderazgo)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* filtros */}
      <Card>
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <SlidersHorizontal className="h-4 w-4" /> Filtros
          {activeFilters > 0 && (
            <button onClick={() => { setLevels([]); setTypes([]); setDurations([]); setOnlyFavs(false); }}
              className="ml-auto text-xs font-normal text-brand-600 hover:underline">
              Limpiar ({activeFilters})
            </button>
          )}
        </p>
        <FilterGroup label="Nivel">
          {LEVELS.map((l) => <FilterChip key={l} active={levels.includes(l)} onClick={() => toggle(levels, l, setLevels)}>{l}</FilterChip>)}
        </FilterGroup>
        <FilterGroup label="Tipo de aprendizaje">
          {TYPES.map((t) => <FilterChip key={t} active={types.includes(t)} onClick={() => toggle(types, t, setTypes)}>{t.replace('_', ' ')}</FilterChip>)}
        </FilterGroup>
        <FilterGroup label="Duración">
          {DURATIONS.map((d) => <FilterChip key={d.id} active={durations.includes(d.id)} onClick={() => toggle(durations, d.id, setDurations)}>{d.label}</FilterChip>)}
        </FilterGroup>
        <FilterGroup label="Favoritos">
          <FilterChip active={onlyFavs} onClick={() => setOnlyFavs((v) => !v)}>
            <Heart className={cx('h-3.5 w-3.5', onlyFavs && 'fill-current')} /> Solo favoritos
          </FilterChip>
        </FilterGroup>
      </Card>

      {/* resultados */}
      {results.length === 0 ? (
        <EmptyState
          icon={<Search className="h-10 w-10" />}
          title="Sin resultados"
          description="No encontramos contenido con esos criterios. Prueba quitar algún filtro o cambiar la búsqueda."
        />
      ) : (
        <>
          <p className="text-sm text-slate-500">{results.length} resultado(s)</p>
          <div className="grid gap-4 md:grid-cols-2">
            {results.map((it) => {
              const fav = favorites.includes(it.id);
              return (
                <Card key={it.id} className="flex flex-col">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <Pill tone={it.kind === 'module' ? 'brand' : 'violet'}>
                      {it.kind === 'module' ? 'Módulo' : 'Recurso'}
                    </Pill>
                    <button
                      onClick={() => { toggleFavorite(it.id); toast.info(fav ? 'Quitado de favoritos' : 'Añadido a favoritos'); }}
                      className={cx('rounded-md p-1.5 transition', fav ? 'text-red-500' : 'text-slate-300 hover:text-red-400')}
                    >
                      <Heart className={cx('h-5 w-5', fav && 'fill-current')} />
                    </button>
                  </div>
                  <h3 className="font-bold text-slate-900">{it.title}</h3>
                  <p className="mb-3 mt-1 flex-1 text-sm text-slate-500">{it.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Pill tone="slate"><Clock className="h-3 w-3" /> {it.durationMinutes} min</Pill>
                    <Pill tone="amber">{it.level}</Pill>
                    <Pill tone="slate">{it.type.replace('_', ' ')}</Pill>
                    <Pill tone="brand">{SKILL_BY_ID[it.skillId]?.name}</Pill>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={cx('inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition',
        active ? 'border-brand-500 bg-brand-600 text-white' : 'border-slate-300 text-slate-600 hover:border-brand-300')}>
      {children}
      {active && <X className="h-3 w-3" />}
    </button>
  );
}

function ExperiencePreferences() {
  const user = useCurrentUser();
  const profile = useProfile();
  const saveProfile = useStore((s) => s.saveProfile);
  const styles = profile?.learningStyle ?? [];

  function toggleStyle(s: LearningStyle) {
    if (!user || !profile) return;
    const next = styles.includes(s) ? styles.filter((x) => x !== s) : [...styles, s];
    if (next.length === 0) { toast.error('Mantén al menos un estilo.'); return; }
    saveProfile({ ...profile, learningStyle: next });
    toast.info('Preferencias actualizadas. Influirán en tus recomendaciones.');
  }

  return (
    <Card>
      <p className="mb-2 text-sm font-semibold text-slate-700">Preferencias de experiencia</p>
      <p className="mb-3 text-sm text-slate-500">Elige cómo prefieres aprender; lo tendremos en cuenta para recomendarte.</p>
      <div className="flex flex-wrap gap-2">
        {LEARNING_STYLES.map((s) => (
          <button key={s.value} onClick={() => toggleStyle(s.value)}
            className={cx('rounded-full border px-3 py-1.5 text-sm transition',
              styles.includes(s.value) ? 'border-brand-500 bg-brand-600 text-white' : 'border-slate-300 text-slate-600 hover:border-brand-300')}>
            {s.label}
          </button>
        ))}
      </div>
    </Card>
  );
}
