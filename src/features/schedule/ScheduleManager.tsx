import React, { useState } from 'react';
import { generateScheduleProposals } from '../../services/api';

interface ScheduleItem {
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
  isConflict: boolean;
  professor?: string;
  classroom?: string;
  conflictReason?: string;
}

interface Proposal {
  id: string;
  name: string;
  efficiency: number;
  items: ScheduleItem[];
}

/**
 * US-05: Arquitecto de Horarios
 * Grid de 05:00 a 00:00, 7 días, con propuestas en la parte inferior.
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
      // US-05: Llamada al endpoint POST /api/schedules/generate
      const data = await generateScheduleProposals('santiago-123');
      if (data && data.proposals) {
        setProposals(data.proposals);
        setSelectedProposalIdx(0);
      }
    } catch (error) {
      console.error('Error en US-05:', error);
      alert('Error conectando con el motor de IA. Revisa el Backend.');
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

  const activeItems = proposals[selectedProposalIdx]?.items || [];

  return (
    <div className="space-y-8 animate-fade-in relative pb-20">
      {/* Header Info */}
      <div className="mb-8">
        <h2 className="text-4xl font-display font-black text-white mb-2 tracking-tight">Arquitecto IA [US-05]</h2>
        <p className="text-on-surface-variant flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-indigo-400">explore</span>
          Rango Extendido: 05:00 - 00:00 | Lunes a Domingo
        </p>
      </div>

      {/* Main Grid Container */}
      <div className="relative overflow-hidden bg-slate-900/30 rounded-3xl border border-white/10 shadow-2xl">
        {isLoading && (
          <div className="absolute inset-0 z-40 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <span className="material-symbols-outlined text-5xl text-primary animate-spin">psychology</span>
              <p className="text-primary font-bold animate-pulse">Calculando Rutas Óptimas...</p>
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
                  {activeItems.filter(item => item.day === day).map((item, idx) => {
                    const pos = calculatePosition(item.startTime, item.endTime);
                    return (
                      <div 
                        key={idx}
                        className={`absolute left-1 right-1 rounded-xl p-3 flex flex-col justify-between transition-all cursor-pointer overflow-hidden ${
                          item.isConflict 
                            ? 'conflict-glow bg-error/20 border-error/50 z-20' 
                            : 'bg-primary/10 border border-primary/20 hover:bg-primary/20 z-10'
                        }`}
                        style={{ top: pos.top, height: pos.height }}
                        onMouseEnter={(e) => item.isConflict && setShowTooltip({ 
                          x: e.clientX, 
                          y: e.clientY, 
                          text: item.conflictReason || 'Zona Prohibida Detectada' 
                        })}
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        <div>
                          <h4 className={`text-[11px] font-bold leading-tight ${item.isConflict ? 'text-error' : 'text-primary'}`}>
                            {item.subject}
                          </h4>
                          <p className="text-[9px] text-slate-500 mt-1 truncate">
                            {item.classroom || 'TBA'}
                          </p>
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono">
                          {item.startTime}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* US-05: Propuestas Clickables DEBAJO del Calendario */}
      <div className="mt-12 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-400">hub</span>
          Propuestas del Optimizador
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {proposals.length > 0 ? (
            proposals.map((p, idx) => (
              <button 
                key={p.id || idx}
                onClick={() => setSelectedProposalIdx(idx)}
                className={`glass-panel p-4 rounded-2xl transition-all duration-300 text-left border-2 group ${
                  selectedProposalIdx === idx 
                    ? 'border-primary bg-primary/10 scale-[1.02] shadow-lg shadow-primary/10' 
                    : 'border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    selectedProposalIdx === idx ? 'bg-primary text-on-primary' : 'bg-slate-800 text-slate-500'
                  }`}>
                    OPCIÓN {idx + 1}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-400">{p.efficiency}%</span>
                </div>
                <h4 className={`text-sm font-bold mb-1 ${selectedProposalIdx === idx ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {p.name || `Ruta IA v${idx + 1}`}
                </h4>
                <div className="flex items-center gap-1 text-[9px] text-slate-500">
                  <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                  {p.items?.length || 0} materias
                </div>
              </button>
            ))
          ) : (
            <div className="col-span-5 glass-panel p-10 rounded-3xl text-center opacity-40 border-dashed border-2 border-white/10">
              <span className="material-symbols-outlined text-4xl mb-2">smart_toy</span>
              <p className="text-sm">No hay propuestas generadas. Usa el botón flotante para empezar.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button for Generation */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={handleGenerate}
          disabled={isLoading}
          className="flex items-center gap-4 px-8 h-16 bg-primary-container text-on-primary-container rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group overflow-hidden"
        >
          <span className={`material-symbols-outlined text-2xl ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}>
            autorenew
          </span>
          <span className="text-lg font-bold">Generar Nueva Propuesta</span>
          <div className="absolute top-0 -left-full w-full h-full bg-white/20 skew-x-[-20deg] group-hover:left-[150%] transition-all duration-1000 ease-in-out"></div>
        </button>
      </div>

      {/* Conflict Tooltip */}
      {showTooltip && (
        <div 
          className="fixed z-[100] px-4 py-2 bg-error text-on-error rounded-xl shadow-2xl text-xs font-bold animate-fade-in pointer-events-none"
          style={{ left: showTooltip.x + 15, top: showTooltip.y + 15 }}
        >
          {showTooltip.text}
        </div>
      )}
    </div>
  );
};

export default ScheduleManager;
