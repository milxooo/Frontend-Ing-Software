import { useState } from 'react';
import { ArrowLeft, Menu, Info, ChevronDown } from 'lucide-react';
import '../styles/us12.css';

interface MarketplacePublishProps {
  onBack: () => void;
  onExplore: () => void;
}

export function MarketplacePublish({ onBack, onExplore }: MarketplacePublishProps) {
  const [anonymous, setAnonymous] = useState(false);

  return (
    <div className="us12-app">
      <div className="us12-container">
        
        {/* Debug Header (from Mockup) */}
        <div className="us12-debug-header purple">
          <h2 className="us12-debug-title">Pantalla 1</h2>
          <p className="us12-debug-subtitle">Publicar Cupo</p>
        </div>

        {/* App Bar */}
        <div className="us12-app-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="us12-icon-btn" onClick={onBack}>
              <ArrowLeft size={20} />
            </button>
            <div className="us12-app-title">
              <div className="us12-app-logo">AH</div>
              Publicar Cupo
            </div>
          </div>
          <button className="us12-icon-btn">
            <Menu size={20} />
          </button>
        </div>

        <div className="us12-content">
          {/* Info Box */}
          <div className="us12-info-box">
            <Info size={18} className="us12-info-icon" />
            <div>
              <h3 className="us12-info-text-title">¿Qué es el intercambio de cupos?</h3>
              <p className="us12-info-text-desc">
                Publica tu cupo actual y el sistema buscará estudiantes con horarios compatibles para intercambiar, liberando tus zonas prohibidas.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="us12-form-card">
            <label className="us12-form-label">Materia/Grupo a Publicar</label>
            <div className="us12-select-wrapper">
              <select className="us12-select" defaultValue="">
                <option value="" disabled>Selecciona de tu horario oficial</option>
                <option value="1">Cálculo Diferencial - A2</option>
              </select>
              <ChevronDown size={16} className="us12-select-icon" />
            </div>
          </div>

          <div className="us12-form-card">
            <label className="us12-form-label">Vinculado con Zona Prohibida (opcional)</label>
            <p className="us12-form-hint">Si este cupo choca con tu trabajo/bienestar, el sistema priorizará matches que lo liberen</p>
            <div className="us12-select-wrapper">
              <select className="us12-select" defaultValue="none">
                <option value="none">Ninguna</option>
                <option value="trabajo">Bloque de Trabajo - Lunes</option>
              </select>
              <ChevronDown size={16} className="us12-select-icon" />
            </div>
          </div>

          <div className="us12-form-card">
            <div className="us12-toggle-row">
              <div className="us12-toggle-info">
                <label className="us12-form-label" style={{ marginBottom: '0.125rem' }}>Publicación Anónima</label>
                <p className="us12-form-hint" style={{ margin: 0 }}>Tu identidad solo se revelará cuando aceptes un match</p>
              </div>
              <div 
                className={`us12-toggle ${!anonymous ? 'off' : ''}`}
                onClick={() => setAnonymous(!anonymous)}
              ></div>
            </div>
          </div>

          <button className="us12-btn-disabled" style={{ marginTop: 'auto' }} onClick={onExplore}>
            Publicar Oferta
          </button>
        </div>

      </div>
    </div>
  );
}
