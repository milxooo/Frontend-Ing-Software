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
  
  // El backend devuelve el Hash de Transacción y el Sello Digital
  return await response.json(); 
};

export default api;
