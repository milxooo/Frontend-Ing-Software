import React from 'react';

interface Notification {
  id: string;
  type: 'match' | 'info';
  title: string;
  msg: string;
  time: string;
  urgent: boolean;
}

const MOCK_NOTIFS: Notification[] = [
  { id: 'NOT-01', type: 'match', title: '¡Match Encontrado!', msg: 'Un estudiante quiere tu sección de Cálculo III.', time: 'Justo ahora', urgent: true },
  { id: 'NOT-02', type: 'info', title: 'Periodo de Intercambio', msg: 'Faltan 2 días para el cierre de registros.', time: 'Hace 2h', urgent: false },
  { id: 'NOT-03', type: 'match', title: 'Sugerencia de Permuta', msg: 'SEC-012-C tiene 1 cupo y coincide con tu horario.', time: 'Hace 5h', urgent: false }
];

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  const handleSeeAll = () => {
    onClose();
    onNavigate('swaps');
  };

  return (
    <div className="absolute right-0 mt-4 w-96 bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-50 border border-white/10 animate-in slide-in-from-top-2 duration-200">
      <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2 text-white">
          <span className="material-symbols-outlined text-primary text-lg">swap_calls</span>
          Centro de Intercambios
        </h3>
        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold uppercase">US-09 Active</span>
      </div>
      
      <div className="max-h-[480px] overflow-y-auto p-3 space-y-2">
        {MOCK_NOTIFS.map((n) => (
          <div 
            key={n.id}
            className={`p-3 rounded-xl border border-white/5 transition-all hover:bg-white/5 cursor-pointer flex gap-3 ${n.urgent ? 'bg-primary/5 border-primary/20' : 'bg-slate-800/40'}`}
          >
            <span className={`material-symbols-outlined ${n.urgent ? 'text-primary' : 'text-slate-500'}`}>
              {n.type === 'match' ? 'verified' : 'info'}
            </span>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-0.5">
                <span className="font-bold text-[11px] text-white uppercase tracking-wider">{n.title}</span>
                <span className="text-[9px] text-slate-500">{n.time}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">{n.msg}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 bg-slate-900/50 border-t border-white/5 text-center">
        <button 
          className="text-[10px] font-bold text-primary hover:underline" 
          onClick={handleSeeAll}
        >
          Ver todas las solicitudes
        </button>
      </div>
    </div>
  );
};

export default NotificationCenter;
