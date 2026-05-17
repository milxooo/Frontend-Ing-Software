import axios from 'axios';
import { getToken } from './auth.service';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Instancia de Axios configurada para la API de OptimaAcademia.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 1. INTERCEPTOR DE SEGURIDAD (US-18 Stability & Security)
 * Inyecta automáticamente el token JWT en cada petición.
 */
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

/**
 * 4. MANEJO DE ESTABILIDAD (US-18: 429 Too Many Requests)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      alert('⚠️ Sistema en alta demanda (US-18). Por seguridad, tu petición se ha encolado. Espera 5 segundos antes de reintentar.');
    }
    if (error.response?.status === 401) {
      console.error('Sesión expirada o inválida');
    }
    return Promise.reject(error);
  }
);

/* ── US-02: Sincronización por Imagen (Visión IA) ── */
export const syncScheduleByImage = async (studentId: string, imageFile: File) => {
  const formData = new FormData();
  formData.append('schedule', imageFile);
  formData.append('studentId', studentId);

  const response = await api.post('/sync/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/* ── US-02: Sincronización por API ── */
export const syncAcademicHistory = async (studentId: string, token: string) => {
  const response = await api.post('/sync/api', { studentId, token });
  return response.data;
};

export const saveSyncData = async (studentId: string, records: any[]) => {
  const response = await api.post('/sync/save', { studentId, records });
  return response.data;
};

/* ── US-05: Arquitecto de Horarios (IA) ── */
export const generateScheduleProposals = async (studentId: string, preferences: any = {}) => {
  const response = await api.post('/scheduler/proposals', { studentId, preferences });
  return response.data;
};

/* ── US-10: Confirmación de Intercambios (PATCH) ── */
export const confirmSwapMatch = async (matchId: string, studentId: string) => {
  const response = await api.patch(`/swaps/confirm`, { matchId, studentId });
  return response.data;
};

export const rejectSwap = async (matchId: string) => {
  const response = await api.post(`/swaps/reject`, { matchId });
  return response.data;
};

/* ── US-11: Formalización de Intercambios (POST) ── */
export const formalizeSwap = async (matchId: string) => {
  const response = await api.post('/swaps/formalize', { matchId });
  return response.data;
};

/* ── US-17: Chatbot Automatizado ── */
export const createChatSession = async () => {
  const response = await api.post('/chat/sessions');
  return response.data.sessionId;
};

export const sendChatMessage = async (sessionId: string, message: string) => {
  const response = await api.post(`/chat/sessions/${sessionId}/messages`, { message });
  return response.data;
};

/* ── US-12/15/16: Sistema de Notificaciones ── */
export type NotificacionAPI = {
  id: string;
  mensaje: string;
  tipo: 'MATCH' | 'STATUS_CHANGE' | 'SYSTEM' | 'URGENTE' | 'INTERCAMBIO';
  estado: 'LEIDA' | 'NO_LEIDA';
  fecha: string;
};

export const notificacionesService = {
  getAll: async (studentId: string) => {
    const response = await api.get<{ ok: boolean; data: NotificacionAPI[] }>(`/notificaciones/${studentId}`);
    return response.data;
  },
  getNoLeidas: async (studentId: string) => {
    const response = await api.get<{ ok: boolean; count: number }>(`/notificaciones/${studentId}/no-leidas`);
    return response.data;
  },
  marcarLeida: async (id: string) => {
    const response = await api.patch<{ ok: boolean }>(`/notificaciones/${id}/leida`);
    return response.data;
  },
  marcarTodasLeidas: async (studentId: string) => {
    const response = await api.patch<{ ok: boolean }>(`/notificaciones/${studentId}/leer-todas`);
    return response.data;
  },
  borrarTodas: async (studentId: string) => {
    const response = await api.delete<{ ok: boolean }>(`/notificaciones/${studentId}/borrar-todas`);
    return response.data;
  }
};

/* ── US-13: Arquitecto de Sugerencias (AI) ── */
export type TipoSugerencia = 'CURSO_CORTO' | 'EVENTO_CULTURAL';

export interface SugerenciaAPI {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: TipoSugerencia;
  campus: string;
  dias: string[];
  horaInicio: string;
  horaFin: string;
  duracionHoras: number;
  esGratuita: boolean;
}

export interface TiempoLibreAPI {
  dia: string;
  horaInicio: string;
  horaFin: string;
}

export const sugerenciasService = {
  getPorTiempoLibre: async (tiemposLibres: TiempoLibreAPI[]) => {
    const response = await api.post<{ ok: boolean; data: SugerenciaAPI[] }>('/sugerencias/por-tiempo', { tiemposLibres });
    return response.data;
  }
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
