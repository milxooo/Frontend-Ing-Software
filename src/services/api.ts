import axios from 'axios';

/**
 * OptimaAcademia API Client
 * Centralized communication with the Backend (Hexagonal Architecture)
 */
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// US-02: Sincronización de Historia Académica
export const syncAcademicHistory = async (studentId: string, token: string) => {
  const response = await api.post('/sync', { studentId, universityToken: token });
  return response.data;
};

// US-05: Generación de Horarios (IA Engine)
// Implementado con el estándar de "fetch" solicitado para el Arquitecto de Horarios
export const generateScheduleProposals = async (studentId: string) => {
  const response = await fetch('http://localhost:3000/api/schedules/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId })
  });
  if (!response.ok) throw new Error('Error generando propuestas');
  return await response.json(); 
};

// US-10: Confirmación Bilateral de Swap (Confirmación Mutua)
export const confirmSwapMatch = async (matchId: string, studentId: string) => {
  const response = await fetch(`http://localhost:3000/api/swaps/confirm`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matchId, studentId })
  });
  if (!response.ok) throw new Error('Error al confirmar el match');
  return await response.json(); // Devuelve "PENDIENTE" o "APROBADO"
};

// US-11: Formalización Legal (Sello Digital y Registro Oficial)
export const formalizeSwap = async (matchId: string) => {
  const response = await fetch(`http://localhost:3000/api/swaps/formalize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matchId })
  });
  
  if (!response.ok) throw new Error('Fallo en el registro oficial');
  return await response.json(); 
};

// US-10: Rechazo de Intercambio
export const rejectSwap = async (matchId: string) => {
  const response = await fetch(`http://localhost:3000/api/swaps/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matchId })
  });
  if (!response.ok) throw new Error('Error al rechazar el intercambio');
  return await response.json();
};

export default api;

// ─── Tipos compartidos US-13 / US-16 ─────────────────────────────────────────

export type TipoNotificacion   = 'INTERCAMBIO' | 'SISTEMA';
export type EstadoNotificacion = 'NO_LEIDA' | 'LEIDA';
export type TipoSugerencia     = 'CURSO_CORTO' | 'EVENTO_CULTURAL';

export interface NotificacionAPI {
  id: string;
  estudianteId: string;
  mensaje: string;
  tipo: TipoNotificacion;
  estado: EstadoNotificacion;
  fecha: string;
}

export interface SugerenciaAPI {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: TipoSugerencia;
  duracionHoras: number;
  campus: string;
  dias: string[];
  horaInicio: string;
  horaFin: string;
  esGratuita: boolean;
}

export interface TiempoLibreAPI {
  dia: string;
  horaInicio: string;
  horaFin: string;
}

// Helper fetch interno
async function apiFetch<T>(path: string, init?: { method?: string; body?: string }): Promise<T> {
  const res = await fetch(`http://localhost:3000/api${path}`, {
    method: init?.method ?? 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: init?.body,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Error desconocido' }));
    const errMsg = (err as any).error || (err as any).message || `HTTP ${res.status}`;
    throw new Error(errMsg);
  }
  return res.json() as Promise<T>;
}

// ─── US-16: Servicio de Notificaciones ───────────────────────────────────────

export const notificacionesService = {
  getAll: (estudianteId: string) =>
    apiFetch<{ ok: boolean; data: NotificacionAPI[] }>(`/notificaciones/${estudianteId}`),

  getNoLeidas: (estudianteId: string) =>
    apiFetch<{ ok: boolean; count: number; data: NotificacionAPI[] }>(`/notificaciones/${estudianteId}/no-leidas`),

  marcarLeida: (id: string) =>
    apiFetch<{ ok: boolean; message: string }>(`/notificaciones/${id}/leer`, { method: 'PATCH' }),

  marcarTodasLeidas: (estudianteId: string) =>
    apiFetch<{ ok: boolean; message: string; cantidad: number }>(`/notificaciones/${estudianteId}/leer-todas`, { method: 'PATCH' }),

  borrarTodas: (estudianteId: string) =>
    apiFetch<{ ok: boolean; message: string; cantidad: number }>(`/notificaciones/${estudianteId}/borrar-todas`, { method: 'DELETE' }),
};

// ─── US-13: Servicio de Sugerencias ──────────────────────────────────────────

export const sugerenciasService = {
  getAll: (tipo?: TipoSugerencia) => {
    const q = tipo ? `?tipo=${tipo}` : '';
    return apiFetch<{ ok: boolean; count: number; data: SugerenciaAPI[] }>(`/sugerencias${q}`);
  },

  getPorTiempoLibre: (tiemposLibres: TiempoLibreAPI[], tipo?: TipoSugerencia) =>
    apiFetch<{ ok: boolean; count: number; data: SugerenciaAPI[] }>('/sugerencias/tiempo-libre', {
      method: 'POST',
      body: JSON.stringify({ tiemposLibres, tipo }),
    }),

  getGratuitas: (tipo?: TipoSugerencia) => {
    const q = tipo ? `?tipo=${tipo}` : '';
    return apiFetch<{ ok: boolean; count: number; data: SugerenciaAPI[] }>(`/sugerencias/gratuitas${q}`);
  },
};

// ─── US-17 & US-18: Servicio de Autenticación ───────────────────────────────
export const authService = {
  login: async (emailInstitucional: string, password?: string) =>
    apiFetch<{ success: boolean; message: string; data: { token: string; student: any } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ emailInstitucional, password }),
    }),

  register: async (data: any) =>
    apiFetch<{ success: boolean; message: string; data: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  forgotPassword: async (emailInstitucional: string) =>
    apiFetch<{ success: boolean; message: string; data: { token: string; resetLink: string } }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ emailInstitucional }),
    }),

  resetPassword: async (token: string, newPassword?: string) =>
    apiFetch<{ success: boolean; message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),

  ssoCallback: async (emailInstitucional: string, nombreCompleto: string) =>
    apiFetch<{ success: boolean; message: string; data: { token: string; student: any } }>('/auth/sso/callback', {
      method: 'POST',
      body: JSON.stringify({ emailInstitucional, nombreCompleto }),
    }),

  googleCallback: async (email: string, nombreCompleto: string) =>
    apiFetch<{ success: boolean; message: string; data: { token: string; student: any } }>('/auth/google/callback', {
      method: 'POST',
      body: JSON.stringify({ email, nombreCompleto }),
    })
};
