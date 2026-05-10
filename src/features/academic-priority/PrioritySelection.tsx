import React, { useState, useEffect } from 'react';
import { getCriticality } from '../../services/api';

type FilterType = 'all' | 'key' | 'lowslots' | 'compatible';

interface PrioritySubject {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  attempts: number;
  ic: number;
  icLabel: 'CRÍTICO' | 'ALTO' | 'MEDIO';
  isKey: boolean;
  slotsAvailable: number;
  slotsTotal: number;
  schedules: string[];
  unlocks: string[];
  compatible: boolean;
}

/* ── Fallback Data ─────────────────────────────────────────── */
const FALLBACK_PRIORITY: PrioritySubject[] = [];

function icColor(label: PrioritySubject['icLabel']) {
  if (label === 'CRÍTICO') return { text: 'text-app-danger', border: 'border-app-danger', bg: 'bg-app-danger/10' };
  if (label === 'ALTO')    return { text: 'text-app-warning', border: 'border-app-warning', bg: 'bg-app-warning/10' };
  return { text: 'text-yellow-300', border: 'border-yellow-300', bg: 'bg-yellow-300/10' };
}

function SlotBar({ available, total }: { available: number; total: number }) {
  const pct = (available / total) * 100;
  const color = pct < 15 ? 'bg-app-danger' : pct < 35 ? 'bg-app-warning' : 'bg-app-success';
  const textColor = pct < 15 ? 'text-app-danger' : pct < 35 ? 'text-app-warning' : 'text-app-success';
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-app-card rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-bold ${textColor} whitespace-nowrap`}>
        {available}/{total} cupos
      </span>
    </div>
  );
}

function PriorityCard({ subject, rank }: { subject: PrioritySubject; rank: number }) {
  const col = icColor(subject.icLabel);
  const isCritical = subject.icLabel === 'CRÍTICO';

  return (
    <div className={`bg-app-card border rounded-xl overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg ${isCritical ? 'border-app-danger/40' : 'border-app-border'}`}>
      {/* Critical banner */}
      {isCritical && (
        <div className="bg-app-danger/15 border-b border-app-danger/30 px-5 py-2 flex items-center gap-2">
          <i className="fa-solid fa-bolt text-app-danger text-xs" />
          <span className="text-app-danger text-xs font-bold tracking-wider">¡ÚLTIMOS {subject.slotsAvailable} CUPOS!</span>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Left: info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {/* Rank */}
              <span className="w-6 h-6 rounded-full bg-app-accent/20 border border-app-accent/40 text-app-accent text-xs font-bold flex items-center justify-center shrink-0">
                {rank}
              </span>
              <span className="text-[10px] font-bold text-app-textMuted bg-app-surface px-2 py-0.5 rounded">{subject.code}</span>
              {subject.isKey && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-app-warning bg-app-warning/10 border border-app-warning/20 px-2 py-0.5 rounded flex items-center gap-1">
                  <i className="fa-solid fa-key text-[8px]" /> LLAVE
                </span>
              )}
              {subject.compatible && (
                <span className="text-[10px] font-bold text-app-success bg-app-success/10 border border-app-success/20 px-2 py-0.5 rounded flex items-center gap-1">
                  <i className="fa-solid fa-check text-[8px]" /> Compatible
                </span>
              )}
            </div>
            <h3 className="text-white font-bold text-base mb-0.5">{subject.name}</h3>
            <p className="text-app-textMuted text-xs">
              Sem. {subject.semester} • {subject.credits} cr • {subject.attempts} intento{subject.attempts > 1 ? 's' : ''} previo{subject.attempts > 1 ? 's' : ''}
            </p>
          </div>

          {/* Right: IC circle */}
          <div className="flex flex-col items-center shrink-0">
            <div className={`w-14 h-14 rounded-full border-2 ${col.border} flex flex-col items-center justify-center ${col.bg}`}>
              <span className={`text-base font-black ${col.text}`}>{subject.ic.toFixed(2)}</span>
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-wider mt-1 ${col.text}`}>{subject.icLabel}</span>
          </div>
        </div>

        {/* Slots bar */}
        <div className="mt-4">
          <SlotBar available={subject.slotsAvailable} total={subject.slotsTotal} />
        </div>

        {/* Schedules */}
        <div className="flex flex-wrap gap-2 mt-3">
          {subject.schedules.map(s => (
            <span key={s} className="text-[10px] font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2 py-1 rounded flex items-center gap-1">
              <i className="fa-regular fa-clock text-[8px]" /> {s}
            </span>
          ))}
        </div>

        {/* Unlocks */}
        <div className="mt-3 flex items-start gap-2">
          <i className="fa-solid fa-key text-app-textMuted text-xs mt-0.5 shrink-0" />
          <p className="text-xs text-app-textMuted">
            <span className="text-app-textMuted/70">Desbloquea: </span>
            <span className="text-white/80">{subject.unlocks.join(', ')}</span>
          </p>
        </div>

        {/* Action */}
        <button
          className={`mt-4 w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            isCritical
              ? 'bg-app-danger hover:bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.2)]'
          }`}
        >
          <i className="fa-solid fa-calendar-check" />
          {isCritical ? 'Reservar Cupo Prioritario' : 'Seleccionar Cupo'}
          <i className="fa-solid fa-chevron-right text-xs" />
        </button>
      </div>
    </div>
  );
}

const FILTERS: { id: FilterType; label: string; icon: string }[] = [
  { id: 'all',        label: 'Todas',       icon: 'fa-solid fa-list' },
  { id: 'key',        label: 'Llaves',      icon: 'fa-solid fa-key' },
  { id: 'lowslots',   label: 'Cupos bajos', icon: 'fa-solid fa-circle-exclamation' },
  { id: 'compatible', label: 'Compatible',  icon: 'fa-solid fa-heart' },
];

export function PrioritySelection() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [subjects, setSubjects] = useState<PrioritySubject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getCriticality('STU-001', 'CS-2024');
        if (response.success && response.data) {
          const mapped = response.data.map((r: any): PrioritySubject => {
            let label: 'CRÍTICO' | 'ALTO' | 'MEDIO' = 'MEDIO';
            if (r.criticalityIndex >= 0.8) label = 'CRÍTICO';
            else if (r.criticalityIndex >= 0.5) label = 'ALTO';

            return {
              id: r.courseId,
              name: r.courseName,
              code: r.courseId,
              credits: 3,
              semester: 4,
              attempts: 1,
              ic: r.criticalityIndex,
              icLabel: label,
              isKey: r.unlockedCoursesCount > 0,
              slotsAvailable: Math.floor(Math.random() * 20), // Mocked for UI
              slotsTotal: 40,
              schedules: ['Horario por asignar'],
              unlocks: r.unlockedCourses || [],
              compatible: true,
            };
          });
          setSubjects(mapped);
        }
      } catch (err) {
        console.error('Failed to load priority data', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filtered = subjects.filter(s => {
    if (activeFilter === 'key')        return s.isKey;
    if (activeFilter === 'lowslots')   return s.slotsAvailable <= 5;
    if (activeFilter === 'compatible') return s.compatible;
    return true;
  });

  const avgIC = subjects.length > 0 
    ? (subjects.reduce((acc, s) => acc + s.ic, 0) / subjects.length).toFixed(2)
    : '0.00';
  
  const keyCount = subjects.filter(s => s.isKey).length;
  const criticalSlots = subjects.filter(s => s.slotsAvailable <= 5).length;

  return (
    <main className="flex-1 overflow-y-auto bg-app-bg p-8 us07-scroll">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Selección Prioritaria</h1>
          <p className="text-app-textMuted">Cola de materias ordenada por Índice de Criticidad (IC). Reserva los cupos más urgentes antes de que se agoten.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'IC Promedio', value: avgIC, icon: 'fa-solid fa-chart-line', color: 'text-app-warning' },
            { label: 'Materias Llave', value: keyCount.toString(), icon: 'fa-solid fa-key', color: 'text-app-warning' },
            { label: 'Cupos Críticos', value: criticalSlots.toString(), icon: 'fa-solid fa-bolt', color: 'text-app-danger' },
          ].map(stat => (
            <div key={stat.label} className="bg-app-surface border border-app-border rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-app-card flex items-center justify-center shrink-0">
                <i className={`${stat.icon} ${stat.color}`} />
              </div>
              <div>
                <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-app-textMuted">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === f.id
                  ? 'bg-app-accent text-white'
                  : 'bg-app-surface border border-app-border text-app-textMuted hover:text-white'
              }`}
            >
              <i className={f.icon} />
              {f.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-app-textMuted">{filtered.length} materia{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''} • Por IC descendente</span>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {loading ? (
             <div className="py-20 text-center text-app-textMuted">
                <i className="fa-solid fa-spinner fa-spin text-3xl mb-4 block text-indigo-500" />
                Sincronizando prioridades con el historial académico...
             </div>
          ) : (
            filtered.map((s, i) => (
              <PriorityCard key={s.id} subject={s} rank={i + 1} />
            ))
          )}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-16 text-app-textMuted">
              <i className="fa-solid fa-filter text-3xl mb-3 block" />
              <p>No hay materias con este filtro.</p>
            </div>
          )}
        </div>
      </div>

      <button className="fixed bottom-6 right-6 w-10 h-10 bg-app-card border border-app-border rounded-full flex items-center justify-center text-app-textMuted hover:text-white hover:bg-app-surface transition-colors shadow-lg z-50">
        <i className="fa-solid fa-question" />
      </button>
    </main>
  );
}
