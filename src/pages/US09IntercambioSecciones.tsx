import React, { useState } from 'react';
import type { IntercambioResult } from '../types';
import { registrarIntercambio } from '../services/intercambio.service';

// ── Component ─────────────────────────────────────────────────────────────────

export default function US09IntercambioSecciones() {
  const [form, setForm] = useState({
    estudianteId:    '',
    materiaDeseadaId: '',
    materiaOfrecidaId: '',
  });
  const [resultado, setResultado] = useState<IntercambioResult | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const estudianteId     = Number(form.estudianteId);
    const materiaDeseadaId  = Number(form.materiaDeseadaId);
    const materiaOfrecidaId = Number(form.materiaOfrecidaId);

    if (!estudianteId || !materiaDeseadaId || !materiaOfrecidaId) {
      setError('Todos los campos son obligatorios y deben ser números positivos.');
      return;
    }
    if (materiaDeseadaId === materiaOfrecidaId) {
      setError('La materia deseada y la ofrecida no pueden ser la misma.');
      return;
    }

    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const data = await registrarIntercambio({ estudianteId, materiaDeseadaId, materiaOfrecidaId });
      setResultado(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ estudianteId: '', materiaDeseadaId: '', materiaOfrecidaId: '' });
    setResultado(null);
    setError(null);
  };

  const isMatched   = resultado?.estado === 'MATCHED';
  const isPendiente = resultado?.estado === 'PENDIENTE';

  return (
    <section className="card animate-in" style={{ padding: '2rem', animationDelay: '0.1s' }}>

      {/* Header */}
      <div className="section-header">
        <div className="section-icon tertiary">🔁</div>
        <div>
          <span className="section-badge tertiary">US-09</span>
          <h2>Intercambio de Secciones</h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.875rem', marginTop: 4 }}>
            Solicita un intercambio: el sistema busca un match automáticamente.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="us09-estudiante-id">
            ID del Estudiante
          </label>
          <input
            id="us09-estudiante-id"
            name="estudianteId"
            type="number"
            min="1"
            className="form-input"
            placeholder="Ej. 1"
            value={form.estudianteId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="us09-materia-deseada">
            Materia que Deseas
          </label>
          <input
            id="us09-materia-deseada"
            name="materiaDeseadaId"
            type="number"
            min="1"
            className="form-input"
            placeholder="Ej. 5"
            value={form.materiaDeseadaId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="us09-materia-ofrecida">
            Materia que Ofreces
          </label>
          <input
            id="us09-materia-ofrecida"
            name="materiaOfrecidaId"
            type="number"
            min="1"
            className="form-input"
            placeholder="Ej. 3"
            value={form.materiaOfrecidaId}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            id="us09-btn-registrar"
            type="submit"
            className={`btn btn-tertiary btn-full${loading ? ' btn-loading' : ''}`}
            disabled={loading}
          >
            {!loading && <span>🚀</span>}
            {loading ? 'Procesando…' : 'Registrar Intercambio'}
          </button>
          {resultado && (
            <button
              id="us09-btn-reset"
              type="button"
              className="btn btn-outlined"
              onClick={handleReset}
              title="Nueva solicitud"
            >
              ↺
            </button>
          )}
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="alert alert-error" style={{ marginTop: '1rem' }} role="alert">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Result */}
      {resultado && (
        <div className="result-box">
          {/* Status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.95rem' }}>
              Resultado del Matching
            </span>
            <span className={`status-badge ${isMatched ? 'matched' : 'pendiente'}`}>
              {isMatched ? '✓ MATCHED' : '⏳ PENDIENTE'}
            </span>
          </div>

          {/* Info rows */}
          <div className="result-box-row">
            <span>ID Solicitud</span>
            <span>#{resultado.id}</span>
          </div>
          <div className="result-box-row">
            <span>Estudiante</span>
            <span>#{resultado.estudianteId}</span>
          </div>
          <div className="result-box-row">
            <span>Materia deseada</span>
            <span>#{resultado.materiaDeseadaId}</span>
          </div>
          <div className="result-box-row">
            <span>Materia ofrecida</span>
            <span>#{resultado.materiaOfrecidaId}</span>
          </div>

          <div className="divider" style={{ margin: '0.85rem 0' }} />

          {/* Context message */}
          {isMatched && (
            <div className="alert alert-success" role="status">
              <span>🎉</span>
              ¡Match exitoso! Tu intercambio ha sido confirmado automáticamente.
            </div>
          )}
          {isPendiente && (
            <div className="alert alert-warning" role="status">
              <span>⏳</span>
              Solicitud en cola. Te notificaremos cuando encontremos un match.
            </div>
          )}
        </div>
      )}
    </section>
  );
}
