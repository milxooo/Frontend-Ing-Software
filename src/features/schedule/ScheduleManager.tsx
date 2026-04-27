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

interface Proposal {
  id: string;
  name: string;
  score: number;
  scoreBreakdown?: string;
  items: SubjectItem[];
}

/**
 * US-05: Arquitecto de Horarios (Versión Ultra-Estable)
 * Diseñada para sobrevivir a cualquier malformación de datos del Backend.
 */
const ScheduleManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const hours = [
    '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', 
    '21:00', '22:00', '23:00', '00:00'
  ];
  const pxPerHour = 80;
  const startHour = 5;

  const normalize = (text: string) => {
    if (!text) return "";
    return text.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const getSubjectColor = (name: string) => {
    const colors = [
      'from-indigo-500/20 to-indigo-600/10 border-indigo-500/40 text-indigo-400',
      'from-emerald-500/20 to-emerald-600/10 border-emerald-500/40 text-emerald-400',
      'from-amber-500/20 to-amber-600/10 border-amber-500/40 text-amber-400',
      'from-rose-500/20 to-rose-600/10 border-rose-500/40 text-rose-400',
      'from-violet-500/20 to-violet-600/10 border-violet-500/40 text-violet-400',
    ];
    let hash = 0;
    const sName = name || 'Materia';
    for (let i = 0; i < sName.length; i++) hash = sName.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const calculatePosition = (startTime?: string, endTime?: string) => {
    if (!startTime || !endTime || !startTime.includes(':')) return { top: '0px', height: '0px' };
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const top = (startH - startHour + (startM || 0) / 60) * pxPerHour;
    const height = (endH - startH + ((endM || 0) - (startM || 0)) / 60) * pxPerHour;
    return { top: `${top}px`, height: `${height}px` };
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const data = await generateScheduleProposals('santiago-123');
      if (data && Array.isArray(data.proposals) && data.proposals.length > 0) {
        setProposals(data.proposals);
        setActiveId(data.proposals[0].id || 'p0');
      }
    } catch (error) {
      console.error('Error Fatal US-05:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const propuestaActiva = proposals.find(p => (p.id || 'p0') === activeId) || null;

  const renderScheduleBlocks = (day: string) => {
    if (!propuestaActiva || !Array.isArray(propuestaActiva.items)) return null;
    const targetDay = normalize(day);

    return propuestaActiva.items.map((subject, idx) => {
      if (!subject.schedule || !Array.isArray(subject.schedule)) return null;
      const colorStyles = getSubjectColor(subject.name);
      
      return (
        <React.Fragment key={`${subject.name}-${idx}`}>
          {subject.schedule
            .filter((s) => normalize(s.day || '') === targetDay)
            .map((s, sIdx) => {
              const pos = calculatePosition(s.startTime, s.endTime);
              if (pos.height === '0px') return null;
              return (
                <div 
                  key={sIdx}
                  className={`absolute left-1 right-1 rounded-xl p-2 flex flex-col justify-between transition-all shadow-lg border-l-4 bg-linear-to-br ${
                    subject.isConflict ? 'bg-error/20 border-error text-error z-20' : `${colorStyles} z-10`
                  }`}
                  style={{ top: pos.top, height: pos.height }}
                >
                  <h4 className="text-[9px] font-black uppercase truncate">{subject.name || 'S/N'}</h4>
                  <div className="text-[8px] font-mono font-bold opacity-80">{s.startTime}</div>
                </div>
              );
            })}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="space-y-8 animate-fade-in relative pb-20 max-w-full overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-display font-black text-white mb-2 tracking-tight">Arquitecto IA [US-05]</h2>
          <p className="text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-indigo-400">security</span>
            Malla Horaria Sergio Arboleda | Protocolo Seguro
          </p>
        </div>

        {propuestaActiva && (
          <div className="glass-panel p-4 rounded-2xl border-primary/30 bg-primary/5 max-w-md">
            <h4 className="text-[10px] font-bold text-primary uppercase mb-1">AI Insights</h4>
            <p className="text-xs text-slate-200 italic">
              "{propuestaActiva.scoreBreakdown || `Optimización lograda al ${(propuestaActiva.score || 0).toFixed(1)}%`}"
            </p>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden bg-slate-900/40 rounded-3xl border border-white/10 shadow-2xl min-h-[500px]">
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-primary animate-spin">psychology</span>
          </div>
        )}

        <div className="grid grid-cols-8 h-[1520px] overflow-y-auto">
          <div className="col-span-1 border-r border-white/5 pt-16">
            {hours.map(h => (
              <div key={h} className="h-[80px] flex items-center justify-end pr-4 text-slate-600 font-mono text-[9px] border-b border-white/5">{h}</div>
            ))}
          </div>

          <div className="col-span-7 grid grid-cols-7 relative">
            {days.map((day, dayIdx) => (
              <div key={day} className={`relative ${dayIdx < 6 ? 'border-r border-white/5' : ''}`}>
                <div className="h-16 flex items-center justify-center border-b border-white/5 font-bold text-slate-500 uppercase tracking-widest text-[9px]">{day}</div>
                <div className="relative h-full">
                  {renderScheduleBlocks(day)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-indigo-400">sort</span>
          Propuestas del SAP
        </h3>
        
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {proposals.map((p, idx) => (
            <button 
              key={p.id || idx}
              onClick={() => setActiveId(p.id || `p${idx}`)}
              className={`shrink-0 min-w-[180px] p-4 rounded-2xl transition-all duration-300 text-left border-2 ${
                activeId === (p.id || `p${idx}`) 
                  ? 'border-primary bg-primary/10 scale-[1.02]' 
                  : 'border-white/5 bg-slate-900/40 hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${
                  activeId === (p.id || `p${idx}`) ? 'bg-primary text-on-primary' : 'bg-slate-800 text-slate-500'
                }`}>OPC {idx + 1}</span>
                <span className="text-xs font-black text-indigo-400">{(p.score || 0).toFixed(1)}%</span>
              </div>
              <h4 className="text-xs font-bold text-white mb-1 truncate">{p.name || 'Opción'}</h4>
              <p className="text-[10px] text-slate-500 italic">{(p.items?.length || 0)} Materias</p>
            </button>
          ))}
        </div>
      </div>

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
