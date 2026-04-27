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
  items: SubjectItem[];
}

/**
 * US-05: Arquitecto de Horarios (Versión Refactorizada con Colores)
 */
const ScheduleManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [propuestaActiva, setPropuestaActiva] = useState<Proposal | null>(null);
  const [showTooltip, setShowTooltip] = useState<{ x: number, y: number, text: string } | null>(null);

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const hours = [
    '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', 
    '21:00', '22:00', '23:00', '00:00'
  ];
  const pxPerHour = 80;
  const startHour = 5;

  // Paleta de colores Premium
  const getSubjectColor = (name: string) => {
    const colors = [
      'from-indigo-500/20 to-indigo-600/10 border-indigo-500/40 text-indigo-400',
      'from-emerald-500/20 to-emerald-600/10 border-emerald-500/40 text-emerald-400',
      'from-amber-500/20 to-amber-600/10 border-amber-500/40 text-amber-400',
      'from-rose-500/20 to-rose-600/10 border-rose-500/40 text-rose-400',
      'from-violet-500/20 to-violet-600/10 border-violet-500/40 text-violet-400',
      'from-cyan-500/20 to-cyan-600/10 border-cyan-500/40 text-cyan-400',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const normalize = (text: string) => {
    return text.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const data = await generateScheduleProposals('santiago-123');
      if (data && Array.isArray(data.proposals)) {
        setProposals(data.proposals);
        setPropuestaActiva(data.proposals[0]); // Seleccionamos la primera por defecto
      }
    } catch (error) {
      console.error('Error en US-05:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePosition = (startTime?: string, endTime?: string) => {
    if (!startTime || !endTime || !startTime.includes(':')) return { top: '0px', height: '0px' };
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const top = (startH - startHour + (startM || 0) / 60) * pxPerHour;
    const height = (endH - startH + ((endM || 0) - (startM || 0)) / 60) * pxPerHour;
    return { top: `${top}px`, height: `${height}px` };
  };

  const renderScheduleBlocks = (day: string) => {
    if (!propuestaActiva || !propuestaActiva.items) return null;
    const targetDay = normalize(day);

    return propuestaActiva.items.flatMap((subject) => {
      if (!subject.schedule) return [];
      const colorStyles = getSubjectColor(subject.name);
      
      return subject.schedule
        .filter((s) => {
          const sDay = normalize(s.day || '');
          return sDay === targetDay || 
                 (sDay === 'lu' && targetDay === 'lunes') ||
                 (sDay === 'ma' && targetDay === 'martes') ||
                 (sDay === 'mi' && targetDay === 'miercoles') ||
                 (sDay === 'ju' && targetDay === 'jueves') ||
                 (sDay === 'vi' && targetDay === 'viernes');
        })
        .map((s, sIdx) => {
          const pos = calculatePosition(s.startTime, s.endTime);
          return (
            <div 
              key={`${subject.name}-${sIdx}`}
              className={`absolute left-1 right-1 rounded-xl p-3 flex flex-col justify-between transition-all duration-300 shadow-lg border-l-4 bg-gradient-to-br ${
                subject.isConflict 
                  ? 'bg-error/20 border-error text-error z-20' 
                  : `${colorStyles} z-10 hover:scale-[1.02] hover:brightness-110`
              }`}
              style={{ top: pos.top, height: pos.height }}
              onMouseEnter={(e) => subject.isConflict && setShowTooltip({ 
                x: e.clientX, 
                y: e.clientY, 
                text: subject.conflictReason || 'Conflicto SAP' 
              })}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <div className="overflow-hidden">
                <h4 className="text-[10px] font-black leading-tight uppercase truncate">
                  {subject.name}
                </h4>
                <p className="text-[8px] opacity-70 mt-1 truncate">
                  {subject.classroom || 'SAP SERGIO'}
                </p>
              </div>
              <div className="text-[9px] font-mono font-bold opacity-80">
                {s.startTime} - {s.endTime}
              </div>
            </div>
          );
        });
    });
  };

  return (
    <div className="space-y-8 animate-fade-in relative pb-10">
      <div className="mb-8">
        <h2 className="text-4xl font-display font-black text-white mb-2 tracking-tight">Arquitecto IA [US-05]</h2>
        <p className="text-on-surface-variant flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-indigo-400">palette</span>
          Mapeo de Colores Dinámico | Universidad Sergio Arboleda
        </p>
      </div>

      {/* Grid Calendario */}
      <div className="relative overflow-hidden bg-slate-900/40 rounded-3xl border border-white/10 shadow-2xl">
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-primary animate-spin">psychology</span>
          </div>
        )}

        <div className="grid grid-cols-8 h-[1520px]">
          <div className="col-span-1 border-r border-white/5 pt-16">
            {hours.map(h => (
              <div key={h} className="h-[80px] flex items-center justify-end pr-4 text-slate-600 font-mono text-[10px] border-b border-white/5">{h}</div>
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

      {/* Propuestas Clickables */}
      <div className="mt-12 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-indigo-400">auto_awesome_motion</span>
          Selecciona una Propuesta
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {proposals.map((p, idx) => (
            <button 
              key={p.id || idx}
              onClick={() => setPropuestaActiva(p)}
              className={`p-5 rounded-2xl transition-all duration-300 text-left border-2 ${
                propuestaActiva?.id === p.id || propuestaActiva?.name === p.name
                  ? 'border-primary bg-primary/10 scale-[1.02] shadow-2xl shadow-primary/10' 
                  : 'border-white/5 bg-slate-900/40 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                  propuestaActiva?.id === p.id ? 'bg-primary text-on-primary' : 'bg-slate-800 text-slate-500'
                }`}>OPCIÓN {idx + 1}</span>
                <span className="text-sm font-black text-indigo-400">{p.score ? `${p.score.toFixed(1)}%` : '0%'}</span>
              </div>
              <h4 className={`text-sm font-bold mb-1 truncate ${propuestaActiva?.id === p.id ? 'text-white' : 'text-slate-400'}`}>{p.name || `Ruta SAP ${idx + 1}`}</h4>
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">calendar_view_week</span>
                {p.items?.length || 0} materias
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Botón Flotante */}
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

      {showTooltip && (
        <div 
          className="fixed z-[100] px-4 py-2 bg-error text-on-error rounded-xl shadow-2xl text-[10px] font-bold border border-white/20"
          style={{ left: showTooltip.x + 15, top: showTooltip.y + 15 }}
        >
          {showTooltip.text}
        </div>
      )}
    </div>
  );
};

export default ScheduleManager;
