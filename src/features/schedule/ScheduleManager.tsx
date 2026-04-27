import React, { useState } from 'react';
import { generateScheduleProposals } from '../../services/api';

interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

interface SubjectItem {
  name: string;
  day?: string;
  startTime?: string;
  endTime?: string;
  schedule?: Schedule[];
  professor?: string;
  classroom?: string;
}

interface Proposal {
  id: string;
  name: string;
  score: number;
  scoreBreakdown?: any;
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
    const colors = ['bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600', 'bg-violet-600'];
    let hash = 0;
    const sName = String(name || 'Materia');
    for (let i = 0; i < sName.length; i++) hash = sName.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const parseTime = (timeStr: any) => {
    if (!timeStr) return null;
    const s = String(timeStr);
    const parts = s.includes(':') ? s.split(':') : [s, '0'];
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
      // Caso 1: Los datos están directamente en el objeto (según ejemplo real del usuario)
      // Caso 2: Los datos están en un array "schedule"
      const slots: any[] = [];
      if (subject.day && subject.startTime && subject.endTime) {
        slots.push({ day: subject.day, startTime: subject.startTime, endTime: subject.endTime });
      }
      if (Array.isArray(subject.schedule)) {
        slots.push(...subject.schedule);
      }

      return slots.map((slot, slotIdx) => {
        if (normalize(slot.day) !== targetDay) return null;

        const start = parseTime(slot.startTime);
        const end = parseTime(slot.endTime);
        if (!start || !end) return null;

        const topPos = (start.h - startHour + start.m / 60) * pxPerHour;
        const duration = (end.h + end.m / 60) - (start.h + start.m / 60);
        const heightPos = duration * pxPerHour;

        const bgColor = getSubjectColor(subject.name);

        return (
          <div 
            key={`${sIdx}-${slotIdx}`}
            className={`absolute left-1 right-1 rounded-xl p-3 shadow-2xl z-50 border-2 border-white/20 text-white ${bgColor}`}
            style={{ top: `${topPos}px`, height: `${Math.max(heightPos, 40)}px` }}
          >
            <div className="flex flex-col h-full justify-between overflow-hidden">
              <h4 className="text-[10px] font-black uppercase leading-none truncate">{subject.name}</h4>
              <div className="flex justify-between items-center text-[9px] font-bold mt-1 pt-1 border-t border-white/10">
                <span>{slot.startTime}</span>
                <span className="opacity-80 truncate ml-2">{subject.classroom || 'Aula'}</span>
              </div>
            </div>
          </div>
        );
      });
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-3xl border border-white/5">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter">Arquitecto IA [US-05]</h2>
          <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mt-1">Sincronización SAP Activa</p>
        </div>

        {propuestaActiva && (
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 min-w-[300px]">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Análisis de Optimización</h4>
            <div className="grid grid-cols-2 gap-4 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="text-indigo-400 font-bold">Puntaje:</span>
                <span className="text-white">{(propuestaActiva.score || 0).toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">Clases:</span>
                <span className="text-white">{propuestaActiva.items?.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden bg-slate-950 rounded-[2.5rem] border border-white/10 shadow-3xl">
        {isLoading && (
          <div className="absolute inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-indigo-400 font-black uppercase tracking-widest text-xs">Calculando Rutas...</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-8 h-[1520px] overflow-y-auto">
          <div className="col-span-1 border-r border-white/5 pt-16">
            {hours.map(h => (
              <div key={h} className="h-[80px] flex items-center justify-end pr-4 text-slate-700 font-mono text-[10px] border-b border-white/5">{h}</div>
            ))}
          </div>

          <div className="col-span-7 grid grid-cols-7 relative">
            {days.map((day) => (
              <div key={day} className="relative flex flex-col border-r border-white/5 min-h-[1520px]">
                <div className="h-16 flex items-center justify-center border-b border-white/10 font-black text-slate-500 uppercase tracking-widest text-[10px] sticky top-0 z-40 bg-slate-950">{day}</div>
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
          <span className="material-symbols-outlined text-indigo-500">auto_awesome_motion</span>
          Opciones de Horario
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-6">
          {proposals.map((p, idx) => (
            <button 
              key={String(p.id || idx)}
              onClick={() => setActiveId(String(p.id || `p${idx}`))}
              className={`shrink-0 min-w-[260px] p-6 rounded-[2rem] transition-all duration-300 text-left border-2 ${
                activeId === String(p.id || `p${idx}`) 
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-2xl' 
                  : 'border-white/5 bg-slate-900/40 hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full text-slate-400">PROPUESTA {idx + 1}</span>
                <span className="text-xl font-black text-white">{(p.score || 0).toFixed(1)}%</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">{p.name || 'Ruta Académica'}</h4>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{p.items?.length} Asignaturas</p>
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-12 right-12 z-[110]">
        <button 
          onClick={handleGenerate}
          disabled={isLoading}
          className="flex items-center gap-4 px-12 h-20 bg-indigo-600 text-white rounded-full shadow-[0_20px_50px_rgba(79,70,229,0.5)] hover:scale-105 active:scale-95 transition-all font-black text-xl"
        >
          <span className="material-symbols-outlined text-3xl">psychology</span>
          OPTIMIZAR AHORA
        </button>
      </div>
    </div>
  );
};

export default ScheduleManager;
