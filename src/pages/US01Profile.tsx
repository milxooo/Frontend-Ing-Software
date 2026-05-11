import React, { useState, useEffect } from 'react';

interface TimeBlock {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  description: string;
}

const US01Profile: React.FC = () => {
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const studentId = 'santiago-123'; // ID de prueba

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/students/${studentId}/time-blocks`);
      const data = await response.json();
      setBlocks(data.blocks || []);
    } catch (err) {
      console.error('Error fetching blocks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Perfil */}
      <div className="flex items-center gap-6 bg-slate-900/40 p-8 rounded-[32px] border border-white/10 shadow-2xl backdrop-blur-xl">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-600 p-1">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Santiago" 
            className="w-full h-full rounded-full bg-slate-950" 
            alt="Avatar" 
          />
        </div>
        <div className="flex-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Estudiante Pregrado</span>
          <h1 className="text-4xl font-manrope font-black text-white tracking-tighter">Santiago Parra</h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-slate-400 text-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">badge</span> 2021102005
            </span>
            <span className="text-slate-400 text-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">mail</span> s.parra@universidad.edu.co
            </span>
          </div>
        </div>
        <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl text-xs font-bold transition-all border border-white/10">
          Editar Perfil
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bloques de Tiempo (US-01) */}
        <div className="bg-slate-900/40 rounded-[32px] border border-white/10 p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">schedule</span> Bloques de Tiempo
            </h2>
            <button className="text-primary text-xs font-bold hover:underline">+ Agregar</button>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
              <div className="py-10 text-center text-slate-500 text-xs animate-pulse">CARGANDO BLOQUES...</div>
            ) : blocks.length === 0 ? (
              <div className="p-6 text-center bg-white/5 rounded-2xl border border-dashed border-white/10 text-slate-500 text-sm italic">
                No tienes restricciones de tiempo configuradas.
              </div>
            ) : (
              blocks.map(block => (
                <div key={block.id} className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all">
                  <div>
                    <div className="text-white font-bold text-sm">{block.day}</div>
                    <div className="text-slate-500 text-[10px] uppercase tracking-wider">{block.startTime} - {block.endTime}</div>
                    <div className="text-slate-400 text-xs mt-1">{block.description}</div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-all">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Logística Estudiantil (US-03) */}
        <div className="bg-slate-900/40 rounded-[32px] border border-white/10 p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">distance</span> Logística y Transporte
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Zona de Residencia</label>
              <select className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary">
                <option>Teusaquillo (Cerca a Universidad)</option>
                <option>Chapinero</option>
                <option>Usaquén</option>
                <option>Suba</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Medio de Transporte Principal</label>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-primary/10 border border-primary text-primary p-3 rounded-xl flex flex-col items-center gap-2 transition-all">
                  <span className="material-symbols-outlined">directions_bike</span>
                  <span className="text-[10px] font-bold">Bicicleta</span>
                </button>
                <button className="bg-white/5 border border-white/10 text-slate-400 p-3 rounded-xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all">
                  <span className="material-symbols-outlined">directions_bus</span>
                  <span className="text-[10px] font-bold">Transmilenio</span>
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button className="w-full bg-primary text-slate-950 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                Guardar Preferencias
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default US01Profile;
