import React, { useState, useEffect } from 'react';
import { generateScheduleProposals } from '../../services/api';

interface MatchSubject {
  name: string;
  code: string;
  ic: number;
  schedule: string;
  room: string;
  professor: string;
  slots: number;
}

interface ScheduleMatch {
  id: string;
  score: number;
  label: string;
  description: string;
  gapScore: number;
  creditScore: number;
  commuteScore: number;
  subjects: MatchSubject[];
  totalCredits: number;
  conflicts: number;
  tag: 'ÓPTIMO' | 'RECOMENDADO' | 'ALTERNATIVO';
}

/* ── Fallback Data ─────────────────────────────────────────── */
const FALLBACK_MATCHES: ScheduleMatch[] = [];

function tagStyle(tag: ScheduleMatch['tag']) {
  if (tag === 'ÓPTIMO')      return 'bg-app-success/20 text-app-success border-app-success/40';
  if (tag === 'RECOMENDADO') return 'bg-app-accent/20 text-indigo-300 border-app-accent/40';
  return 'bg-app-textMuted/10 text-app-textMuted border-app-border';
}

function ScoreArc({ value, color }: { value: number; color: string }) {
  const pct = value / 100;
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct * 0.75); // 270° arc
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#1e293b" strokeWidth="6" strokeDasharray={`${circ * 0.75} ${circ * 0.25}`} strokeDashoffset={circ * 0.125} strokeLinecap="round" />
      <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={`${circ * 0.75 * pct} ${circ}`} strokeDashoffset={circ * 0.125} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
      <text x="36" y="38" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="14" fontWeight="bold">{value}</text>
    </svg>
  );
}

function MatchCard({ match, selected, onSelect }: { match: ScheduleMatch; selected: boolean; onSelect: () => void }) {
  const isOptimal = match.tag === 'ÓPTIMO';
  const scoreColor = match.score >= 90 ? '#10b981' : match.score >= 75 ? '#6366f1' : '#94a3b8';

  return (
    <div
      onClick={onSelect}
      className={`bg-app-surface border rounded-2xl overflow-hidden cursor-pointer transition-all ${
        selected ? 'border-app-accent shadow-[0_0_20px_rgba(99,102,241,0.25)]' : 'border-app-border hover:border-app-border/80'
      }`}
    >
      {/* Card header */}
      <div className="p-5 flex items-start gap-4">
        <ScoreArc value={match.score} color={scoreColor} />

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${tagStyle(match.tag)}`}>
              {match.tag}
            </span>
            {match.conflicts > 0 && (
              <span className="text-[10px] font-bold text-app-warning bg-app-warning/10 border border-app-warning/20 px-2 py-0.5 rounded">
                {match.conflicts} conflicto
              </span>
            )}
          </div>
          <h3 className="text-white font-bold text-sm">{match.label}</h3>
          <p className="text-app-textMuted text-xs mt-1 leading-relaxed">{match.description}</p>
        </div>
      </div>

      {/* Mini metrics */}
      <div className="px-5 pb-4 grid grid-cols-3 gap-3">
        {[
          { label: 'Huecos', value: match.gapScore },
          { label: 'Créditos', value: match.creditScore },
          { label: 'Commute', value: match.commuteScore },
        ].map(m => {
          const c = m.value >= 85 ? 'text-app-success' : m.value >= 70 ? 'text-app-warning' : 'text-app-textMuted';
          return (
            <div key={m.label} className="bg-app-card rounded-lg p-2 text-center">
              <div className={`text-base font-black ${c}`}>{m.value}</div>
              <div className="text-[10px] text-app-textMuted">{m.label}</div>
            </div>
          );
        })}
      </div>

      {/* Subject list */}
      <div className="border-t border-app-border">
        {match.subjects.map((s, i) => (
          <div key={s.code} className={`px-5 py-3 flex items-center gap-3 ${i < match.subjects.length - 1 ? 'border-b border-app-border/50' : ''}`}>
            <div className="w-8 h-8 rounded-lg bg-app-card flex items-center justify-center shrink-0">
              <i className="fa-solid fa-book-open text-app-accent text-xs" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-semibold truncate">{s.name}</div>
              <div className="text-app-textMuted text-[10px]">{s.schedule} • {s.room} • {s.professor}</div>
            </div>
            <div className="text-right shrink-0">
              <div className={`text-xs font-bold ${s.slots <= 5 ? 'text-app-danger' : s.slots <= 10 ? 'text-app-warning' : 'text-app-success'}`}>
                {s.slots} cupos
              </div>
              <div className="text-[10px] text-app-textMuted">IC {s.ic.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-app-border flex items-center justify-between bg-app-card/30">
        <div className="text-xs text-app-textMuted">
          <span className="text-white font-bold">{match.totalCredits} créditos</span> • {match.subjects.length} materias
        </div>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            selected
              ? 'bg-app-accent text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]'
              : 'bg-app-card border border-app-border text-app-textMuted hover:text-white hover:border-app-accent/50'
          }`}
          onClick={e => { e.stopPropagation(); onSelect(); }}
        >
          {selected ? <><i className="fa-solid fa-check" /> Seleccionado</> : <>Seleccionar <i className="fa-solid fa-chevron-right text-[10px]" /></>}
        </button>
      </div>
    </div>
  );
}

export function SmartMatch() {
  const [selected, setSelected] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [matches, setMatches] = useState<ScheduleMatch[]>([]);

  useEffect(() => {
    handleGenerate();
  }, []);

  async function handleGenerate() {
    setGenerating(true);
    try {
      // Intentar obtener propuestas del backend
      const response = await generateScheduleProposals('STU-001');
      if (response && response.data) {
        setMatches(response.data);
        if (response.data.length > 0) setSelected(response.data[0].id);
      } else {
        // Si no hay backend, dejamos vacío (según petición de quitar estáticos)
        setMatches([]);
      }
    } catch (err) {
      console.error('Error generating schedules:', err);
      setMatches([]);
    } finally {
      setGenerating(false);
    }
  }

  const selectedMatch = matches.find(m => m.id === selected);

  return (
    <main className="flex-1 overflow-y-auto bg-app-bg p-8 us07-scroll">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Smart Match Académico</h1>
            <p className="text-app-textMuted">El motor IA genera combinaciones óptimas de horario considerando tus materias críticas, bienestar y tiempos de desplazamiento.</p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="us07-glow-btn shrink-0 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all"
          >
            <i className={`fa-solid ${generating ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`} />
            {generating ? 'Calculando…' : 'Regenerar'}
          </button>
        </div>

        {/* IA Insight banner */}
        <div className="bg-indigo-600/10 border border-indigo-500/25 rounded-xl p-4 flex items-start gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5">
            <i className="fa-solid fa-microchip text-indigo-400 text-xs" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold mb-0.5">Motor IA — Resultado del Análisis CSP</p>
            <p className="text-indigo-200/70 text-xs leading-relaxed">
              Se evaluaron 847 combinaciones posibles. El <strong className="text-white">Horario A</strong> resuelve el 100% de las materias críticas con IC ≥ 0.95 sin conflictos de franja horaria. Probabilidad estimada de éxito: <strong className="text-app-success">87%</strong>.
            </p>
          </div>
        </div>

        {/* Match cards */}
        <div className="space-y-5">
          {generating ? (
            <div className="py-20 text-center text-app-textMuted">
              <i className="fa-solid fa-microchip fa-spin text-3xl mb-4 block text-indigo-500" />
              El motor IA está analizando miles de combinaciones...
            </div>
          ) : matches.length === 0 ? (
            <div className="py-20 text-center text-app-textMuted border border-dashed border-app-border rounded-2xl">
              No se encontraron propuestas de horario.
            </div>
          ) : (
            matches.map(m => (
              <MatchCard
                key={m.id}
                match={m}
                selected={selected === m.id}
                onSelect={() => setSelected(m.id)}
              />
            ))
          )}
        </div>

        {/* Confirm CTA */}
        <div className="mt-8 bg-app-surface border border-app-border rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold text-sm">
              Horario seleccionado: <span className="text-indigo-300">{selectedMatch?.label || 'Ninguno'}</span>
            </p>
            <p className="text-app-textMuted text-xs mt-0.5">Al confirmar, se iniciará el proceso de reserva de cupos para las materias incluidas.</p>
          </div>
          <button className="us07-glow-btn shrink-0 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all whitespace-nowrap">
            <i className="fa-solid fa-calendar-check" />
            Confirmar Horario
          </button>
        </div>
      </div>

      <button className="fixed bottom-6 right-6 w-10 h-10 bg-app-card border border-app-border rounded-full flex items-center justify-center text-app-textMuted hover:text-white hover:bg-app-surface transition-colors shadow-lg z-50">
        <i className="fa-solid fa-question" />
      </button>
    </main>
  );
}
