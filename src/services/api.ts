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
// Implementado según el Brief Técnico (Carga Segura)
export const syncAcademicHistory = async (studentId: string, token: string) => {
  const response = await api.post('/sync', { studentId, universityToken: token });
  return response.data; // Devuelve el historial y resumen
};

// US-05: Generación de Horarios (IA)
export const generateSchedules = async (studentId: string) => {
  const response = await api.post('/schedules/generate', { studentId });
  return response.data;
};

// US-10: Confirmación Bilateral de Swap
export const confirmSwap = async (matchId: string, studentId: string) => {
  const response = await api.patch('/swaps/confirm', { matchId, studentId });
  return response.data;
};

// US-11: Formalización Legal (Sello Digital)
export const formalizeSwap = async (matchId: string) => {
  const response = await api.post('/swaps/formalize', { matchId });
  return response.data;
};

export default api;
