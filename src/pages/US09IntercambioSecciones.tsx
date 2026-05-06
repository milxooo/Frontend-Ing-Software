import React from 'react';

const MOCK_MATCHES = [
  { id: 'MT-452', subject: 'Cálculo III', section: 'SEC-04-A', status: 'MATCH ENCONTRADO', student: 'Juan Pérez', time: 'Hace 5 min' },
  { id: 'MT-881', subject: 'Física I', section: 'SEC-09-B', status: 'PENDIENTE', student: 'Ana García', time: 'Hace 1h' },
];

const US09IntercambioSecciones: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-6xl font-manrope font-black text-white tracking-tighter">Historial de Intercambios</h1>
        <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
          Gestiona tus solicitudes de permuta y revisa los matches generados por el motor de optimización.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {MOCK_MATCHES.map((m) => (
          <div key={m.id} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl flex items-center justify-between group hover:border-primary/30 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">swap_horiz</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{m.id}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{m.status}</span>
                </div>
                <h3 className="text-xl font-bold text-white">{m.subject}</h3>
                <p className="text-sm text-slate-500">{m.section} • Solicitado por {m.student}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <span className="text-xs text-slate-500 font-mono">{m.time}</span>
              <button className="bg-primary text-slate-950 px-6 py-2 rounded-xl text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                Ver Detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-indigo-500/5 border border-indigo-500/10 p-8 rounded-3xl flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
          <span className="material-symbols-outlined text-4xl animate-pulse">notifications_active</span>
        </div>
        <div>
          <h4 className="text-lg font-bold text-white">Alertas de Intercambio Activas</h4>
          <p className="text-sm text-slate-400 max-w-lg">
            El sistema está escaneando continuamente la base de datos de inscripciones para encontrar permutaciones que se ajusten a tus preferencias de horario.
          </p>
        </div>
        <button className="ml-auto bg-white/5 text-white px-6 py-3 rounded-2xl text-sm font-bold border border-white/10 hover:bg-white/10">
          Configurar Alertas
        </button>
      </div>
    </div>
  );
};

export default US09IntercambioSecciones;
