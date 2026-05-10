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

// US-07: Priorización Académica (Criticality)
export const getCriticality = async (studentId: string, programId: string = 'CS-2024') => {
  const response = await fetch(`http://localhost:3000/api/students/${studentId}/criticality?programId=${programId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al obtener la priorización académica');
  return await response.json();
};

// US-12: Marketplace de Cupos
export const getMarketplaceOffers = async (courseId: string) => {
  const response = await fetch(`http://localhost:3000/api/marketplace/courses/${courseId}/offers`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al obtener ofertas del marketplace');
  return await response.json();
};

// US-15: Reporte de Conflictos de Demanda (Decanos)
export const getDemandConflictReport = async (period: string = '2026-2') => {
  const response = await fetch(`http://localhost:3000/api/reports/demand-conflict?period=${period}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al obtener reporte de demanda');
  const result = await response.json();
  return result.data;
};

// US-14: Mapa de Calor de Concurrencia (Administradores)
export const getConcurrencyHeatMap = async () => {
  const response = await fetch(`http://localhost:3000/api/reports/concurrency-heatmap`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al obtener mapa de calor');
  const result = await response.json();
  return result.data;
};

export default api;
