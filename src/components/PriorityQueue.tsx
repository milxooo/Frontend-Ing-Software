import { AlertTriangle, Key, Users, Heart, BookOpen, RefreshCcw, Zap, ChevronRight } from 'lucide-react';
import '../styles/us07.css';

interface PriorityQueueProps {
  onSelectSubject: (subjectId: string) => void;
}

export function PriorityQueue({ onSelectSubject }: PriorityQueueProps) {
  return (
    <div className="us07-app">
      <div className="us07-container">
        <div className="us07-content">
          
          {/* Header Summary */}
          <div className="us07-pq-summary">
            <div className="us07-pq-icon">
              <AlertTriangle size={24} />
            </div>
            <div className="us07-pq-info">
              <h2 className="us07-pq-title">3 materias en cola prioritaria</h2>
              <p className="us07-pq-desc">Ordenado por <span style={{fontWeight: 700}}>índice de criticidad</span> (IC) descendente • 1 en nivel <span style={{fontWeight: 700}}>CRÍTICO</span></p>
            </div>
            <div className="us07-pq-count">
              3
            </div>
          </div>

          {/* Legend */}
          <div className="us07-pq-legend">
            <h3 className="us07-pq-legend-title">
              <BookOpen size={10} /> Escala Índice de Criticidad (IC)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              <div className="us07-stat-pill red" style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="us07-dot us07-dot-red" style={{ marginBottom: '0.25rem' }}></div>
                <div style={{ fontSize: '0.5625rem', fontWeight: 900, color: '#ef4444', textTransform: 'uppercase' }}>Crítico</div>
                <div style={{ fontSize: '0.5rem', fontWeight: 700, color: '#f87171' }}>≥ 0.80</div>
              </div>
              <div className="us07-stat-pill" style={{ backgroundColor: 'rgba(255, 237, 213, 0.5)', border: '1px solid #fff7ed', borderRadius: '1rem', padding: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div className="us07-dot us07-dot-orange" style={{ marginBottom: '0.25rem' }}></div>
                <div style={{ fontSize: '0.5625rem', fontWeight: 900, color: '#f97316', textTransform: 'uppercase' }}>Alto</div>
                <div style={{ fontSize: '0.5rem', fontWeight: 700, color: '#fb923c' }}>≥ 0.60</div>
              </div>
              <div className="us07-stat-pill yellow" style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="us07-dot us07-dot-yellow" style={{ marginBottom: '0.25rem' }}></div>
                <div style={{ fontSize: '0.5625rem', fontWeight: 900, color: '#ca8a04', textTransform: 'uppercase' }}>Medio</div>
                <div style={{ fontSize: '0.5rem', fontWeight: 700, color: '#eab308' }}>≥ 0.40</div>
              </div>
              <div className="us07-stat-pill" style={{ backgroundColor: 'rgba(220, 252, 231, 0.5)', border: '1px solid #f0fdf4', borderRadius: '1rem', padding: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div className="us07-dot us07-dot-green" style={{ marginBottom: '0.25rem' }}></div>
                <div style={{ fontSize: '0.5625rem', fontWeight: 900, color: '#16a34a', textTransform: 'uppercase' }}>Bajo</div>
                <div style={{ fontSize: '0.5rem', fontWeight: 700, color: '#22c55e' }}>&lt; 0.40</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="us07-filters">
            <button className="us07-filter active">Todas</button>
            <button className="us07-filter inactive"><Key size={12} color="#eab308"/> Llaves</button>
            <button className="us07-filter inactive"><div className="us07-dot us07-dot-red"></div> Cupos bajos</button>
            <button className="us07-filter inactive"><Heart size={12} color="#22c55e"/> Compatible</button>
          </div>

          <div className="us07-filter-meta">
            <span className="us07-filter-count">3 materias encontradas</span>
            <span className="us07-filter-sort"><RefreshCcw size={10} /> Por IC descendente</span>
          </div>

          {/* Priority Subject Card */}
          <div className="us07-subject-card red" style={{ padding: 0, overflow: 'hidden' }}>
            
            <div className="us07-pq-banner">
              <Zap size={12} /> ¡Últimos 3 cupos disponibles!
            </div>

            <div style={{ padding: '1.25rem', position: 'relative' }}>
              <div className="us07-ic-circle" style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
                <div className="us07-ic-val red" style={{ width: '3.5rem', height: '3.5rem', borderWidth: '4px', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1.125rem', lineHeight: 1 }}>0.95</span>
                  <span style={{ fontSize: '0.5rem', fontWeight: 700, color: '#9ca3af' }}>IC</span>
                </div>
                <span className="us07-ic-lbl red">CRÍTICO</span>
              </div>

              <div style={{ paddingRight: '4rem', marginBottom: '1rem' }}>
                <div className="us07-subject-badges">
                  <span className="us07-badge gray">MAT301</span>
                  <span className="us07-badge yellow">
                    <Key size={10} /> CAMINO CRÍTICO
                  </span>
                </div>
                <h3 className="us07-subject-name">Cálculo Diferencial</h3>
                <p className="us07-subject-meta" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  4 créditos • Sem. 3 pensum • <span style={{ color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.125rem' }}><RefreshCcw size={10}/> 2x</span>
                </p>
              </div>

              <div className="us07-progress-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="us07-ps-row">
                  <div className="us07-ps-header">
                    <span className="lbl"><BookOpen size={10}/> Avance</span>
                    <span className="val blue">42%</span>
                  </div>
                  <div className="us07-ps-bar-bg"><div className="us07-ps-bar-fill blue" style={{ width: '42%' }}></div></div>
                </div>
                <div className="us07-ps-row">
                  <div className="us07-ps-header">
                    <span className="lbl"><RefreshCcw size={10}/> Retomas</span>
                    <span className="val red">65%</span>
                  </div>
                  <div className="us07-ps-bar-bg"><div className="us07-ps-bar-fill red" style={{ width: '65%' }}></div></div>
                </div>
              </div>

              <div className="us07-unlocks">
                <Key size={14} className="us07-unlocks-icon" />
                <div className="us07-unlocks-text">
                  <span className="lbl">Desbloquea: </span>
                  <span className="val">Cálculo Integral, Física II, Ecuaciones Dif.</span>
                </div>
              </div>

              <div className="us07-chips">
                <span className="us07-chip yellow">
                  <Zap size={10} color="#eab308" /> Lun 08:00
                </span>
                <span className="us07-chip blue">
                  <div className="us07-dot us07-dot-blue" style={{ backgroundColor: '#3b82f6' }}></div> Mie 14:00
                </span>
                <span className="us07-chip green">
                  <Heart size={10} color="#22c55e" /> Compatible Bienestar
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Users size={14} color="#9ca3af" />
                <div className="us07-progress-bar-bg" style={{ flex: 1, margin: 0 }}>
                  <div className="us07-progress-bar-fill red" style={{ width: '8.5%' }}></div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#ef4444' }}>3/35</span>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <button className="us07-link">
                  Ver docentes disponibles <ChevronRight size={10} />
                </button>
              </div>

              <button 
                className="us07-btn us07-btn-full red"
                onClick={() => onSelectSubject('mat301')}
              >
                <Zap size={16} /> Reservar Cupo Prioritario <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
