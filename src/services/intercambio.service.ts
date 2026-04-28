// ============================================================
//  US-09 | intercambio.service.ts
//  Contrato: POST /api/intercambios/registrar
//  Body:   { estudianteId, materiaDeseadaId, materiaOfrecidaId }
//  Retorna: IntercambioResponse  (con id + estado)
//  HTTP:   201 Created
// ============================================================

import type { IntercambioRequest, IntercambioResponse } from '../types';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

/**
 * Registra una solicitud de intercambio y dispara el matching automático.
 * El backend devuelve el objeto persistido con estado "PENDIENTE" o "MATCHED".
 *
 * @param payload  Campos exactos: estudianteId, materiaDeseadaId, materiaOfrecidaId
 * @throws Error   si la respuesta HTTP no es 2xx
 */
export async function registrarIntercambio(
  payload: IntercambioRequest
): Promise<IntercambioResponse> {
  const res = await fetch(`${BASE}/intercambios/registrar`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(
      `No se pudo registrar el intercambio (HTTP ${res.status})`
    );
  }

  // Backend responde 201 + body JSON con el Intercambio persistido
  return res.json() as Promise<IntercambioResponse>;
}
