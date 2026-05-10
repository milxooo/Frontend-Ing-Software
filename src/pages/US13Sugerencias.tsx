import React, { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type SuggestionCategory = 'curso' | 'evento';
type FilterType = 'todos' | 'curso' | 'evento';
type DifficultyLevel = 'Básico' | 'Intermedio' | 'Avanzado';

interface FreeSlot {
  day: string;
  from: string;
  to: string;
}

interface Suggestion {
  id: string;
  category: SuggestionCategory;
  title: string;
  organizer: string;
  description: string;
  duration: string;
  location: string;
  slots: FreeSlot[];
  tags: string[];
  icon: string;
  interested: boolean;
  difficulty?: DifficultyLevel;
  cupos?: number;
}

// ─── Mock Data (US-13) ────────────────────────────────────────────────────────

const FREE_SLOTS: FreeSlot[] = [
  { day: 'Lunes',    from: '10:00', to: '12:00' },
  { day: 'Miércoles',from: '14:00', to: '16:00' },
  { day: 'Viernes',  from: '08:00', to: '10:00' },
];

const INITIAL_SUGGESTIONS: Suggestion[] = [
  {
    id: 'SUG-001',
    category: 'curso',
    title: 'Introducción a Machine Learning',
    organizer: 'Departamento de Ingeniería de Sistemas',
    description: 'Aprende los fundamentos del aprendizaje automático con Python. Ideal para complementar tu perfil profesional.',
    duration: '8 horas',
    location: 'Sala de Cómputo 3 — Bloque B',
    slots: [{ day: 'Lunes', from: '10:00', to: '12:00' }],
    tags: ['Python', 'IA', 'Datos'],
    icon: 'psychology',
    interested: false,
    difficulty: 'Básico',
    cupos: 20,
  },
  {
    id: 'SUG-002',
    category: 'evento',
    title: 'Festival de Cine Latinoamericano',
    organizer: 'Bienestar Universitario',
    description: 'Proyección de cortometrajes y largometrajes de directores emergentes de América Latina. Entrada libre.',
    duration: '3 horas',
    location: 'Auditorio Central',
    slots: [{ day: 'Miércoles', from: '14:00', to: '17:00' }],
    tags: ['Arte', 'Cultura', 'Cine'],
    icon: 'movie',
    interested: false,
    cupos: 150,
  },
  {
    id: 'SUG-003',
    category: 'curso',
    title: 'Diseño UI/UX para Ingenieros',
    organizer: 'Centro de Innovación UNAL',
    description: 'Principios de diseño centrado en el usuario, prototipado en Figma y evaluación de usabilidad.',
    duration: '12 horas',
    location: 'Lab de Innovación — Bloque A',
    slots: [{ day: 'Viernes', from: '08:00', to: '10:00' }],
    tags: ['Diseño', 'Figma', 'UX'],
    icon: 'brush',
    interested: false,
    difficulty: 'Intermedio',
    cupos: 15,
  },
  {
    id: 'SUG-004',
    category: 'evento',
    title: 'Concierto de Jazz Universitario',
    organizer: 'Facultad de Artes',
    description: 'Presentación de la Banda Universitaria de Jazz en el marco de la Semana Cultural. Entrada libre para estudiantes.',
    duration: '2 horas',
    location: 'Plaza Central del Campus',
    slots: [{ day: 'Lunes', from: '10:00', to: '12:00' }],
    tags: ['Música', 'Jazz', 'Cultura'],
    icon: 'music_note',
    interested: false,
    cupos: 500,
  },
  {
    id: 'SUG-005',
    category: 'curso',
    title: 'Finanzas Personales para Jóvenes',
    organizer: 'Facultad de Economía',
    description: 'Aprende a gestionar tu dinero, crear un presupuesto y comenzar a invertir desde cero.',
    duration: '6 horas',
    location: 'Salón 204 — Bloque C',
    slots: [{ day: 'Miércoles', from: '14:00', to: '16:00' }],
    tags: ['Finanzas', 'Inversión', 'Vida'],
    icon: 'savings',
    interested: false,
    difficulty: 'Básico',
    cupos: 30,
  },
  {
    id: 'SUG-006',
    category: 'evento',
    title: 'Exposición: Arte y Tecnología',
    organizer: 'Museo de la Universidad',
    description: 'Exposición interactiva que explora la intersección entre el arte digital, la IA generativa y la expresión humana.',
    duration: 'Todo el día',
    location: 'Museo Universitario — Piso 1',
    slots: [{ day: 'Viernes', from: '08:00', to: '10:00' }],
    tags: ['Arte', 'IA', 'Digital'],
    icon: 'palette',
    interested: false,
    cupos: 200,
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<SuggestionCategory, { label: string; color: string; bg: string; border: string }> = {
  curso:  { label: 'Curso Corto', color: 'text-violet-400',  bg: 'bg-violet-500/10',  border: 'border-violet-500/20' },
  evento: { label: 'Evento Cultural', color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
};

const DIFFICULTY_COLOR: Record<DifficultyLevel, string> = {
  'Básico':      'text-emerald-400 bg-emerald-500/10',
  'Intermedio':  'text-amber-400   bg-amber-500/10',
  'Avanzado':    'text-red-400     bg-red-500/10',
};

const FILTER_OPTIONS: { id: FilterType; label: string; icon: string }[] = [
  { id: 'todos',  label: 'Todos',            icon: 'grid_view' },
  { id: 'curso',  label: 'Cursos Cortos',    icon: 'school' },
  { id: 'evento', label: 'Eventos Culturales', icon: 'celebration' },
];

// ─── Component ────────────────────────────────────────────────────────────────

const US13Sugerencias: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(INITIAL_SUGGESTIONS);
  const [filter, setFilter]           = useState<FilterType>('todos');

  const filtered = filter === 'todos'
    ? suggestions
    : suggestions.filter(s => s.category === filter);

  const interestedCount = suggestions.filter(s => s.interested).length;

  const toggleInterest = (id: string) => {
    setSuggestions(prev =>
      prev.map(s => s.id === id ? { ...s, interested: !s.interested } : s)
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">

      {/* ── Header ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-2xl">lightbulb</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-primary uppercase tracking-widest">US-13 · Sugerencias Personalizadas</p>
            <h1 className="text-4xl font-manrope font-black text-white tracking-tight leading-none">
              Para Ti
            </h1>
          </div>
        </div>
        <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
          Actividades y cursos que encajan con tus tiempos libres. Aprovecha al máximo tu estancia en el campus.
        </p>
      </div>

      {/* ── Tiempos Libres Detectados ── */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-primary text-xl">calendar_today</span>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Tus tiempos libres detectados</h2>
          <span className="ml-auto text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
            Sincronizado con SIA
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {FREE_SLOTS.map((slot, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-primary/5 border border-primary/20 px-4 py-2 rounded-2xl"
            >
              <span className="material-symbols-outlined text-primary text-base">schedule</span>
              <span className="text-sm font-bold text-white">{slot.day}</span>
              <span className="text-xs text-slate-400">{slot.from} – {slot.to}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filters + Count ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2 bg-slate-900/40 p-1.5 rounded-2xl border border-white/5">
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                filter === opt.id
                  ? 'bg-primary text-slate-950 shadow-lg shadow-primary/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-base">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>

        {interestedCount > 0 && (
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-2xl">
            <span className="material-symbols-outlined text-primary text-base">favorite</span>
            <span className="text-sm font-bold text-white">{interestedCount} guardadas</span>
          </div>
        )}
      </div>

      {/* ── Cards Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map(s => {
          const catCfg = CATEGORY_CONFIG[s.category];
          return (
            <div
              key={s.id}
              className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col gap-4 group hover:border-primary/20 hover:bg-slate-900/60 transition-all duration-300"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${catCfg.bg} border ${catCfg.border}`}>
                    <span className={`material-symbols-outlined text-2xl ${catCfg.color}`}>{s.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border ${catCfg.bg} ${catCfg.border} ${catCfg.color}`}>
                        {catCfg.label}
                      </span>
                      {s.difficulty && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${DIFFICULTY_COLOR[s.difficulty]}`}>
                          {s.difficulty}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white leading-tight">{s.title}</h3>
                    <p className="text-xs text-slate-500">{s.organizer}</p>
                  </div>
                </div>

                {/* Interest button */}
                <button
                  onClick={() => toggleInterest(s.id)}
                  title={s.interested ? 'Quitar de favoritos' : 'Me interesa'}
                  className={`w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    s.interested
                      ? 'bg-primary/20 text-primary'
                      : 'bg-white/5 text-slate-500 hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {s.interested ? 'favorite' : 'favorite_border'}
                  </span>
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-400 leading-relaxed">{s.description}</p>

              {/* Meta info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="material-symbols-outlined text-slate-600 text-base">timer</span>
                  <span>{s.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="material-symbols-outlined text-slate-600 text-base">location_on</span>
                  <span className="truncate">{s.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="material-symbols-outlined text-slate-600 text-base">schedule</span>
                  <span>{s.slots[0].day} {s.slots[0].from}–{s.slots[0].to}</span>
                </div>
                {s.cupos !== undefined && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-slate-600 text-base">group</span>
                    <span>{s.cupos} cupos disponibles</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {s.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold bg-white/5 border border-white/5 text-slate-400 px-2.5 py-1 rounded-lg"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <button
                className={`w-full py-3 rounded-2xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                  s.interested
                    ? 'bg-primary text-slate-950 shadow-lg shadow-primary/20 hover:opacity-90'
                    : 'bg-white/5 text-white border border-white/10 hover:bg-primary/10 hover:border-primary/20 hover:text-primary'
                }`}
                onClick={() => toggleInterest(s.id)}
              >
                <span className="material-symbols-outlined text-base">
                  {s.interested ? 'check_circle' : 'add_circle'}
                </span>
                {s.interested ? 'Inscrito / Guardado' : 'Me interesa'}
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Empty State ── */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-600 text-3xl">search_off</span>
          </div>
          <p className="text-slate-500 font-medium">No hay sugerencias para este filtro.</p>
        </div>
      )}
    </div>
  );
};

export default US13Sugerencias;
