import { ArrowLeft, Menu, Search, ChevronDown, Activity, Sparkles } from 'lucide-react';
import '../styles/us12.css';

interface MarketplaceExploreProps {
  onBack: () => void;
  onMatch: () => void;
}

export function MarketplaceExplore({ onBack, onMatch }: MarketplaceExploreProps) {
  return (
    <div className="us12-app">
      <div className="us12-container">
        
        {/* Debug Header (from Mockup) */}
        <div className="us12-debug-header blue">
          <h2 className="us12-debug-title">Pantalla 2</h2>
          <p className="us12-debug-subtitle">Explorar Cupos Disponibles</p>
        </div>

        {/* App Bar */}
        <div className="us12-app-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="us12-icon-btn" onClick={onBack}>
              <ArrowLeft size={20} />
            </button>
            <div className="us12-app-title">
              <div className="us12-app-logo">AH</div>
              Explorar Cupos
            </div>
          </div>
          <button className="us12-icon-btn">
            <Menu size={20} />
          </button>
        </div>

        {/* Search & Filter */}
        <div className="us12-search-container">
          <div className="us12-search-box">
            <Search size={16} className="us12-search-icon" />
            <input type="text" placeholder="Buscar materia..." className="us12-search-input" />
          </div>
          
          <div className="us12-select-wrapper">
            <select className="us12-select" defaultValue="todas" style={{ padding: '0.625rem 1rem', fontSize: '0.8125rem' }}>
              <option value="todas">Todas las Facultades</option>
            </select>
            <ChevronDown size={16} className="us12-select-icon" />
          </div>
        </div>

        {/* Smart Match Banner */}
        <div className="us12-smart-banner">
          <Sparkles size={16} className="us12-smart-icon" />
          <div>
            <h3 className="us12-smart-title">Smart Match Activado</h3>
            <p className="us12-smart-desc">Priorizamos cupos que liberan tus zonas prohibidas y respetan tus tiempos de traslado</p>
          </div>
        </div>

        {/* List */}
        <div className="us12-list-container">
          
          {/* Card 1 */}
          <div className="us12-match-card" onClick={onMatch} style={{ cursor: 'pointer' }}>
            <div className="us12-match-header">
              <h3 className="us12-match-title">Cálculo Diferencial</h3>
              <span className="us12-badge-anon">Anónimo</span>
            </div>
            <p className="us12-match-meta">Grupo A2 • Ingeniería</p>
            <p className="us12-match-schedule">Lunes 08:00 - 10:00</p>
            
            <div className="us12-match-stats">
              <div className="us12-match-pct">
                <Activity size={14} />
                95% Compatible
              </div>
              <span className="us12-match-tag green">Excelente Match</span>
            </div>
            
            <div className="us12-match-footer">
              <Sparkles size={12} className="us12-match-footer-icon" />
              <span>Este intercambio libera tu bloque de trabajo del Lunes</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="us12-match-card" onClick={onMatch} style={{ cursor: 'pointer' }}>
            <div className="us12-match-header">
              <h3 className="us12-match-title">Programación Orientada a Objetos</h3>
            </div>
            <p className="us12-match-meta">Grupo B1 • Ingeniería</p>
            <p className="us12-match-schedule">Martes 14:00 - 16:00</p>
            
            <div className="us12-match-stats">
              <div className="us12-match-pct">
                <Activity size={14} />
                87% Compatible
              </div>
              <span className="us12-match-tag blue">Buen Match</span>
            </div>
            
            <div className="us12-match-footer">
              <Sparkles size={12} className="us12-match-footer-icon" />
              <span>Este intercambio libera tu bloque de trabajo del Lunes</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="us12-match-card" onClick={onMatch} style={{ cursor: 'pointer' }}>
            <div className="us12-match-header">
              <h3 className="us12-match-title">Física Mecánica</h3>
              <span className="us12-badge-anon">Anónimo</span>
            </div>
            <p className="us12-match-meta">Grupo C3 • Ciencias</p>
            <p className="us12-match-schedule">Miércoles 10:00 - 12:00</p>
          </div>

        </div>

      </div>
    </div>
  );
}
