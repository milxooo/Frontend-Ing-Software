import { useState } from 'react';

interface MatchSubject {
  name: string;
  code: string;
  group: string;
}

interface ScheduleMatch {
  id: string;
  score: number;
  tag: string;
  efficiency: number;
  subjectA: MatchSubject;
  subjectB: MatchSubject;
}

/**
 * US-09: SmartMatch Algorithm
 * Visualiza matches óptimos para intercambios de secciones.
 */
export const SmartMatch: React.FC = () => {
  const [matches] = useState<ScheduleMatch[]>([
    {
      id: 'M1',
      score: 98,
      tag: 'ÓPTIMO',
      efficiency: 99,
      subjectA: { name: 'Cálculo Diferencial', code: 'MAT101', group: '12' },
      subjectB: { name: 'Física Mecánica', code: 'FIS101', group: '05' }
    },
    {
      id: 'M2',
      score: 85,
      tag: 'EQUILIBRADO',
      efficiency: 88,
      subjectA: { name: 'Programación POO', code: 'PRG201', group: '01' },
      subjectB: { name: 'Estructuras de Datos', code: 'CS301', group: '03' }
    }
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-display font-bold text-white">Matches Sugeridos (US-09)</h3>
        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full border border-emerald-500/20 text-xs font-bold">
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
          Algoritmo SmartMatch Activo
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matches.map(m => (
          <div 
            key={m.id} 
            onClick={() => setSelectedId(m.id)}
            className={`glass-card p-6 border-2 transition-all cursor-pointer ${selectedId === m.id ? 'border-primary bg-primary/5' : 'border-white/5 hover:border-white/20'}`}
          >
            <div className="flex justify-between items-center mb-6">
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${m.tag === 'ÓPTIMO' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-primary/10 text-primary'}`}>
                {m.tag}
              </span>
              <div className="flex items-center gap-1 text-white font-bold">
                <span className="material-symbols-outlined text-sm text-primary">bolt</span>
                {m.score}%
              </div>
            </div>

            <div className="flex items-center gap-4 justify-between">
              <div className="text-center">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Tú entregas</div>
                <div className="text-white font-bold">{m.subjectA.name}</div>
                <div className="text-[10px] text-slate-500">G{m.subjectA.group}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <span className="material-symbols-outlined text-slate-500">swap_horiz</span>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Tú recibes</div>
                <div className="text-white font-bold">{m.subjectB.name}</div>
                <div className="text-[10px] text-slate-500">G{m.subjectB.group}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
