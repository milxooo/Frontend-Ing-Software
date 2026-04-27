import React, { useState } from 'react';
import { generateScheduleProposals } from '../../services/api';

interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

interface SubjectItem {
  name: string;
  schedule?: Schedule[];
  isConflict: boolean;
  professor?: string;
  classroom?: string;
  conflictReason?: string;
}

interface ScoreBreakdown {
  creditScore?: number;
  gapScore?: number;
  failedCourseScore?: number;
  commuteScore?: number;
  zoneScore?: number;
}

interface Proposal {
  id: string;
  name: string;
  score: number;
  scoreBreakdown?: string | ScoreBreakdown;
  items: SubjectItem[];
}

/**
 * US-05: Arquitecto de Horarios
 * Versión Técnica Final optimizada para el Backend SAP.
 */
const ScheduleManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const hours = ['05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'];
  const pxPerHour = 80;
  const startHour = 5;

  const normalize = (text: any) => {
    return String(text || "").toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const getSubjectColor = (name: any) => {
    const colors = [
      'from-indigo-500/20 to-indigo-600/10 border-indigo-500/40 text-indigo-400',
      'from-emerald-500/20 to-emerald-600/10 border-emerald-500/40 text-emerald-400',
      'from-amber-500/20 to-amber-600/10 border-amber-500/40 text-amber-400',
      'from-rose-500/20 to-rose-600/10 border-rose-500/40 text-rose-400',
      'from-violet-500/20 to-violet-600/10 border-violet-500/40 text-violet-400',
    ];
    let hash = 0;
    const sName = String(name || 'Materia');
    for (let i = 0; i < sName.length; i++) hash = sName.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const parseTime = (timeStr: string) => {
    if (!timeStr) return null;
    const parts = timeStr.split(':');
    const h = parseInt(parts[0]);
    const m = parseInt(parts[1] || '0');
    return isNaN(h) ? null : { h, m };
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const data = await generateScheduleProposals('santiago-123');
      if (data && Array.isArray(data.proposals) && data.proposals.length > 0) {
        setProposals(data.proposals);
        setActiveId(String(data.proposals[0].id || 'p0'));
      }
    } catch (error) {
      console.error('API Error US-05:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const propuestaActiva = proposals.find(p => String(p.id || 'p0') === activeId) || null;

  /**
   * Renderizado optimizado según Ficha Técnica del Backend
   */
  const renderizarMateriaEnCalendario = (dayName: string) => {
    if (!propuestaActiva || !propuestaActiva.items) return null;
    
    const targetDay = normalize(dayName);
    
    return propuestaActiva.items.flatMap((subject, sIdx) => {
      return (subject.schedule || []).map((slot, slotIdx) => {
        // Match exacto/prefijo según especificación ("Lunes" === "Lunes")
        if (normalize(slot.day) !== targetDay) return null;

        const start = parseTime(slot.startTime);
        const end = parseTime(slot.endTime);
        
        if (!start || !end) return null;

        // Cálculo de posición en pixeles
        const topPos = (start.h - startHour + start.m / 60) * pxPerHour;
        const durationHours = (end.h + end.m / 60) - (start.h + start.m / 60);
        const heightPos = durationHours * pxPerHour;

        const colorClass = getSubjectColor(subject.name);

        return (
          <div 
            key={`${sIdx}-${slotIdx}`}
            className={`absolute left-1 right-1 rounded-xl p-3 border-l-4 shadow-2xl transition-all hover:scale-[1.03] hover:z-30 z-20 bg-linear-to-br ${
              subject.isConflict ? 'bg-error/20 border-error text-error' : colorClass
            }`}
            style={{ top: `${topPos}px`, height: `${Math.max(heightPos, 40)}px` }}
          >
            <div className="flex flex-col h-full justify-between overflow-hidden">
              <div className="space-y-1">
                <h4 className="text-[10px] font-black uppercase leading-none truncate text-white">{subject.name}</h4>
                <p className="text-[8px] opacity-70 font-medium truncate">{subject.professor || 'Sin Profesor'}</p>
              </div>
              <div className="flex justify-between items-center mt-auto pt-1 border-t border-white/5">
                <span className="text-[9px] font-mono font-bold tracking-tighter">{slot.startTime} - {slot.endTime}</span>
                <span className="text-[8px] bg-white/10 px-1 rounded truncate">{subject.classroom || 'Aula'}</span>
              </div>
            </div>
          </div>
        );
      });
    });
  };

  const renderScoreBreakdown = (breakdown: any) => {
    if (!breakdown) return "Analizando propuesta...";
    if (typeof breakdown === 'object') {
      return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
          {breakdown.creditScore !== undefined && (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px] text-indigo-400">school</span>
              <span className="text-slate-400 text-[10px]">Créditos:</span>
              <span className="text-white font-bold">{breakdown.creditScore}</span>
            </div>
          )}
          {breakdown.gapScore !== undefined && (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px] text-emerald-400">space_dashboard</span>
              <span className="text-slate-400 text-[10px]">Huecos:</span>
              <span className="text-white font-bold">{breakdown.gapScore}</span>
            </div>
          )}
          {breakdown.commuteScore !== undefined && (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px] text-amber-400">commute</span>
              <span className="text-slate-400 text-[10px]">Viaje:</span>
              <span className="text-white font-bold">{breakdown.commuteScore}</span>
            </div>
          )}
          {breakdown.failedCourseScore !== undefined && (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px] text-rose-400">warning</span>
              <span className="text-slate-400 text-[10px]">Riesgo:</span>
              <span className="text-white font-bold">{breakdown.failedCourseScore}</span>
            </div>
          )}
        </div>
      );
    }
    return String(breakdown);
  };

  return (
    <div className="space-y-8 animate-fade-in relative pb-20 max-w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-display font-black text-white mb-2 tracking-tight">Arquitecto IA [US-05]</h2>
          <div className="flex items-center gap-4">
            <p className="text-on-surface-variant flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-sm text-indigo-400">verified_user</span>
              Motor SAP Sergio Arboleda
            </p>
            <span className="text-white/20">|</span>
            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
              V2.5 STABLE
            </span>
          </div>
        </div>

        {propuestaActiva && (
          <div className="glass-panel p-4 rounded-2xl border-primary/30 bg-primary/5 max-w-md animate-slide-up shadow-indigo-500/5">
            <h4 className="text-[10px] font-bold text-primary uppercase mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-xs">psychology</span>
              AI Insight Breakdown
            </h4>
            <div className="text-[11px] text-slate-200">
              {renderScoreBreakdown(propuestaActiva.scoreBreakdown)}
            </div>
          </div>
        )}
      </div>

      {/* Main Grid Section */}
      <div className="relative overflow-hidden bg-slate-900/40 rounded-3xl border border-white/10 shadow-2xl min-h-[600px]">
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <span className="material-symbols-outlined text-6xl text-primary animate-spin">autorenew</span>
              <p className="text-primary font-bold animate-pulse uppercase tracking-widest text-xs">Optimizando Mallas...</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-8 h-[1520px] overflow-y-auto custom-scrollbar">
          {/* Time Sidebar */}
          <div className="col-span-1 border-r border-white/5 pt-16 bg-slate-950/20">
            {hours.map(h => (
              <div key={h} className="h-[80px] flex items-center justify-end pr-4 text-slate-600 font-mono text-[10px] border-b border-white/5">{h}</div>
            ))}
          </div>

          {/* Days Columns */}
          <div className="col-span-7 grid grid-cols-7 relative">
            {days.map((day, dayIdx) => (
              <div key={day} className={`relative flex flex-col ${dayIdx < 6 ? 'border-r border-white/5' : ''}`}>
                <div className="h-16 flex items-center justify-center border-b border-white/5 font-black text-slate-400 uppercase tracking-widest text-[10px] bg-slate-950/40 sticky top-0 z-40 backdrop-blur-md">{day}</div>
                <div className="relative grow min-h-[1520px]">
                  {renderizarMateriaEnCalendario(day)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Proposals Selection Section */}
      <div className="mt-12 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-indigo-400">grid_view</span>
          Propuestas del Optimizador
        </h3>
        
        <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar">
          {proposals.length > 0 ? proposals.map((p, idx) => (
            <button 
              key={String(p.id || idx)}
              onClick={() => setActiveId(String(p.id || `p${idx}`))}
              className={`shrink-0 min-w-[240px] p-6 rounded-3xl transition-all duration-500 text-left border-2 group relative overflow-hidden ${
                activeId === String(p.id || `p${idx}`) 
                  ? 'border-primary bg-primary/10 scale-[1.02] shadow-2xl shadow-primary/20' 
                  : 'border-white/5 bg-slate-900/40 hover:border-white/20'
              }`}
            >
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                    activeId === String(p.id || `p${idx}`) ? 'bg-primary text-on-primary' : 'bg-white/5 text-slate-500'
                  }`}>Opción {idx + 1}</span>
                  <div className="flex flex-col items-end">
                    <span className="text-xl font-black text-white">{(p.score || 0).toFixed(1)}%</span>
                    <span className="text-[8px] text-slate-500 uppercase font-bold">Score IA</span>
                  </div>
                </div>
                <h4 className="text-base font-bold text-white mb-2 truncate group-hover:text-primary transition-colors">{String(p.name || 'Ruta Académica')}</h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="material-symbols-outlined text-sm">menu_book</span>
                  {(p.items?.length || 0)} Asignaturas
                </div>
              </div>
            </button>
          )) : (
            <div className="w-full p-12 text-center bg-white/5 rounded-[2.5rem] border-2 border-dashed border-white/10 text-slate-500 italic">
              <span className="material-symbols-outlined text-4xl mb-4 block">smart_toy</span>
              Toca "Optimizar Ahora" para que la IA diseñe tus rutas.
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={handleGenerate}
          disabled={isLoading}
          className="flex items-center gap-4 px-10 h-20 bg-primary text-on-primary rounded-full shadow-[0_20px_50px_rgba(99,102,241,0.4)] hover:scale-110 active:scale-90 transition-all duration-300 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          <span className={`material-symbols-outlined text-3xl relative z-10 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}>
            autorenew
          </span>
          <span className="text-xl font-black relative z-10 tracking-tight">Optimizar Ahora</span>
        </button>
      </div>
    </div>
  );
};

export default ScheduleManager;
