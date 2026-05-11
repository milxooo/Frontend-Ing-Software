import React, { useState, useEffect } from 'react';
import { sugerenciasService } from '../services/api';
import type { SugerenciaAPI, TipoSugerencia, TiempoLibreAPI } from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterType = 'todos' | TipoSugerencia;

interface SugerenciaUI extends SugerenciaAPI {
  interested: boolean;
}

// ─── Config ───────────────────────────────────────────────────────────────────

// Tiempos libres del estudiante (en producción vendría del perfil/SIA)
const FREE_SLOTS: TiempoLibreAPI[] = [
  { dia: 'Lunes',     horaInicio: '10:00', horaFin: '12:00' },
  { dia: 'Miércoles', horaInicio: '14:00', horaFin: '16:00' },
  { dia: 'Viernes',   horaInicio: '08:00', horaFin: '10:00' },
];

const CATEGORY_CONFIG: Record<TipoSugerencia, { label: string; color: string; bg: string; border: string; icon: string }> = {
  CURSO_CORTO:     { label: 'Curso Corto',      color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', icon: 'school' },
  EVENTO_CULTURAL: { label: 'Evento Cultural',  color: 'text-teal-400',   bg: 'bg-teal-500/10',   border: 'border-teal-500/20',   icon: 'celebration' },
};

const FILTER_OPTIONS: { id: FilterType; label: string; icon: string }[] = [
  { id: 'todos',          label: 'Todos',            icon: 'grid_view' },
  { id: 'CURSO_CORTO',    label: 'Cursos Cortos',    icon: 'school' },
  { id: 'EVENTO_CULTURAL',label: 'Eventos Culturales', icon: 'celebration' },
];

// ─── Component ────────────────────────────────────────────────────────────────

const US13Sugerencias: React.FC = () => {
  const [suggestions, setSuggestions] = useState<SugerenciaUI[]>([]);
  const [filter, setFilter]           = useState<FilterType>('todos');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);

  // Carga sugerencias desde el backend (US-13)
  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await sugerenciasService.getPorTiempoLibre(FREE_SLOTS);
      const withInterest: SugerenciaUI[] = res.data.map(s => ({ ...s, interested: false }));
      setSuggestions(withInterest);
    } catch {
      setError('No se pudo conectar con el servidor. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  // Filtro local por tipo
  const filtered = filter === 'todos'
    ? suggestions
    : suggestions.filter(s => s.tipo === filter);

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
            <h1 className="text-4xl font-manrope font-black text-white tracking-tight leading-none">Para Ti</h1>
          </div>
        </div>
        <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
          Actividades y cursos que encajan con tus tiempos libres. Aprovecha al máximo tu estancia en el campus.
        </p>
      </div>

      {/* ── Tiempos Libres ── */}
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
            <div key={i} className="flex items-center gap-2 bg-primary/5 border border-primary/20 px-4 py-2 rounded-2xl">
              <span className="material-symbols-outlined text-primary text-base">schedule</span>
              <span className="text-sm font-bold text-white">{slot.dia}</span>
              <span className="text-xs text-slate-400">{slot.horaInicio} – {slot.horaFin}</span>
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

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center justify-center py-20 gap-3 text-slate-500">
          <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
          <span className="text-lg">Buscando sugerencias para ti...</span>
        </div>
      )}

      {/* ── Error ── */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-red-400 text-3xl">wifi_off</span>
          </div>
          <p className="text-slate-400 font-medium">{error}</p>
          <button
            onClick={fetchSuggestions}
            className="bg-primary/10 border border-primary/20 text-primary px-6 py-2 rounded-2xl text-sm font-bold hover:bg-primary/20 transition-all"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* ── Cards Grid ── */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map(s => {
            const catCfg = CATEGORY_CONFIG[s.tipo];
            return (
              <div
                key={s.id}
                className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col gap-4 group hover:border-primary/20 hover:bg-slate-900/60 transition-all duration-300"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${catCfg.bg} border ${catCfg.border}`}>
                      <span className={`material-symbols-outlined text-2xl ${catCfg.color}`}>{catCfg.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border ${catCfg.bg} ${catCfg.border} ${catCfg.color}`}>
                          {catCfg.label}
                        </span>
                        {s.esGratuita && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg text-emerald-400 bg-emerald-500/10">
                            Gratuito
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white leading-tight">{s.titulo}</h3>
                      <p className="text-xs text-slate-500">{s.campus}</p>
                    </div>
                  </div>

                  {/* Interest button */}
                  <button
                    onClick={() => toggleInterest(s.id)}
                    title={s.interested ? 'Quitar de favoritos' : 'Me interesa'}
                    className={`w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      s.interested ? 'bg-primary/20 text-primary' : 'bg-white/5 text-slate-500 hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {s.interested ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed">{s.descripcion}</p>

                {/* Meta info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-slate-600 text-base">timer</span>
                    <span>{s.duracionHoras}h</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-slate-600 text-base">location_on</span>
                    <span className="truncate">{s.campus}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-slate-600 text-base">calendar_month</span>
                    <span>{s.dias.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-slate-600 text-base">schedule</span>
                    <span>{s.horaInicio} – {s.horaFin}</span>
                  </div>
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

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="col-span-2 flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-600 text-3xl">search_off</span>
              </div>
              <p className="text-slate-500 font-medium">No hay sugerencias para este filtro en tus tiempos libres.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default US13Sugerencias;
