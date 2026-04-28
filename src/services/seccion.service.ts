// ============================================================
//  US-08 | seccion.service.ts
//  Contrato: GET /api/secciones/{materiaId}/disponibles
//  Retorna: Seccion[]  (array directo, sin wrapper)
// ============================================================

import type { Seccion } from '../types';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

/**
 * Obtiene las secciones con cuposDisponibles > 0 para una materia.
 *
 * @param materiaId  ID de la materia (Long en Java → number aquí)
 * @throws Error     si la respuesta HTTP no es 2xx
 */
export async function getSeccionesDisponibles(
  materiaId: number
): Promise<Seccion[]> {
  const res = await fetch(`${BASE}/secciones/${materiaId}/disponibles`);

  if (!res.ok) {
    throw new Error(
      `No se pudieron obtener las secciones (HTTP ${res.status})`
    );
  }

  return res.json() as Promise<Seccion[]>;
}
