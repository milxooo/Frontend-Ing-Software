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
