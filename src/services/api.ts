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
      // Podríamos redirigir al login aquí si fuera necesario
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

/* ── US-05: Generación de Propuestas de Horario ── */
export const generateScheduleProposals = async (studentId: string) => {
  const response = await api.post('/schedule/generate', { studentId });
  return response.data;
};

export default api;
