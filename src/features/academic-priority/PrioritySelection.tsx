import { useState } from 'react';

/**
 * US-07: Priorización Académica
 * Permite al estudiante seleccionar sus materias y priorizarlas para el algoritmo.
 */
export const PrioritySelection: React.FC = () => {
  const [subjects] = useState([
    { id: '1', name: 'Cálculo Diferencial', selected: true, priority: 1 },
    { id: '2', name: 'Física Mecánica', selected: true, priority: 2 },
    { id: '3', name: 'Programación Orientada a Objetos', selected: false, priority: 0 },
    { id: '4', name: 'Criptografía I', selected: true, priority: 3 },
  ]);

  return (
    <div className="space-y-6">
      <div className="glass-card p-8">
        <h3 className="text-2xl font-display font-bold text-white mb-6">Selección de Materias (US-07)</h3>
        <div className="space-y-4">
          {subjects.map(s => (
            <div key={s.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-primary/50 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${s.selected ? 'bg-primary border-primary' : 'border-white/20'}`}>
                  {s.selected && <span className="material-symbols-outlined text-white text-xs">check</span>}
                </div>
                <span className={`font-medium ${s.selected ? 'text-white' : 'text-slate-500'}`}>{s.name}</span>
              </div>
              {s.selected && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Prioridad:</span>
                  <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold">{s.priority}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
