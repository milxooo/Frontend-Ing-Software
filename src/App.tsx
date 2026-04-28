import { useState } from 'react';
import './index.css';
import US08SeccionesDisponibles from './pages/US08SeccionesDisponibles';
import US09IntercambioSecciones  from './pages/US09IntercambioSecciones';

// ── Tabs definition ────────────────────────────────────────────────────────────
type TabId = 'us08' | 'us09' | 'both';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'us08', label: 'US-08 Secciones',   icon: '📋' },
  { id: 'us09', label: 'US-09 Intercambio', icon: '🔁' },
  { id: 'both', label: 'Vista Completa',    icon: '⚡' },
];

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('both');

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="navbar" role="navigation" aria-label="Navegación principal">
        <a className="navbar-brand" href="#" aria-label="Inicio">
          <span className="navbar-dot" aria-hidden="true" />
          Enrollment Optimizer
        </a>

        <div className="navbar-tabs" role="tablist" aria-label="Módulos">
          {TABS.map(tab => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              className={`navbar-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Content ── */}
      <main className="app-wrapper">
        {/* Hero */}
        <header style={{ marginBottom: '0.5rem' }}>
          <h1>
            {activeTab === 'us08' && 'Secciones Disponibles'}
            {activeTab === 'us09' && 'Intercambio de Secciones'}
            {activeTab === 'both' && 'Gestión Académica'}
          </h1>
          <p style={{ color: 'var(--text-sub)', marginTop: '0.4rem', fontSize: '0.95rem' }}>
            {activeTab === 'us08' && 'Consulta cupos disponibles por materia — endpoint GET /api/secciones/{materiaId}/disponibles'}
            {activeTab === 'us09' && 'Registra solicitudes de intercambio con matching automático — endpoint POST /api/intercambios/registrar'}
            {activeTab === 'both' && 'Plataforma inteligente · US-08 Cupos disponibles · US-09 Matching de intercambios'}
          </p>
        </header>

        {/* Panels */}
        <div
          className="page-grid"
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          {(activeTab === 'us08' || activeTab === 'both') && (
            <US08SeccionesDisponibles />
          )}
          {(activeTab === 'us09' || activeTab === 'both') && (
            <US09IntercambioSecciones />
          )}
        </div>

        {/* Footer */}
        <footer style={{
          marginTop: '3rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--glass-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
        }}>
          <span>© 2026 Enrollment Optimizer · Ingeniería de Software</span>
          <span style={{ display:'flex', gap:'1rem' }}>
            <span>Backend: <code style={{ color:'var(--primary)', fontSize:'0.75rem' }}>localhost:8080</code></span>
            <span>US-08 · US-09</span>
          </span>
        </footer>
      </main>
    </>
  );
}
