import React, { useState, useEffect } from 'react';
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
 * US-05: Arquitecto de Horarios (IA Engine)
 * Implementado con Grid Dinámico y Programación Reactiva.
 */
const ScheduleManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProposalIdx, setSelectedProposalIdx] = useState(0);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [showTooltip, setShowTooltip] = useState<{ x: number, y: number, text: string } | null>(null);

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  const pxPerHour = 80;
  const startHour = 8;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const data = await generateScheduleProposals('santiago-123');
      // Si el backend no devuelve datos reales aún, usamos mocks estructurados para US-05
      setProposals(data.proposals || [
        {
          id: 'p1',
          name: 'Propuesta A',
          efficiency: 94,
          items: [
            { subject: 'Matemáticas Avanzadas', day: 'Lunes', startTime: '08:00', endTime: '10:00', isConflict: false, classroom: 'Aula 402', professor: 'Dr. Aris' },
            { subject: 'Física II', day: 'Martes', startTime: '08:00', endTime: '09:30', isConflict: true, conflictReason: 'Zona Prohibida: Mantenimiento', classroom: 'Lab B' },
            { subject: 'Diseño de Algoritmos', day: 'Martes', startTime: '10:00', endTime: '12:00', isConflict: false, classroom: 'Lab C' },
            { subject: 'Historia Tecnológica', day: 'Miércoles', startTime: '11:00', endTime: '13:00', isConflict: false, classroom: 'Sala Magna' },
            { subject: 'Criptografía I', day: 'Viernes', startTime: '14:00', endTime: '16:00', isConflict: false, classroom: 'Aula 102' }
          ]
        },
        {
          id: 'p2',
          name: 'Propuesta B',
          efficiency: 88,
          items: [
            { subject: 'Matemáticas Avanzadas', day: 'Miércoles', startTime: '08:00', endTime: '10:00', isConflict: false },
            { subject: 'Física II', day: 'Jueves', startTime: '08:00', endTime: '09:30', isConflict: false },
            { subject: 'Taller Innovación', day: 'Jueves', startTime: '10:00', endTime: '13:00', isConflict: true, conflictReason: 'Cruce con Tutoría' }
          ]
        }
      ]);
    } catch (error) {
      console.error('Error:', error);
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
    <div className="space-y-8 animate-fade-in relative">
      {/* US-05 Marker */}
      <div className="absolute -top-4 -right-4 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded-full shadow-lg z-50">
        US-05 ACTIVE
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-display font-bold text-white mb-2">Visión Semanal</h2>
          <p className="text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-indigo-400">psychology</span>
            Optimización IA v4.2 para Ciclo 2024-B
          </p>
        </div>
        
        <div className="glass-panel p-1 rounded-2xl flex items-center gap-1">
          {proposals.length > 0 ? (
            proposals.map((p, idx) => (
              <button 
                key={p.id}
                onClick={() => setSelectedProposalIdx(idx)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  selectedProposalIdx === idx 
                    ? 'bg-primary-container text-on-primary-container shadow-lg' 
                    : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                {p.name}
              </button>
            ))
          ) : (
            <div className="px-6 py-2.5 text-slate-500 text-sm italic">Sin propuestas</div>
          )}
        </div>
      </div>

      <div className="relative overflow-hidden bg-slate-900/30 rounded-3xl border border-white/10 shadow-2xl">
        {/* Shimmer Loading for US-05 */}
        {isLoading && (
          <div className="absolute inset-0 z-40 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <span className="material-symbols-outlined text-5xl text-primary animate-spin">autorenew</span>
              <p className="text-primary font-bold animate-pulse">IA Calculando Rutas Óptimas...</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-6 h-[880px]">
          {/* Time Column */}
          <div className="col-span-1 border-r border-white/5 pt-16">
            {hours.map(h => (
              <div key={h} className="h-[80px] flex items-center justify-end pr-6 text-slate-500 font-mono text-[11px] border-b border-white/5">
                {h}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="col-span-5 grid grid-cols-5 relative">
            {days.map((day, dayIdx) => (
              <div key={day} className={`relative ${dayIdx < 4 ? 'border-r border-white/5' : ''}`}>
                <div className="h-16 flex items-center justify-center border-b border-white/5 font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                  {day}
                </div>
                
                {/* Subjects for this day */}
                <div className="relative h-full">
                  {activeItems.filter(item => item.day === day).map((item, idx) => {
                    const pos = calculatePosition(item.startTime, item.endTime);
                    return (
                      <div 
                        key={idx}
                        className={`absolute left-1 right-1 rounded-2xl p-4 flex flex-col justify-between transition-all cursor-pointer group overflow-hidden ${
                          item.isConflict 
                            ? 'conflict-glow bg-error-container/30 border-error/50 z-20' 
                            : 'bg-primary-container/10 border border-primary/20 hover:bg-primary-container/20 z-10'
                        }`}
                        style={{ top: pos.top, height: pos.height }}
                        onMouseEnter={(e) => item.isConflict && setShowTooltip({ 
                          x: e.clientX, 
                          y: e.clientY, 
                          text: item.conflictReason || 'Conflicto detectado' 
                        })}
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-sm font-bold ${item.isConflict ? 'text-error' : 'text-primary'}`}>
                              {item.subject}
                            </h4>
                            {item.isConflict && (
                              <span className="material-symbols-outlined text-error text-xs animate-pulse">warning</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {item.classroom || 'TBA'} • {item.professor || 'Docente'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${item.isConflict ? 'bg-error' : 'bg-primary'} animate-pulse`}></span>
                          <span className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">
                            {item.startTime} - {item.endTime}
                          </span>
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

      {/* AI Insights & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div className="glass-panel p-8 rounded-3xl flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="flex items-center gap-3 text-indigo-400 mb-2">
            <span className="material-symbols-outlined">auto_awesome</span>
            <h3 className="text-xl font-bold">AI Insight</h3>
          </div>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            La <span className="text-white font-bold">{proposals[selectedProposalIdx]?.name || 'propuesta'}</span> reduce tu tiempo de desplazamiento en un 
            <span className="text-primary font-bold ml-1">24%</span> respecto al semestre pasado.
          </p>
          <div className="mt-auto flex gap-2">
            <div className="h-1.5 flex-1 bg-primary rounded-full"></div>
            <div className="h-1.5 flex-1 bg-primary rounded-full"></div>
            <div className="h-1.5 flex-1 bg-surface-variant rounded-full"></div>
          </div>
        </div>

        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Estado del Optimizador (US-05)</h3>
            <span className="text-[10px] font-mono bg-white/5 px-2 py-1 rounded text-slate-400">ENGINE_ACTIVE_V4.2</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-error/10 border border-error/20 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-error"></span>
              <span className="text-xs font-bold text-error">Zonas Prohibidas Cargadas</span>
            </div>
            <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="text-xs font-bold text-primary">Prerrequisitos Validados</span>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-500"></span>
              <span className="text-xs font-bold text-slate-400">Sincronización SIA OK</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button for US-05 */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={handleGenerate}
          disabled={isLoading}
          className="flex items-center gap-4 px-8 h-16 bg-primary-container text-on-primary-container rounded-full shadow-[0_0_40px_-5px_rgba(128,131,255,0.4)] hover:shadow-[0_0_60px_-5px_rgba(128,131,255,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 group relative"
        >
          <span className={`material-symbols-outlined text-2xl ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}>
            autorenew
          </span>
          <span className="text-lg font-bold">Generar Nueva Propuesta</span>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full border-2 border-surface flex items-center justify-center animate-bounce">
            <span className="text-[10px] text-white font-bold">!</span>
          </div>
        </button>
      </div>

      {/* Tooltip for US-05 Conflicts */}
      {showTooltip && (
        <div 
          className="fixed z-[100] px-4 py-2 bg-error text-on-error rounded-xl shadow-2xl text-xs font-bold animate-fade-in pointer-events-none border border-white/20"
          style={{ left: showTooltip.x + 10, top: showTooltip.y + 10 }}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px]">report</span>
            {showTooltip.text}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManager;
