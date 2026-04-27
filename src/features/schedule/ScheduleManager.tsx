import React, { useState } from 'react';
import { generateScheduleProposals } from '../../services/api';

interface Schedule {
  day: string;
  startTime?: string;
  endTime?: string;
  time?: string;
  hora?: string;
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
 * US-05: Arquitecto de Horarios (Versión Debug)
 * Incluye un panel para ver el JSON real del backend.
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

  const parseTimeSlot = (slot: Schedule) => {
    let startStr = slot.startTime;
    let endStr = slot.endTime;

    if (!startStr && (slot.time || slot.hora)) {
      const combined = (slot.time || slot.hora || "").split('-');
      startStr = combined[0];
      endStr = combined[1];
    }

    if (!startStr || !endStr) return null;

    const extract = (s: string) => {
      const parts = s.trim().split(':');
      const h = parseInt(parts[0]);
      const m = parseInt(parts[1] || '0');
      return isNaN(h) ? null : { h, m };
    };

    const start = extract(startStr);
    const end = extract(endStr);

    if (!start || !end) return null;

    const top = (start.h - startHour + start.m / 60) * pxPerHour;
    const height = ((end.h + end.m / 60) - (start.h + start.m / 60)) * pxPerHour;

    return { top, height, displayStart: startStr.trim() };
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

  const renderizarMateriaEnCalendario = (day: string) => {
    if (!propuestaActiva || !propuestaActiva.items) return null;
    
    return propuestaActiva.items.flatMap((subject, sIdx) => {
      return (subject.schedule || []).map((slot, slotIdx) => {
        const sDay = normalize(slot.day);
        const tDay = normalize(day);
        if (!sDay.includes(tDay.substring(0, 3)) && !tDay.includes(sDay.substring(0, 3))) return null;

        const pos = parseTimeSlot(slot);
        if (!pos) return null;

        const colorClass = getSubjectColor(subject.name);

        return (
          <div 
            key={`${sIdx}-${slotIdx}`}
            className={`absolute left-1 right-1 rounded-xl p-2 border-l-4 shadow-2xl transition-all hover:scale-[1.05] z-30 bg-linear-to-br backdrop-blur-sm ${
              subject.isConflict ? 'bg-error/30 border-error text-error' : colorClass
            }`}
            style={{ top: `${pos.top}px`, height: `${Math.max(pos.height, 35)}px` }}
          >
            <div className="flex flex-col h-full justify-between overflow-hidden">
              <span className="text-[10px] font-black uppercase leading-tight truncate">{String(subject.name)}</span>
              <div className="flex justify-between items-center opacity-80">
                <span className="text-[9px] font-mono font-bold">{pos.displayStart}</span>
                <span className="material-symbols-outlined text-[12px]">verified</span>
              </div>
            </div>
          </div>
        );
      });
    });
  };

  const renderScoreBreakdown = (breakdown: any) => {
    if (!breakdown) return "Análisis de ruta no disponible";
    if (typeof breakdown === 'object') {
      return (
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2">
          {Object.entries(breakdown).map(([key, value]) => {
            const labels: any = {
              creditScore: { label: 'Créditos', icon: 'school', color: 'text-indigo-400' },
              gapScore: { label: 'Huecos', icon: 'space_dashboard', color: 'text-emerald-400' },
              commuteScore: { label: 'Viaje', icon: 'commute', color: 'text-amber-400' },
              failedCourseScore: { label: 'Riesgo', icon: 'warning', color: 'text-rose-400' },
              zoneScore: { label: 'Zona', icon: 'map', color: 'text-cyan-400' }
            };
            const meta = labels[key] || { label: key, icon: 'analytics', color: 'text-slate-400' };
            return (
              <div key={key} className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-[14px] ${meta.color}`}>{meta.icon}</span>
                <span className="text-slate-400 text-[10px] uppercase font-bold">{meta.label}:</span>
                <span className="text-white font-bold">{String(value)}</span>
              </div>
            );
          })}
        </div>
      );
    }
    return String(breakdown);
  };

  return (
    <div className="space-y-8 animate-fade-in relative pb-20 max-w-full">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-display font-black text-white mb-2 tracking-tight">Arquitecto IA [US-05]</h2>
          <p className="text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-indigo-400">verified_user</span>
            Sistema SAP Sergio Arboleda | Motor de Optimización
          </p>
        </div>

        {propuestaActiva && (
          <div className="glass-panel p-4 rounded-2xl border-primary/30 bg-primary/5 max-w-lg animate-slide-up">
            <h4 className="text-[10px] font-bold text-primary uppercase mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-xs">analytics</span>
              AI Insight Breakdown
            </h4>
            <div className="text-[11px] text-slate-200">
              {renderScoreBreakdown(propuestaActiva.scoreBreakdown)}
            </div>
          </div>
        )}
      </div>

      {/* MAIN CALENDAR GRID */}
      <div className="relative overflow-hidden bg-slate-900/40 rounded-3xl border border-white/10 shadow-2xl">
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-primary animate-spin">psychology</span>
          </div>
        )}

        <div className="grid grid-cols-8 h-[1520px] overflow-y-auto custom-scrollbar relative">
          <div className="col-span-1 border-r border-white/5 bg-slate-950/20 z-10">
            <div className="h-16 border-b border-white/5"></div>
            {hours.map(h => (
              <div key={h} className="h-[80px] flex items-center justify-end pr-4 text-slate-600 font-mono text-[9px] border-b border-white/5">{h}</div>
            ))}
          </div>

          <div className="col-span-7 grid grid-cols-7 h-full relative">
            {days.map((day, dayIdx) => (
              <div key={day} className={`relative h-full ${dayIdx < 6 ? 'border-r border-white/5' : ''}`}>
                <div className="h-16 flex items-center justify-center border-b border-white/5 font-bold text-slate-500 uppercase tracking-widest text-[9px] bg-slate-950/20">{day}</div>
                <div className="relative w-full h-[1440px]">
                  {renderizarMateriaEnCalendario(day)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROPOSALS SELECTION */}
      <div className="mt-8 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-indigo-400">auto_awesome_motion</span>
          Propuestas Disponibles
        </h3>
        
        <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar">
          {proposals.length > 0 ? proposals.map((p, idx) => (
            <button 
              key={String(p.id || idx)}
              onClick={() => setActiveId(String(p.id || `p${idx}`))}
              className={`shrink-0 min-w-[220px] p-5 rounded-2xl transition-all duration-300 text-left border-2 ${
                activeId === String(p.id || `p${idx}`) 
                  ? 'border-primary bg-primary/10 scale-[1.02] shadow-xl' 
                  : 'border-white/5 bg-slate-900/40 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${
                  activeId === String(p.id || `p${idx}`) ? 'bg-primary text-on-primary' : 'bg-slate-800 text-slate-500'
                }`}>OPCIÓN {idx + 1}</span>
                <span className="text-xs font-black text-indigo-400">{(p.score || 0).toFixed(1)}%</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1 truncate">{String(p.name || 'Ruta Académica')}</h4>
              <p className="text-[10px] text-slate-500 italic">{(p.items?.length || 0)} Materias</p>
            </button>
          )) : (
            <div className="w-full p-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/10 text-slate-500 italic">
              Haz click en "Optimizar Ahora" para generar rutas.
            </div>
          )}
        </div>
      </div>

      {/* DEBUG PANEL - TEMPORAL */}
      <div className="mt-10 p-6 bg-black/80 backdrop-blur-xl rounded-3xl border border-primary/50 overflow-auto max-h-[400px] shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-primary font-bold flex items-center gap-2">
            <span className="material-symbols-outlined">bug_report</span>
            DEBUG: ESTRUCTURA DEL BACKEND
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">Esto nos dirá por qué no se pinta</span>
        </div>
        <pre className="text-[10px] text-emerald-400 font-mono">
          {proposals.length > 0 ? JSON.stringify(proposals[0], null, 2) : "// Esperando datos del Backend..."}
        </pre>
      </div>

      {/* FLOATING ACTION BUTTON */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={handleGenerate}
          disabled={isLoading}
          className="flex items-center gap-4 px-8 h-16 bg-primary-container text-on-primary-container rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          <span className={`material-symbols-outlined text-2xl ${isLoading ? 'animate-spin' : ''}`}>autorenew</span>
          <span className="text-lg font-bold">Optimizar Ahora</span>
        </button>
      </div>
    </div>
  );
};

export default ScheduleManager;
