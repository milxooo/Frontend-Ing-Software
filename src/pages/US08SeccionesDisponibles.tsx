import React, { useState } from 'react';
import type { Seccion } from '../types';
import { getSeccionesDisponibles } from '../services/seccion.service';

// ── Helpers ──────────────────────────────────────────────────────────────────

function cuposClass(cupos: number): string {
  if (cupos >= 10) return 'high';
  if (cupos >= 5)  return 'medium';
  return 'low';
}

function cuposIcon(cupos: number): string {
  if (cupos >= 10) return '●';
  if (cupos >= 5)  return '◐';
  return '○';
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function US08SeccionesDisponibles() {
  const [materiaId, setMateriaId]   = useState<string>('');
  const [secciones, setSecciones]   = useState<Seccion[] | null>(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = Number(materiaId);
    if (!id || id <= 0) {
      setError('Ingresa un ID de materia válido (número entero positivo).');
      return;
    }
    setLoading(true);
    setError(null);
    setSecciones(null);

    try {
      const data = await getSeccionesDisponibles(id);
      setSecciones(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card animate-in" style={{ padding: '2rem' }}>

      {/* Header */}
      <div className="section-header">
        <div className="section-icon primary">📋</div>
        <div>
          <span className="section-badge">US-08</span>
          <h2>Secciones Disponibles</h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.875rem', marginTop: 4 }}>
            Consulta las secciones con cupos libres para una materia.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleBuscar}>
        <div className="form-group">
          <label className="form-label" htmlFor="us08-materia-id">
            ID de Materia
          </label>
          <input
            id="us08-materia-id"
            type="number"
            min="1"
            className="form-input"
            placeholder="Ej. 3"
            value={materiaId}
            onChange={e => setMateriaId(e.target.value)}
            required
          />
        </div>

        <button
          id="us08-btn-buscar"
          type="submit"
          className={`btn btn-primary btn-full${loading ? ' btn-loading' : ''}`}
          disabled={loading}
        >
          {!loading && <span>🔍</span>}
          {loading ? 'Buscando…' : 'Buscar Secciones'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="alert alert-error" style={{ marginTop: '1rem' }} role="alert">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Results */}
      {secciones !== null && !error && (
        <>
          <div className="divider" />

          {secciones.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">📭</span>
              <p>No hay secciones disponibles para la materia <strong>{materiaId}</strong>.</p>
            </div>
          ) : (
            <>
              <div
                className="alert alert-info"
                role="status"
                style={{ marginBottom: '0.75rem' }}
              >
                <span>✅</span>
                Se encontraron <strong>{secciones.length}</strong> sección
                {secciones.length !== 1 ? 'es' : ''} disponibles.
              </div>

              <div className="result-grid">
                {secciones.map(sec => (
                  <div className="seccion-card" key={sec.id}>
                    <div className="seccion-card-name">{sec.nombre}</div>
                    <div className="seccion-card-id">Sección #{sec.id} · Materia {sec.materiaId}</div>

                    <span className={`cupos-pill ${cuposClass(sec.cuposDisponibles)}`}>
                      {cuposIcon(sec.cuposDisponibles)} {sec.cuposDisponibles} cupos
                    </span>

                    {/* mini progress */}
                    <div className="progress-bar-wrap" style={{ marginTop: 8 }}>
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${Math.min((sec.cuposDisponibles / 30) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}
