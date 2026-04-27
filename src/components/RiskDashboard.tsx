import { useState } from 'react';
import { AlertTriangle, Bell, GraduationCap, Key, RefreshCcw, BookOpen, ChevronRight } from 'lucide-react';
import '../styles/us07.css';

interface RiskDashboardProps {
  onSelectSubject: (subjectId: string) => void;
}

export function RiskDashboard({ onSelectSubject }: RiskDashboardProps) {
  const [activeTab, setActiveTab] = useState<'criticas' | 'historial'>('criticas');

  return (
    <div className="us07-app">
      <div className="us07-container">
        {/* Header */}
        <div className="us07-header">
          <div className="us07-header-top">
            <div>
              <div className="us07-badge-text">
                <AlertTriangle size={14} />
                <span>US-07 • RIESGO ACADÉMICO</span>
              </div>
              <h1 className="us07-title">Panel de Riesgo</h1>
            </div>
            <div className="us07-bell-btn">
              <Bell size={20} />
              <div className="us07-bell-badge">3</div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="us07-profile-card">
            <div className="us07-avatar">SM</div>
            <div className="us07-profile-info">
              <h2 className="us07-profile-name">Santiago Morales</h2>
              <p className="us07-profile-desc">Ingeniería de Sistemas • Sem. 5 • 2025-2</p>
            </div>
            <div className="us07-profile-stats">
              <div className="us07-profile-stats-val">3 materias</div>
              <div className="us07-profile-stats-lbl">en riesgo</div>
            </div>
          </div>
        </div>

        <div className="us07-content">
          {/* Gauge Card */}
          <div className="us07-card">
            <div className="us07-card-header">
              <div>
                <h3 className="us07-card-title">
                  <GraduationCap size={18} color="#9ca3af" />
                  Medidor de Retraso de Grado
                </h3>
                <p className="us07-card-subtitle">Si no se aseguran los cupos críticos este período</p>
              </div>
              <span className="us07-badge-alert">ALERTA</span>
            </div>

            {/* SVG Gauge */}
            <div className="us07-gauge-container">
               <svg viewBox="0 0 200 120" className="us07-gauge-svg">
                 <defs>
                   <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#22c55e" />
                     <stop offset="30%" stopColor="#eab308" />
                     <stop offset="60%" stopColor="#f97316" />
                     <stop offset="100%" stopColor="#ef4444" />
                   </linearGradient>
                 </defs>
                 {/* Background Arc */}
                 <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#f1f5f9" strokeWidth="20" strokeLinecap="round" />
                 {/* Active Arc (goes to ~62.5% representing 2.5/4) */}
                 <path d="M 20 100 A 80 80 0 0 1 150 40" fill="none" stroke="url(#gaugeGrad)" strokeWidth="20" strokeLinecap="round" />
                 
                 {/* Marker for 2.5 */}
                 <circle cx="150" cy="40" r="8" fill="white" stroke="#ef4444" strokeWidth="4" />
                 <circle cx="150" cy="40" r="3" fill="#ef4444" />
               </svg>
               <div className="us07-gauge-text">
                 <span className="us07-gauge-val">2.5</span>
                 <span className="us07-gauge-lbl">semestres en riesgo</span>
               </div>
               
               {/* Legend markings */}
               <div className="us07-gauge-minmax us07-gauge-min">0 sem</div>
               <div className="us07-gauge-minmax us07-gauge-max">4 sem</div>
            </div>

            {/* Legend row */}
            <div className="us07-legend-row">
              <span className="us07-legend-item"><div className="us07-dot us07-dot-green"></div>Sin riesgo</span>
              <span className="us07-legend-item"><div className="us07-dot us07-dot-yellow"></div>Moderado</span>
              <span className="us07-legend-item"><div className="us07-dot us07-dot-orange"></div>Alto</span>
              <span className="us07-legend-item"><div className="us07-dot us07-dot-red"></div>Crítico</span>
            </div>

            {/* Stats pills */}
            <div className="us07-stats-grid">
              <div className="us07-stat-pill red">
                <div className="val">1</div>
                <div className="lbl">Críticas</div>
              </div>
              <div className="us07-stat-pill yellow">
                <div className="val">2</div>
                <div className="lbl">Llaves</div>
              </div>
              <div className="us07-stat-pill blue">
                <div className="val">47%</div>
                <div className="lbl">Avance</div>
              </div>
            </div>
          </div>

          {/* Avance Curricular Progress */}
          <div className="us07-card" style={{ padding: '1.25rem' }}>
            <div className="us07-progress-row">
              <h3 className="us07-card-title" style={{ fontSize: '0.875rem' }}>
                <BookOpen size={16} color="#9ca3af" />
                Avance Curricular
              </h3>
              <span className="us07-progress-val">68 / 160 créditos</span>
            </div>
            <div className="us07-progress-bar-bg">
              <div className="us07-progress-bar-fill blue" style={{ width: '47%' }}>
                 <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
              </div>
            </div>
            <div className="us07-progress-labels">
              <span>Inicio</span>
              <span className="active">47% completado</span>
              <span>Grado</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="us07-tabs">
            <button 
              className={`us07-tab ${activeTab === 'criticas' ? 'active' : ''}`}
              onClick={() => setActiveTab('criticas')}
            >
              Materias Críticas
            </button>
            <button 
              className={`us07-tab ${activeTab === 'historial' ? 'active' : ''}`}
              onClick={() => setActiveTab('historial')}
            >
              Historial Reprobo
            </button>
          </div>

          {/* Content based on tab */}
          {activeTab === 'criticas' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Card 1: Cálculo Diferencial */}
              <div className="us07-subject-card red">
                <div className="us07-subject-header">
                  <div>
                    <div className="us07-subject-badges">
                      <span className="us07-badge gray">MAT301</span>
                      <span className="us07-badge yellow"><Key size={10} /> LLAVE</span>
                      <span className="us07-subject-meta">Sem. 3 • 4 cr</span>
                    </div>
                    <h3 className="us07-subject-name">Cálculo Diferencial</h3>
                  </div>
                  
                  <div className="us07-ic-circle">
                    <div className="us07-ic-val red">
                      <span>0.95</span>
                    </div>
                    <span className="us07-ic-lbl red">CRÍTICO</span>
                  </div>
                </div>

                <div className="us07-attempts">
                  <RefreshCcw size={14} color="#9ca3af" />
                  <span className="us07-attempts-text red">2 intentos previos</span>
                  <span className="us07-attempt-badge red" style={{ marginLeft: '0.25rem' }}>1</span>
                  <span className="us07-attempt-badge red">2</span>
                </div>

                <div className="us07-progress-stats">
                  <div className="us07-ps-row">
                    <div className="us07-ps-header">
                      <span className="lbl"><BookOpen size={12}/> Avance Curricular</span>
                      <span className="val blue">42%</span>
                    </div>
                    <div className="us07-ps-bar-bg"><div className="us07-ps-bar-fill blue" style={{ width: '42%' }}></div></div>
                  </div>
                  <div className="us07-ps-row">
                    <div className="us07-ps-header">
                      <span className="lbl"><RefreshCcw size={12}/> Carga Retomas</span>
                      <span className="val red">65%</span>
                    </div>
                    <div className="us07-ps-bar-bg"><div className="us07-ps-bar-fill red" style={{ width: '65%' }}></div></div>
                  </div>
                </div>

                <div className="us07-unlocks">
                  <Key size={14} className="us07-unlocks-icon" />
                  <div className="us07-unlocks-text">
                    <span className="lbl">Desbloquea: </span>
                    <span className="val">Cálculo Integral - Física II - Ecuaciones Dif.</span>
                  </div>
                </div>

                <div className="us07-action-row">
                  <div className="us07-spots">
                    <div className="us07-dot us07-dot-red"></div>
                    <span className="val red">3 cupos</span>
                    <span className="total">/ 35</span>
                  </div>
                  <button 
                    className="us07-btn red"
                    onClick={() => onSelectSubject('mat301')}
                  >
                    Seleccionar cupo <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Card 2: Física Mecánica */}
              <div className="us07-subject-card orange">
                <div className="us07-subject-header">
                  <div>
                    <div className="us07-subject-badges">
                      <span className="us07-badge gray">FIS201</span>
                      <span className="us07-badge yellow"><Key size={10} /> LLAVE</span>
                      <span className="us07-subject-meta">Sem. 2 • 3 cr</span>
                    </div>
                    <h3 className="us07-subject-name">Física Mecánica</h3>
                  </div>
                  
                  <div className="us07-ic-circle">
                    <div className="us07-ic-val orange">
                      <span>0.78</span>
                    </div>
                    <span className="us07-ic-lbl orange">ALTO</span>
                  </div>
                </div>

                <div className="us07-attempts">
                  <RefreshCcw size={14} color="#9ca3af" />
                  <span className="us07-attempts-text orange">1 intento previo</span>
                  <span className="us07-attempt-badge orange" style={{ marginLeft: '0.25rem' }}>1</span>
                </div>

                <div className="us07-progress-stats">
                  <div className="us07-ps-row">
                    <div className="us07-ps-header">
                      <span className="lbl"><BookOpen size={12}/> Avance Curricular</span>
                      <span className="val blue">52%</span>
                    </div>
                    <div className="us07-ps-bar-bg"><div className="us07-ps-bar-fill blue" style={{ width: '52%' }}></div></div>
                  </div>
                  <div className="us07-ps-row">
                    <div className="us07-ps-header">
                      <span className="lbl"><RefreshCcw size={12}/> Carga Retomas</span>
                      <span className="val orange">40%</span>
                    </div>
                    <div className="us07-ps-bar-bg"><div className="us07-ps-bar-fill orange" style={{ width: '40%' }}></div></div>
                  </div>
                </div>

                <div className="us07-unlocks">
                  <Key size={14} className="us07-unlocks-icon" />
                  <div className="us07-unlocks-text">
                    <span className="lbl">Desbloquea: </span>
                    <span className="val">Física II - Termodinámica</span>
                  </div>
                </div>

                <div className="us07-action-row">
                  <div className="us07-spots">
                    <div className="us07-dot us07-dot-orange"></div>
                    <span className="val orange">8 cupos</span>
                    <span className="total">/ 40</span>
                  </div>
                  <button 
                    className="us07-btn orange"
                  >
                    Seleccionar cupo <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {/* Historial Reprobo View (Imagen 1.3) */}
               <div className="us07-history-card">
                  <div className="us07-history-header">
                    <div>
                      <h3 className="us07-subject-name" style={{ fontSize: '1rem' }}>Cálculo Diferencial</h3>
                      <p className="us07-subject-meta">MAT301 • Semestre 3</p>
                    </div>
                    <div className="us07-history-badge red">2x</div>
                  </div>
                  <div className="us07-history-grid">
                    <div className="us07-ps-row">
                      <div className="us07-ps-header"><span className="lbl">Avance</span><span className="val blue">42%</span></div>
                      <div className="us07-ps-bar-bg" style={{ height: '0.25rem' }}><div className="us07-ps-bar-fill blue" style={{ width: '42%' }}></div></div>
                    </div>
                    <div className="us07-ps-row">
                      <div className="us07-ps-header"><span className="lbl">Retomas</span><span className="val red">65%</span></div>
                      <div className="us07-ps-bar-bg" style={{ height: '0.25rem' }}><div className="us07-ps-bar-fill red" style={{ width: '65%' }}></div></div>
                    </div>
                  </div>
               </div>

               <div className="us07-history-card">
                  <div className="us07-history-header">
                    <div>
                      <h3 className="us07-subject-name" style={{ fontSize: '1rem' }}>Física Mecánica</h3>
                      <p className="us07-subject-meta">FIS201 • Semestre 2</p>
                    </div>
                    <div className="us07-history-badge orange">1x</div>
                  </div>
                  <div className="us07-history-grid">
                    <div className="us07-ps-row">
                      <div className="us07-ps-header"><span className="lbl">Avance</span><span className="val blue">52%</span></div>
                      <div className="us07-ps-bar-bg" style={{ height: '0.25rem' }}><div className="us07-ps-bar-fill blue" style={{ width: '52%' }}></div></div>
                    </div>
                    <div className="us07-ps-row">
                      <div className="us07-ps-header"><span className="lbl">Retomas</span><span className="val orange">40%</span></div>
                      <div className="us07-ps-bar-bg" style={{ height: '0.25rem' }}><div className="us07-ps-bar-fill orange" style={{ width: '40%' }}></div></div>
                    </div>
                  </div>
               </div>

               <div className="us07-history-card">
                  <div className="us07-history-header">
                    <div>
                      <h3 className="us07-subject-name" style={{ fontSize: '1rem' }}>Estructuras de Datos</h3>
                      <p className="us07-subject-meta">PROG301 • Semestre 4</p>
                    </div>
                    <div className="us07-history-badge orange">1x</div>
                  </div>
                  <div className="us07-history-grid">
                    <div className="us07-ps-row">
                      <div className="us07-ps-header"><span className="lbl">Avance</span><span className="val blue">68%</span></div>
                      <div className="us07-ps-bar-bg" style={{ height: '0.25rem' }}><div className="us07-ps-bar-fill blue" style={{ width: '68%' }}></div></div>
                    </div>
                    <div className="us07-ps-row">
                      <div className="us07-ps-header"><span className="lbl">Retomas</span><span className="val orange">30%</span></div>
                      <div className="us07-ps-bar-bg" style={{ height: '0.25rem' }}><div className="us07-ps-bar-fill orange" style={{ width: '30%' }}></div></div>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
