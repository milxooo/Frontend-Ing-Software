import React, { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type NotificationType = 'status_change' | 'match' | 'info' | 'reminder';
type RequestStatus = 'APROBADO' | 'RECHAZADO' | 'PENDIENTE' | 'EN_REVISION';

interface StatusNotification {
  id: string;
  type: NotificationType;
  title: string;
  msg: string;
  time: string;
  read: boolean;
  requestId?: string;
  subject?: string;
  status?: RequestStatus;
}

// ─── Mock Data (US-16) ────────────────────────────────────────────────────────

const INITIAL_NOTIFS: StatusNotification[] = [
  {
    id: 'N-001',
    type: 'status_change',
    title: 'Solicitud Aprobada',
    msg: 'Tu intercambio de Cálculo III fue aprobado por el sistema.',
    time: 'Justo ahora',
    read: false,
    requestId: 'MT-452',
    subject: 'Cálculo III',
    status: 'APROBADO',
  },
  {
    id: 'N-002',
    type: 'status_change',
    title: 'Solicitud Rechazada',
    msg: 'El intercambio de Física I no pudo concretarse. La sección ya no tiene cupo.',
    time: 'Hace 30 min',
    read: false,
    requestId: 'MT-881',
    subject: 'Física I',
    status: 'RECHAZADO',
  },
  {
    id: 'N-003',
    type: 'status_change',
    title: 'En Revisión',
    msg: 'Tu solicitud de Álgebra Lineal está siendo evaluada por el coordinador.',
    time: 'Hace 2h',
    read: false,
    requestId: 'MT-903',
    subject: 'Álgebra Lineal',
    status: 'EN_REVISION',
  },
  {
    id: 'N-004',
    type: 'match',
    title: '¡Match Encontrado!',
    msg: 'Un estudiante quiere tu sección de Programación Avanzada.',
    time: 'Hace 3h',
    read: true,
  },
  {
    id: 'N-005',
    type: 'status_change',
    title: 'Solicitud Pendiente',
    msg: 'Tu solicitud de Bases de Datos II está en cola de procesamiento.',
    time: 'Hace 5h',
    read: true,
    requestId: 'MT-774',
    subject: 'Bases de Datos II',
    status: 'PENDIENTE',
  },
  {
    id: 'N-006',
    type: 'reminder',
    title: 'Cierre de Periodo',
    msg: 'Faltan 2 días para el cierre del periodo de intercambios. Revisa tus solicitudes.',
    time: 'Hace 1 día',
    read: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<RequestStatus, { label: string; color: string; bg: string; icon: string }> = {
  APROBADO:   { label: 'Aprobado',   color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: 'check_circle' },
  RECHAZADO:  { label: 'Rechazado',  color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20',         icon: 'cancel' },
  PENDIENTE:  { label: 'Pendiente',  color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20',     icon: 'schedule' },
  EN_REVISION:{ label: 'En Revisión',color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20',       icon: 'manage_search' },
};

const TYPE_ICON: Record<NotificationType, string> = {
  status_change: 'swap_horiz',
  match:         'verified',
  info:          'info',
  reminder:      'alarm',
};

// ─── Component ────────────────────────────────────────────────────────────────

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose, onNavigate }) => {
  const [notifs, setNotifs] = useState<StatusNotification[]>(INITIAL_NOTIFS);

  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleSeeAll = () => {
    onClose();
    onNavigate('swaps');
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-4 w-[420px] bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden z-50 border border-white/10">

      {/* Header */}
      <div className="p-5 border-b border-white/5 bg-white/3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-lg">notifications_active</span>
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Centro de Alertas</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">US-16 · Cambios de Estado</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="text-[10px] bg-primary/20 text-primary px-2.5 py-1 rounded-full font-bold">
              {unreadCount} nuevas
            </span>
          )}
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition-all"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      </div>

      {/* Mark all read */}
      {unreadCount > 0 && (
        <div className="px-5 py-2.5 bg-primary/5 border-b border-primary/10 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Tienes <span className="text-primary font-bold">{unreadCount}</span> alertas sin leer
          </span>
          <button
            onClick={markAllRead}
            className="text-[11px] text-primary font-bold hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-xs">done_all</span>
            Marcar todas como leídas
          </button>
        </div>
      )}

      {/* Notification list */}
      <div className="max-h-[440px] overflow-y-auto p-3 space-y-2">
        {notifs.map((n) => {
          const statusCfg = n.status ? STATUS_CONFIG[n.status] : null;

          return (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`p-4 rounded-2xl border transition-all hover:bg-white/5 cursor-pointer group ${
                !n.read
                  ? 'bg-primary/5 border-primary/20'
                  : 'bg-slate-800/30 border-white/5'
              }`}
            >
              <div className="flex gap-3">
                {/* Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  !n.read ? 'bg-primary/20' : 'bg-white/5'
                }`}>
                  <span className={`material-symbols-outlined text-lg ${
                    !n.read ? 'text-primary' : 'text-slate-500'
                  }`}>
                    {TYPE_ICON[n.type]}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-bold text-[11px] uppercase tracking-wider ${
                      !n.read ? 'text-white' : 'text-slate-400'
                    }`}>
                      {n.title}
                    </span>
                    <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                      {!n.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      )}
                      <span className="text-[9px] text-slate-500 font-mono">{n.time}</span>
                    </div>
                  </div>

                  {/* Status badge (US-16) */}
                  {statusCfg && n.requestId && (
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-bold mb-1.5 ${statusCfg.bg} ${statusCfg.color}`}>
                      <span className="material-symbols-outlined text-[12px]">{statusCfg.icon}</span>
                      {n.requestId} · {statusCfg.label}
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 leading-relaxed">{n.msg}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-900/50 border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] text-slate-600">{notifs.length} notificaciones en total</span>
        <button
          className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
          onClick={handleSeeAll}
        >
          Ver todas las solicitudes
          <span className="material-symbols-outlined text-xs">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

// ─── Badge Export (para el header) ────────────────────────────────────────────

export { INITIAL_NOTIFS };
export type { StatusNotification, RequestStatus };
export default NotificationCenter;
