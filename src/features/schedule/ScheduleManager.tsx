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
 * US-05: Arquitecto de Horarios (Nexus SaaS Edition)
 * Versión final con grid de 6 columnas y pintado ultra-preciso.
 */
const ScheduleManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const hours = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM'];
  const pxPerHour = 80; 
  const startHour = 8;

  const normalize = (text: any) => 
    String(text || "").toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const calculatePosition = (startTime?: string) => {
    if (!startTime) return 0;
    const match = startTime.match(/(\d+):(\d+)/);
    if (!match) return 0;
    let h = parseInt(match[1]);
    const m = parseInt(match[2]);
    if (startTime.toLowerCase().includes('pm') && h < 12) h += 12;
    // Si el formato es 24h pero el usuario puso AM/PM por error
    if (h < startHour && h !== 0) h += 12; 
    return (h - startHour + m / 60) * pxPerHour;
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const data = await generateScheduleProposals('santiago-123');
      if (data && Array.isArray(data.proposals) && data.proposals.length > 0) {
        setProposals(data.proposals);
        setActiveId(String(data.proposals[0].id));
      }
    } catch (error) {
      console.error('API Error US-05:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const propuestaActiva = proposals.find(p => String(p.id) === activeId) || null;

  const renderScoreBreakdown = (breakdown: any) => {
    if (!breakdown) return "Análisis de ruta no disponible";
    if (typeof breakdown === 'object') {
      return (
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2">
          {breakdown.creditScore !== undefined && (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px] text-indigo-400">school</span>
              <span className="text-slate-400">Créditos:</span>
              <span className="text-white font-bold">{breakdown.creditScore}</span>
            </div>
          )}
          {breakdown.gapScore !== undefined && (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px] text-emerald-400">space_dashboard</span>
              <span className="text-slate-400">Huecos:</span>
              <span className="text-white font-bold">{breakdown.gapScore}</span>
            </div>
          )}
          {breakdown.commuteScore !== undefined && (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px] text-amber-400">commute</span>
              <span className="text-slate-400">Viaje:</span>
              <span className="text-white font-bold">{breakdown.commuteScore}</span>
            </div>
          )}
        </div>
      );
    }
    return String(breakdown);
  };

  const renderScheduleBlocks = (day: string) => {
    if (!propuestaActiva || !Array.isArray(propuestaActiva.items)) return null;
    const targetDay = normalize(day);

    return propuestaActiva.items.flatMap((subject, sIdx) => 
      (subject.schedule || [])
        .filter(s => normalize(s.day) === targetDay)
        .map((s, idx) => {
          const top = calculatePosition(s.startTime);
          return (
            <div 
              key={`${sIdx}-${idx}`}
              className={`absolute left-1 right-1 rounded-xl p-4 border transition-all cursor-pointer z-30 shadow-lg flex flex-col justify-between ${
                subject.isConflict 
                ? 'conflict-glow bg-error-container/20 text-error' 
                : 'border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 text-primary'
              }`}
              style={{ top: `${top}px`, height: '140px', marginTop: '64px' }}
            >
              <div>
                <p className="font-bold text-sm leading-tight truncate">{subject.name}</p>
                <p className="text-[10px] opacity-60 mt-1 truncate">{subject.professor || 'Aula 402 • Dr. Aris'}</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`w-1.5 h-1.5 rounded-full ${subject.isConflict ? 'bg-error' : 'bg-primary'} animate-pulse`}></span>
                <span className="text-[9px] uppercase font-bold tracking-tighter opacity-60">
                  {s.startTime} - {s.endTime}
                </span>
              </div>
            </div>
          );
        })
    );
  };

  return (
    <div className="p-margin max-w-max_width mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg mb-xl">
        <div>
          <h2 className="text-4xl font-display font-black text-white mb-2 tracking-tighter">Arquitecto de Horarios</h2>
          <p className="text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-indigo-400">verified_user</span>
            Optimización algorítmica v4.2 detectada para el ciclo 2024-B
          </p>
        </div>
        
        {propuestaActiva && (
          <div className="glass-panel p-4 rounded-2xl border-primary/30 bg-primary/5 min-w-[300px]">
            <h4 className="text-[10px] font-bold text-primary uppercase mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-xs">auto_awesome</span>
              AI Insight Efficiency
            </h4>
            <div className="text-[11px] text-slate-200">
              {renderScoreBreakdown(propuestaActiva.scoreBreakdown)}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-6 gap-xs h-[800px] bg-slate-900/30 rounded-xl border border-white/5 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-primary animate-spin">psychology</span>
          </div>
        )}

        {/* Time Column */}
        <div className="col-span-1 border-r border-white/5 flex flex-col pt-16 bg-slate-950/20">
          {hours.map(h => (
            <div key={h} className="h-20 flex items-center justify-end pr-md text-slate-500 font-mono text-[11px] border-b border-white/5">
              {h}
            </div>
          ))}
        </div>

        {/* Days Columns */}
        <div className="col-span-5 grid grid-cols-5 h-full relative">
          {days.map((day, dayIdx) => (
            <div key={day} className={`relative h-full ${dayIdx < 4 ? 'border-r border-white/5' : ''}`}>
              <div className="h-16 flex items-center justify-center border-b border-white/5 font-bold text-slate-400 uppercase tracking-widest text-[10px] bg-slate-950/30">
                {day}
              </div>
              <div className="relative h-[calc(100%-64px)] w-full">
                {renderScheduleBlocks(day)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-xl space-y-6 pb-24">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-indigo-400">auto_awesome_motion</span>
          Propuestas Disponibles
        </h3>
        
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {proposals.length > 0 ? proposals.map((p, idx) => (
            <button 
              key={p.id || idx}
              onClick={() => setActiveId(String(p.id))}
              className={`shrink-0 min-w-[220px] p-5 rounded-2xl transition-all duration-300 text-left border-2 ${
                activeId === String(p.id) 
                  ? 'border-primary bg-primary/10 scale-[1.02] shadow-xl shadow-primary/10' 
                  : 'border-white/5 bg-slate-900/40 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${
                  activeId === String(p.id) ? 'bg-primary text-on-primary' : 'bg-slate-800 text-slate-500'
                }`}>PROPUESTA {String.fromCharCode(65 + idx)}</span>
                <span className="text-xs font-black text-indigo-400">{p.score.toFixed(1)}%</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1 truncate">{p.name || `Alternativa ${idx + 1}`}</h4>
              <p className="text-[10px] text-slate-500 italic">{p.items?.length || 0} Materias Detectadas</p>
            </button>
          )) : (
            <div className="w-full p-12 text-center bg-white/5 rounded-3xl border border-dashed border-white/10 text-slate-500 italic">
              Haz click en "Generar Nueva Propuesta" para iniciar el motor de IA.
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-margin right-margin z-50">
        <button 
          onClick={handleGenerate}
          disabled={isLoading}
          className="flex items-center gap-md px-xl h-16 bg-primary-container text-on-primary-container rounded-full shadow-3xl hover:scale-105 active:scale-95 transition-all group"
        >
          <span className={`material-symbols-outlined group-hover:rotate-180 transition-transform duration-500 ${isLoading ? 'animate-spin' : ''}`}>autorenew</span>
          <span className="font-bold">Generar Nueva Propuesta</span>
        </button>
      </div>
    </div>
  );
};

export default ScheduleManager;
