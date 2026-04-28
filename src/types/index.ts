// ============================================================
//  Types — US-08 & US-09
//  Campos exactos tomados de los modelos JPA del backend:
//    • com.academico.model.Seccion
//    • com.academico.model.Intercambio
// ============================================================

// ── US-08 ────────────────────────────────────────────────────
/**
 * Mapea com.academico.model.Seccion.
 * Endpoint: GET /api/secciones/{materiaId}/disponibles
 */
export interface Seccion {
  id: number;
  nombre: string;
  materiaId: number;
  cuposDisponibles: number;   // campo exacto del backend
}

// ── US-09 ────────────────────────────────────────────────────
/**
 * Body enviado a POST /api/intercambios/registrar.
 * Mapea los setters de com.academico.model.Intercambio.
 */
export interface IntercambioRequest {
  estudianteId:     number;
  materiaDeseadaId: number;
  materiaOfrecidaId: number;
}

/**
 * Respuesta del backend tras registrar un intercambio.
 * El estado es siempre "PENDIENTE" o "MATCHED" (ver IntercambioService).
 */
export interface IntercambioResponse extends IntercambioRequest {
  id:     number;
  estado: 'PENDIENTE' | 'MATCHED';
}
