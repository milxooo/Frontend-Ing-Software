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
      'bg-indigo-600 border-indigo-400 text-white',
      'bg-emerald-600 border-emerald-400 text-white',
      'bg-amber-600 border-amber-400 text-white',
      'bg-rose-600 border-rose-400 text-white',
      'bg-violet-600 border-violet-400 text-white',
    ];
    let hash = 0;
    const sName = String(name || 'Materia');
    for (let i = 0; i < sName.length; i++) hash = sName.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const parseTime = (timeStr: any) => {
    if (!timeStr) return null;
    const s = String(timeStr);
    if (!s.includes(':')) {
      const h = parseInt(s);
      return isNaN(h) ? null : { h, m: 0 };
    }
    const parts = s.split(':');
    const h = parseInt(parts[0]);
    const m = parseInt(parts[1] || '0');
    return isNaN(h) ? null : { h, m };
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const data = await generateScheduleProposals('santiago-123');
      if (data && Array.isArray(data.proposals)) {
        setProposals(data.proposals);
        if (data.proposals.length > 0) setActiveId(String(data.proposals[0].id || 'p0'));
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const propuestaActiva = proposals.find(p => String(p.id || 'p0') === activeId) || null;

  const renderizarMateriaEnCalendario = (dayName: string) => {
    if (!propuestaActiva || !propuestaActiva.items) return null;
    const targetDay = normalize(dayName);
    
    return propuestaActiva.items.flatMap((subject, sIdx) => {
      const slots = Array.isArray(subject.schedule) ? subject.schedule : [];
      return slots.map((slot, slotIdx) => {
        if (normalize(slot.day) !== targetDay) return null;

        const start = parseTime(slot.startTime);
        const end = parseTime(slot.endTime);
        if (!start || !end) return null;

        const topPos = (start.h - startHour + start.m / 60) * pxPerHour;
        const durationHours = (end.h + end.m / 60) - (start.h + start.m / 60);
        const heightPos = durationHours * pxPerHour;

        const colorClass = getSubjectColor(subject.name);

        return (
          <div 
            key={`${sIdx}-${slotIdx}`}
            className={`absolute left-1 right-1 rounded-lg p-2 border-l-4 shadow-2xl z-50 transition-transform hover:scale-105 ${colorClass}`}
            style={{ top: `${topPos}px`, height: `${Math.max(heightPos, 40)}px` }}
          >
            <div className="flex flex-col h-full justify-between overflow-hidden">
              <div className="space-y-0.5">
                <h4 className="text-[10px] font-black uppercase leading-none truncate">{subject.name}</h4>
                <p className="text-[8px] opacity-80 truncate">{subject.professor}</p>
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono font-bold border-t border-white/10 mt-1 pt-1">
                <span>{slot.startTime}</span>
                <span className="opacity-60">{subject.classroom}</span>
              </div>
            </div>
          </div>
        );
      });
    });
  };

  const renderScoreBreakdown = (breakdown: any) => {
    if (!breakdown) return "Analizando...";
    if (typeof breakdown === 'object') {
      return (
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2">
          {Object.entries(breakdown).map(([key, val]: [string, any]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px] text-primary">analytics</span>
              <span className="text-slate-400 text-[10px] capitalize">{key.replace('Score', '')}:</span>
              <span className="text-white font-bold">{typeof val === 'number' ? val.toFixed(1) : String(val)}</span>
            </div>
          ))}
        </div>
      );
    }
    return String(breakdown);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter">Arquitecto IA [US-05]</h2>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-400">shield</span>
            Motor SAP Sergio Arboleda | v2.6
          </p>
        </div>

        {propuestaActiva && (
          <div className="glass-panel p-4 rounded-2xl border-primary/20 bg-primary/5 min-w-[300px]">
            <h4 className="text-[10px] font-bold text-primary uppercase mb-1">AI Score Breakdown</h4>
            <div className="text-[11px] text-slate-200">
              {renderScoreBreakdown(propuestaActiva.scoreBreakdown)}
            </div>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden bg-slate-900/50 rounded-[2rem] border border-white/5 shadow-2xl">
        {isLoading && (
          <div className="absolute inset-0 z-[60] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center space-y-4">
              <span className="material-symbols-outlined text-6xl text-primary animate-spin">autorenew</span>
              <p className="text-primary font-black uppercase tracking-widest text-xs">Optimizando Horario...</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-8 h-[1520px] overflow-y-auto">
          <div className="col-span-1 border-r border-white/5 pt-16 bg-slate-950/40">
            {hours.map(h => (
              <div key={h} className="h-[80px] flex items-center justify-end pr-4 text-slate-700 font-mono text-[10px] border-b border-white/5">{h}</div>
            ))}
          </div>

          <div className="col-span-7 grid grid-cols-7 relative">
            {days.map((day) => (
              <div key={day} className="relative flex flex-col border-r border-white/5 min-h-[1520px]">
                <div className="h-16 flex items-center justify-center border-b border-white/5 font-black text-slate-500 uppercase tracking-widest text-[10px] bg-slate-950/60 sticky top-0 z-40 backdrop-blur-md">{day}</div>
                <div className="relative flex-1">
                  {renderizarMateriaEnCalendario(day)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-indigo-400">dashboard_customize</span>
          Opciones Generadas
        </h3>
        
        <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar">
          {proposals.map((p, idx) => (
            <button 
              key={String(p.id || idx)}
              onClick={() => setActiveId(String(p.id || `p${idx}`))}
              className={`shrink-0 min-w-[240px] p-6 rounded-[2rem] transition-all duration-300 text-left border-2 ${
                activeId === String(p.id || `p${idx}`) 
                  ? 'border-primary bg-primary/10 shadow-2xl shadow-primary/20' 
                  : 'border-white/5 bg-slate-900/60 hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <span className={`text-[9px] font-black px-3 py-1 rounded-full ${
                  activeId === String(p.id || `p${idx}`) ? 'bg-primary text-on-primary' : 'bg-white/5 text-slate-500'
                }`}>OPCIÓN {idx + 1}</span>
                <span className="text-xl font-black text-white">{(p.score || 0).toFixed(1)}%</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2 truncate">{p.name || 'Ruta Académica'}</h4>
              <div className="text-[10px] text-slate-500 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">auto_stories</span>
                {p.items?.length || 0} Materias
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-[70]">
        <button 
          onClick={handleGenerate}
          disabled={isLoading}
          className="flex items-center gap-4 px-10 h-20 bg-primary text-white rounded-full shadow-[0_20px_50px_rgba(71,75,255,0.4)] hover:scale-105 active:scale-95 transition-all font-black text-xl"
        >
          <span className={`material-symbols-outlined text-3xl ${isLoading ? 'animate-spin' : ''}`}>autorenew</span>
          Optimizar Ahora
        </button>
      </div>
    </div>
  );
};

export default ScheduleManager;
