import React, { useState } from 'react';
import { generateScheduleProposals } from '../../services/api';

interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

interface Section {
  id: string;
  courseId: string;
  courseName: string;
  professor: string;
  campus: string;
  schedule: Schedule[];
}

interface SubjectItem {
  section: Section;
  isPinned: boolean;
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
  name?: string;
  score: number;
  scoreBreakdown?: ScoreBreakdown;
  items: SubjectItem[];
  totalCredits?: number;
  totalGaps?: number;
}

/**
 * US-05: Arquitecto de Horarios (Versión Final Corregida)
 * Ajustada al esquema Real del Backend: items[].section.schedule
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

  const calculatePosition = (startTime: string, endTime: string) => {
    const parse = (s: string) => {
      const parts = s.split(':');
      return { h: parseInt(parts[0]), m: parseInt(parts[1] || '0') };
    };
    const start = parse(startTime);
    const end = parse(endTime);
    const top = (start.h - startHour + start.m / 60) * pxPerHour;
    const height = ((end.h + end.m / 60) - (start.h + start.m / 60)) * pxPerHour;
    return { top, height };
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const data = await generateScheduleProposals('santiago-123');
      if (data && Array.isArray(data.proposals)) {
        setProposals(data.proposals);
        if (data.proposals.length > 0) setActiveId(data.proposals[0].id);
      }
    } catch (error) {
      console.error('Error US-05:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const propuestaActiva = proposals.find(p => p.id === activeId) || null;

  const renderizarMateriaEnCalendario = (dayName: string) => {
    if (!propuestaActiva) return null;
    const tDay = normalize(dayName);

    return propuestaActiva.items.flatMap((item, idx) => {
      const section = item.section;
      if (!section || !section.schedule) return [];

      return section.schedule
        .filter(s => normalize(s.day).startsWith(tDay.substring(0, 3)) || tDay.startsWith(normalize(s.day).substring(0, 3)))
        .map((slot, sIdx) => {
          const { top, height } = calculatePosition(slot.startTime, slot.endTime);
          const colorClass = getSubjectColor(section.courseName);

          return (
            <div 
              key={`${idx}-${sIdx}`}
              className={`absolute left-1 right-1 rounded-xl p-3 border-l-4 shadow-xl transition-all hover:scale-[1.03] z-20 bg-linear-to-br backdrop-blur-md ${colorClass}`}
              style={{ top: `${top}px`, height: `${height}px` }}
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h4 className="text-[10px] font-black uppercase leading-none mb-1 truncate">{section.courseName}</h4>
                  <p className="text-[8px] opacity-70 truncate">{section.professor}</p>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[9px] font-mono font-bold">{slot.startTime}</span>
                  <span className="text-[8px] bg-white/10 px-1 rounded uppercase">{section.campus}</span>
                </div>
              </div>
            </div>
          );
        });
    });
  };

  const renderScoreBreakdown = (breakdown: any) => {
    if (!breakdown || typeof breakdown !== 'object') return "Analizando propuesta...";
    const config: any = {
      creditScore: { label: 'Créditos', icon: 'school', color: 'text-indigo-400' },
      gapScore: { label: 'Huecos', icon: 'space_dashboard', color: 'text-emerald-400' },
      commuteScore: { label: 'Viaje', icon: 'commute', color: 'text-amber-400' },
      failedCourseScore: { label: 'Riesgo', icon: 'warning', color: 'text-rose-400' },
      zoneScore: { label: 'Zona', icon: 'map', color: 'text-cyan-400' }
    };

    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
        {Object.entries(breakdown).map(([key, value]) => {
          const meta = config[key];
          if (!meta) return null;
          return (
            <div key={key} className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-[14px] ${meta.color}`}>{meta.icon}</span>
              <span className="text-slate-400 text-[9px] uppercase font-bold">{meta.label}:</span>
              <span className="text-white font-bold text-[10px]">{(Number(value)).toFixed(0)}%</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in relative pb-20">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-display font-black text-white mb-2 tracking-tight">Arquitecto IA [US-05]</h2>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/20 font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Motor Optimizado
            </span>
            <span className="text-on-surface-variant text-sm">Santiago Parra • Ingeniería</span>
          </div>
        </div>

        {propuestaActiva && (
          <div className="glass-panel p-5 rounded-2xl border-primary/30 bg-primary/5 max-w-lg animate-slide-up shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-lg">psychology</span>
              <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">AI Performance Insights</h4>
            </div>
            {renderScoreBreakdown(propuestaActiva.scoreBreakdown)}
          </div>
        )}
      </div>

      {/* Scheduler Grid */}
      <div className="relative overflow-hidden bg-slate-900/40 rounded-[2rem] border border-white/10 shadow-3xl">
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-primary font-bold animate-pulse uppercase tracking-widest text-xs">Calculando rutas óptimas...</p>
          </div>
        )}

        <div className="grid grid-cols-8 h-[1520px] overflow-y-auto custom-scrollbar relative">
          {/* Timeline */}
          <div className="col-span-1 border-r border-white/5 bg-slate-950/40 sticky left-0 z-40 backdrop-blur-md">
            <div className="h-16 border-b border-white/5"></div>
            {hours.map(h => (
              <div key={h} className="h-[80px] flex items-center justify-end pr-4 text-slate-600 font-mono text-[10px] border-b border-white/5 font-bold uppercase">{h}</div>
            ))}
          </div>

          {/* Days Columns */}
          <div className="col-span-7 grid grid-cols-7 h-full">
            {days.map((day, dayIdx) => (
              <div key={day} className={`relative h-full ${dayIdx < 6 ? 'border-r border-white/5' : ''}`}>
                <div className="h-16 flex items-center justify-center border-b border-white/5 font-black text-slate-400 uppercase tracking-[0.2em] text-[10px] bg-slate-950/20 sticky top-0 z-30 backdrop-blur-md">{day}</div>
                <div className="relative w-full h-[1440px]">
                  {renderizarMateriaEnCalendario(day)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Proposals Drawer */}
      <div className="mt-8 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-indigo-400">layers</span>
          Propuestas Generadas por la IA
        </h3>
        
        <div className="flex gap-5 overflow-x-auto pb-8 custom-scrollbar">
          {proposals.length > 0 ? proposals.map((p, idx) => (
            <button 
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className={`shrink-0 min-w-[240px] p-6 rounded-3xl transition-all duration-500 text-left border-2 group ${
                activeId === p.id 
                  ? 'border-primary bg-primary/10 scale-[1.02] shadow-2xl shadow-primary/20' 
                  : 'border-white/5 bg-slate-950/40 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-center mb-5">
                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                  activeId === p.id ? 'bg-primary text-on-primary' : 'bg-slate-800 text-slate-400'
                }`}>Opción {idx + 1}</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-indigo-400 text-sm">bolt</span>
                  <span className="text-sm font-black text-white">{(p.score).toFixed(1)}%</span>
                </div>
              </div>
              <h4 className="text-white font-bold mb-2 group-hover:text-primary transition-colors">Horario de {p.totalCredits} Créditos</h4>
              <div className="flex gap-3 text-[10px] text-slate-500 font-medium">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">calendar_today</span> {p.items.length} Materias</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">format_list_numbered</span> {p.totalGaps} Huecos</span>
              </div>
            </button>
          )) : (
            <div className="w-full p-12 text-center bg-white/5 rounded-[2rem] border-2 border-dashed border-white/10 text-slate-500 italic flex flex-col items-center gap-4">
              <span className="material-symbols-outlined text-4xl opacity-20">inventory_2</span>
              Haz click en "Optimizar Ahora" para que la IA diseñe tu semestre ideal.
            </div>
          )}
        </div>
      </div>

      {/* Floating Optimization Button */}
      <div className="fixed bottom-10 right-10 z-50">
        <button 
          onClick={handleGenerate}
          disabled={isLoading}
          className="flex items-center gap-4 px-10 h-20 bg-primary-container text-on-primary-container rounded-full shadow-[0_20px_50px_rgba(99,102,241,0.3)] hover:scale-105 active:scale-95 transition-all group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <span className={`material-symbols-outlined text-3xl relative z-10 ${isLoading ? 'animate-spin' : ''}`}>
            {isLoading ? 'autorenew' : 'bolt'}
          </span>
          <span className="text-xl font-black uppercase tracking-tighter relative z-10">Optimizar Ahora</span>
        </button>
      </div>
    </div>
  );
};

export default ScheduleManager;
