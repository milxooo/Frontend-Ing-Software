import React, { useState } from 'react';
import { generateScheduleProposals } from '../../services/api';

interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

interface SubjectItem {
  name: string;
  schedule: Schedule[];
  isConflict: boolean;
  professor?: string;
  classroom?: string;
  conflictReason?: string;
}

interface Proposal {
  id: string;
  name: string;
  score: number;
  items: SubjectItem[];
}

/**
 * US-05: Arquitecto de Horarios (Motor de Renderizado Profundo)
 * Procesa schedules anidados y muestra scores reales del backend.
 */
const ScheduleManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProposalIdx, setSelectedProposalIdx] = useState(0);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [showTooltip, setShowTooltip] = useState<{ x: number, y: number, text: string } | null>(null);

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const hours = [
    '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', 
    '21:00', '22:00', '23:00', '00:00'
  ];
  const pxPerHour = 80;
  const startHour = 5;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const data = await generateScheduleProposals('santiago-123');
      if (data && data.proposals) {
        setProposals(data.proposals);
        setSelectedProposalIdx(0);
      }
    } catch (error) {
      console.error('Error en US-05:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePosition = (startTime: string, endTime: string) => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    
    const top = (startH - startHour + startM / 60) * pxPerHour;
    const height = (endH - startH + (endM - startM) / 60) * pxPerHour;
    
    return { top: `${top}px`, height: `${height}px` };
  };

  // Función para aplanar los horarios y pintarlos en el grid
  const renderScheduleBlocks = (day: string) => {
    const activeProposal = proposals[selectedProposalIdx];
    if (!activeProposal) return null;

    return activeProposal.items.flatMap((subject) => 
      subject.schedule
        .filter((s) => s.day === day)
        .map((s, sIdx) => {
          const pos = calculatePosition(s.startTime, s.endTime);
          return (
            <div 
              key={`${subject.name}-${sIdx}`}
              className={`absolute left-1 right-1 rounded-xl p-3 flex flex-col justify-between transition-all cursor-pointer overflow-hidden group shadow-lg ${
                subject.isConflict 
                  ? 'conflict-glow bg-error/20 border-error/50 z-20' 
                  : 'bg-primary/10 border border-primary/20 hover:bg-primary/25 z-10'
              }`}
              style={{ top: pos.top, height: pos.height }}
              onMouseEnter={(e) => subject.isConflict && setShowTooltip({ 
                x: e.clientX, 
                y: e.clientY, 
                text: subject.conflictReason || 'Conflicto de Horario' 
              })}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <div>
                <h4 className={`text-[11px] font-bold leading-tight truncate ${subject.isConflict ? 'text-error' : 'text-primary'}`}>
                  {subject.name}
                </h4>
                <p className="text-[9px] text-slate-500 mt-1 truncate">
                  {subject.classroom || 'Sergio Arboleda - SAP'}
                </p>
              </div>
              <div className="text-[9px] text-slate-400 font-mono font-bold">
                {s.startTime} - {s.endTime}
              </div>
            </div>
          );
        })
    );
  };

  return (
    <div className="space-y-8 animate-fade-in relative pb-10">
      <div className="mb-8">
        <h2 className="text-4xl font-display font-black text-white mb-2 tracking-tight">Arquitecto IA [US-05]</h2>
        <p className="text-on-surface-variant flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-indigo-400">query_stats</span>
          Motor de Optimización SAP Activo | Rango: 05:00 - 00:00
        </p>
      </div>

      {/* Grid del Calendario */}
      <div className="relative overflow-hidden bg-slate-900/40 rounded-3xl border border-white/10 shadow-2xl">
        {isLoading && (
          <div className="absolute inset-0 z-40 bg-slate-950/70 backdrop-blur-md flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <span className="material-symbols-outlined text-5xl text-primary animate-spin">psychology</span>
              <p className="text-primary font-bold animate-pulse">Optimizando tu tiempo...</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-8 h-[1520px]">
          {/* Time Column */}
          <div className="col-span-1 border-r border-white/5 pt-16">
            {hours.map(h => (
              <div key={h} className="h-[80px] flex items-center justify-end pr-4 text-slate-600 font-mono text-[10px] border-b border-white/5">
                {h}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="col-span-7 grid grid-cols-7 relative">
            {days.map((day, dayIdx) => (
              <div key={day} className={`relative ${dayIdx < 6 ? 'border-r border-white/5' : ''}`}>
                <div className="h-16 flex items-center justify-center border-b border-white/5 font-bold text-slate-500 uppercase tracking-widest text-[9px]">
                  {day}
                </div>
                <div className="relative h-full">
                  {renderScheduleBlocks(day)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* US-05: Selector de Propuestas (Cards Limpias sin "coso gris") */}
      <div className="mt-12 space-y-6 relative z-10">
        <div className="flex justify-between items-end">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-indigo-400">layers</span>
            Propuestas Generadas
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">BACKEND_SCORE_PROTOCOL_V1</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {proposals.length > 0 ? (
            proposals.map((p, idx) => (
              <button 
                key={p.id || idx}
                onClick={() => setSelectedProposalIdx(idx)}
                className={`p-5 rounded-2xl transition-all duration-300 text-left border-2 group relative overflow-hidden ${
                  selectedProposalIdx === idx 
                    ? 'border-primary bg-primary/10 scale-[1.02] shadow-2xl shadow-primary/10' 
                    : 'border-white/5 bg-slate-900/40 hover:bg-slate-900 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                    selectedProposalIdx === idx ? 'bg-primary text-on-primary' : 'bg-slate-800 text-slate-500'
                  }`}>
                    OPCIÓN {idx + 1}
                  </span>
                  <span className="text-sm font-black text-indigo-400">
                    {p.score ? `${p.score.toFixed(1)}%` : '0%'}
                  </span>
                </div>
                <h4 className={`text-sm font-bold mb-1 truncate ${selectedProposalIdx === idx ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {p.name || `Propuesta SAP-${idx + 1}`}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                  <span className="material-symbols-outlined text-[14px]">school</span>
                  {p.items?.length || 0} materias registradas
                </div>
              </button>
            ))
          ) : (
            <div className="col-span-5 p-12 rounded-3xl text-center bg-slate-900/20 border-2 border-dashed border-white/5 flex flex-col items-center gap-4">
              <span className="material-symbols-outlined text-4xl text-slate-700">query_stats</span>
              <p className="text-slate-500 font-medium italic">Esperando órdenes del motor de IA...</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={handleGenerate}
          disabled={isLoading}
          className="flex items-center gap-4 px-8 h-16 bg-primary-container text-on-primary-container rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group overflow-hidden"
        >
          <span className={`material-symbols-outlined text-2xl ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}>
            autorenew
          </span>
          <span className="text-lg font-bold">Optimizar Ahora</span>
          <div className="absolute top-0 -left-full w-full h-full bg-white/10 skew-x-[-20deg] group-hover:left-[150%] transition-all duration-1000 ease-in-out"></div>
        </button>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div 
          className="fixed z-[100] px-4 py-2 bg-error text-on-error rounded-xl shadow-2xl text-[10px] font-bold animate-fade-in pointer-events-none border border-white/20"
          style={{ left: showTooltip.x + 15, top: showTooltip.y + 15 }}
        >
          ⚠️ {showTooltip.text}
        </div>
      )}
    </div>
  );
};

export default ScheduleManager;
