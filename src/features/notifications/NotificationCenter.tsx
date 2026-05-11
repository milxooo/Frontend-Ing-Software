import React, { useState, useEffect } from 'react';
import { notificacionesService } from '../../services/api';
import type { NotificacionAPI } from '../../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

type RequestStatus = 'APROBADO' | 'RECHAZADO' | 'PENDIENTE' | 'EN_REVISION';

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<RequestStatus, { label: string; color: string; bg: string; icon: string }> = {
  APROBADO:    { label: 'Aprobado',    color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: 'check_circle' },
  RECHAZADO:   { label: 'Rechazado',   color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20',         icon: 'cancel' },
  PENDIENTE:   { label: 'Pendiente',   color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20',     icon: 'schedule' },
  EN_REVISION: { label: 'En Revisión', color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20',       icon: 'manage_search' },
};

const detectStatus = (mensaje: string): RequestStatus | null => {
  if (/aprobad/i.test(mensaje))              return 'APROBADO';
  if (/rechazad/i.test(mensaje))             return 'RECHAZADO';
  if (/revisión|revision/i.test(mensaje))    return 'EN_REVISION';
  if (/pendiente/i.test(mensaje))            return 'PENDIENTE';
  return null;
};

const TYPE_ICON: Record<string, string> = {
  INTERCAMBIO: 'swap_horiz',
  SISTEMA:     'info',
};

const ESTUDIANTE_ID = 'EST-001';

// ─── Component ────────────────────────────────────────────────────────────────

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
  onUnreadCountChange?: (count: number) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onUnreadCountChange,
}) => {
  const [notifs, setNotifs]         = useState<NotificacionAPI[]>([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleting, setDeleting]     = useState(false);

  // Carga notificaciones desde el backend (US-16)
  const fetchNotifs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await notificacionesService.getAll(ESTUDIANTE_ID);
      setNotifs(res.data);
      const unread = res.data.filter(n => n.estado === 'NO_LEIDA').length;
      onUnreadCountChange?.(unread);
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchNotifs();
  }, [isOpen]);

  const unreadCount = notifs.filter(n => n.estado === 'NO_LEIDA').length;

  // Marca como leída y alterna expansión
  const handleNotifClick = async (id: string) => {
    // Toggle expand
    setExpandedId(prev => (prev === id ? null : id));

    // Marcar como leída si no lo está
    const notif = notifs.find(n => n.id === id);
    if (!notif || notif.estado === 'LEIDA') return;

    try {
      await notificacionesService.marcarLeida(id.toString());
    } catch { /* optimistic update igual */ }
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, estado: 'LEIDA' as const } : n));
    onUnreadCountChange?.(Math.max(0, unreadCount - 1));
  };

  const markAllRead = async () => {
    try {
      await notificacionesService.marcarTodasLeidas(ESTUDIANTE_ID);
    } catch { /* optimistic */ }
    setNotifs(prev => prev.map(n => ({ ...n, estado: 'LEIDA' as const })));
    onUnreadCountChange?.(0);
  };

  const deleteAll = async () => {
    setDeleting(true);
    try {
      await notificacionesService.borrarTodas(ESTUDIANTE_ID);
    } catch { /* optimistic */ }
    setNotifs([]);
    setExpandedId(null);
    onUnreadCountChange?.(0);
    setDeleting(false);
  };

  const handleSeeAll = () => {
    onClose();
    onNavigate('swaps');
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-4 w-[440px] bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden z-50 border border-white/10">

      {/* ── Header ── */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
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

      {/* ── Action bar ── */}
      {notifs.length > 0 && (
        <div className="px-5 py-2.5 bg-slate-800/30 border-b border-white/5 flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-400">
            {unreadCount > 0
              ? (<>Tienes <span className="text-primary font-bold">{unreadCount}</span> sin leer</>)
              : <span className="text-slate-500">Todo al día ✓</span>
            }
          </span>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] text-primary font-bold hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs">done_all</span>
                Marcar leídas
              </button>
            )}
            <button
              onClick={deleteAll}
              disabled={deleting}
              className="text-[11px] text-red-400 font-bold hover:underline flex items-center gap-1 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-xs">delete_sweep</span>
              {deleting ? 'Borrando...' : 'Borrar todas'}
            </button>
          </div>
        </div>
      )}

      {/* ── Content ── */}
      <div className="max-h-[460px] overflow-y-auto p-3 space-y-2">

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-10 gap-3 text-slate-500">
            <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
            <span className="text-sm">Cargando alertas...</span>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
            <span className="material-symbols-outlined text-red-400 text-3xl">wifi_off</span>
            <p className="text-sm text-slate-400">{error}</p>
            <button onClick={fetchNotifs} className="text-xs text-primary font-bold hover:underline mt-1">
              Reintentar
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && notifs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
            <span className="material-symbols-outlined text-slate-600 text-3xl">notifications_off</span>
            <p className="text-sm text-slate-500">Sin notificaciones por ahora.</p>
          </div>
        )}

        {/* Notification list */}
        {!loading && !error && notifs.map((n) => {
          const isUnread    = n.estado === 'NO_LEIDA';
          const isExpanded  = expandedId === n.id;
          const status      = detectStatus(n.mensaje);
          const statusCfg   = status ? STATUS_CONFIG[status] : null;

          return (
            <div
              key={n.id}
              onClick={() => handleNotifClick(n.id)}
              className={`rounded-2xl border transition-all cursor-pointer select-none ${
                isUnread
                  ? 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                  : 'bg-slate-800/30 border-white/5 hover:bg-white/5'
              }`}
            >
              {/* ── Collapsed row ── */}
              <div className="p-4 flex gap-3">
                {/* Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isUnread ? 'bg-primary/20' : 'bg-white/5'
                }`}>
                  <span className={`material-symbols-outlined text-lg ${isUnread ? 'text-primary' : 'text-slate-500'}`}>
                    {TYPE_ICON[n.tipo] ?? 'info'}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-bold text-[11px] uppercase tracking-wider ${isUnread ? 'text-white' : 'text-slate-400'}`}>
                      {n.tipo === 'INTERCAMBIO' ? 'Cambio de Estado' : 'Sistema'}
                    </span>
                    <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                      {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      <span className="text-[9px] text-slate-500 font-mono">
                        {new Date(n.fecha).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Status badge */}
                  {statusCfg && (
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-bold mb-1.5 ${statusCfg.bg} ${statusCfg.color}`}>
                      <span className="material-symbols-outlined text-[12px]">{statusCfg.icon}</span>
                      {statusCfg.label}
                    </div>
                  )}

                  <p className={`text-[11px] leading-relaxed transition-all ${
                    isExpanded ? 'text-slate-300' : 'text-slate-400 truncate'
                  }`}>
                    {n.mensaje}
                  </p>
                </div>

                {/* Expand chevron */}
                <span className={`material-symbols-outlined text-slate-600 text-sm self-center flex-shrink-0 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}>
                  expand_more
                </span>
              </div>

              {/* ── Expanded panel ── */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-white/5 rounded-xl p-2.5">
                      <p className="text-slate-500 uppercase tracking-wider mb-1">ID</p>
                      <p className="text-white font-mono font-bold">{n.id.slice(0, 12)}...</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-2.5">
                      <p className="text-slate-500 uppercase tracking-wider mb-1">Fecha</p>
                      <p className="text-white font-bold">
                        {new Date(n.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Mensaje completo</p>
                    <p className="text-slate-300 text-xs leading-relaxed">{n.mensaje}</p>
                  </div>
                  {n.tipo === 'INTERCAMBIO' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onClose(); onNavigate('swaps'); }}
                      className="w-full py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold hover:bg-primary/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                      Ver intercambio
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Footer ── */}
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

export default NotificationCenter;
