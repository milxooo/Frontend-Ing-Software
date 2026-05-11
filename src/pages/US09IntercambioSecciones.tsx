import React, { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AlertConfig {
  matchEncontrado: boolean;
  cambioEstado: boolean;
  solicitudRecibida: boolean;
  recordatorios: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_MATCHES = [
  { id: 'MT-452', subject: 'Cálculo III',  section: 'SEC-04-A', status: 'MATCH ENCONTRADO', student: 'Juan Pérez',  time: 'Hace 5 min' },
  { id: 'MT-881', subject: 'Física I',     section: 'SEC-09-B', status: 'PENDIENTE',         student: 'Ana García', time: 'Hace 1h' },
];

const STATUS_COLOR: Record<string, string> = {
  'MATCH ENCONTRADO': 'text-emerald-400',
  'PENDIENTE':        'text-amber-400',
  'RECHAZADO':        'text-red-400',
};

// ─── Modal Configurar Alertas ─────────────────────────────────────────────────

interface AlertModalProps {
  config: AlertConfig;
  onSave: (cfg: AlertConfig) => void;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ config, onSave, onClose }) => {
  const [local, setLocal] = useState<AlertConfig>(config);

  const toggle = (key: keyof AlertConfig) =>
    setLocal(prev => ({ ...prev, [key]: !prev[key] }));

  const OPTIONS: { key: keyof AlertConfig; label: string; desc: string; icon: string }[] = [
    { key: 'matchEncontrado',   label: 'Match encontrado',      desc: 'Cuando el motor detecta un intercambio compatible.',      icon: 'bolt' },
    { key: 'cambioEstado',      label: 'Cambio de estado',      desc: 'Cuando tu solicitud cambia a Aprobado / Rechazado.',      icon: 'update' },
    { key: 'solicitudRecibida', label: 'Solicitud recibida',    desc: 'Cuando otro estudiante solicita un intercambio contigo.',  icon: 'person_raised_hand' },
    { key: 'recordatorios',     label: 'Recordatorios',         desc: 'Alertas de cierre de periodo y plazos importantes.',      icon: 'alarm' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">tune</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-base">Configurar Alertas</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">US-09 · Preferencias de notificación</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Options */}
        <div className="p-4 space-y-2">
          {OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => toggle(opt.key)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200 ${
                local[opt.key]
                  ? 'bg-primary/10 border-primary/30'
                  : 'bg-white/5 border-white/5 hover:bg-white/8 hover:border-white/10'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                local[opt.key] ? 'bg-primary/20' : 'bg-white/5'
              }`}>
                <span className={`material-symbols-outlined text-xl transition-all ${
                  local[opt.key] ? 'text-primary' : 'text-slate-500'
                }`}>{opt.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold transition-all ${local[opt.key] ? 'text-white' : 'text-slate-400'}`}>
                  {opt.label}
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">{opt.desc}</p>
              </div>
              {/* Toggle visual */}
              <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-all duration-300 flex-shrink-0 ${
                local[opt.key] ? 'bg-primary' : 'bg-slate-700'
              }`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
                  local[opt.key] ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-white/10 text-slate-400 text-sm font-bold hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={() => { onSave(local); onClose(); }}
            className="flex-1 py-3 rounded-2xl bg-primary text-slate-950 text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const US09IntercambioSecciones: React.FC = () => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    matchEncontrado:   true,
    cambioEstado:      true,
    solicitudRecibida: true,
    recordatorios:     false,
  });
  const [showAlertModal, setShowAlertModal] = useState(false);

  const activeCount = Object.values(alertConfig).filter(Boolean).length;

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
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${STATUS_COLOR[m.status] ?? 'text-primary'}`}>
                    {m.status}
                  </span>
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

      {/* Alert config banner */}
      <div className="bg-indigo-500/5 border border-indigo-500/10 p-8 rounded-3xl flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
          <span className="material-symbols-outlined text-4xl animate-pulse">notifications_active</span>
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-white">Alertas de Intercambio Activas</h4>
          <p className="text-sm text-slate-400 max-w-lg">
            El sistema escanea continuamente la base de datos de inscripciones para encontrar permutaciones compatibles.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-bold">{activeCount} tipos de alerta activos</span>
          </div>
        </div>
        <button
          onClick={() => setShowAlertModal(true)}
          className="ml-auto bg-white/5 text-white px-6 py-3 rounded-2xl text-sm font-bold border border-white/10 hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">tune</span>
          Configurar Alertas
        </button>
      </div>

      {/* Modal */}
      {showAlertModal && (
        <AlertModal
          config={alertConfig}
          onSave={setAlertConfig}
          onClose={() => setShowAlertModal(false)}
        />
      )}
    </div>
  );
};

export default US09IntercambioSecciones;
