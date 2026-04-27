import { useState } from 'react';
import { ArrowLeft, Info, Key, MapPin, Zap } from 'lucide-react';
import '../styles/us07.css';

interface SlotSelectionProps {
  onBack: () => void;
  onConfirm: () => void;
}

export function SlotSelection({ onBack, onConfirm }: SlotSelectionProps) {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  return (
    <div className="us07-app">
      <div className="us07-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
        <div className="us07-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="us07-bell-btn" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.625rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.125rem' }}>
              RF-07.5 • Selección Prioritaria
            </div>
            <h1 className="us07-title" style={{ fontSize: '1.125rem' }}>Selección de Cupo</h1>
          </div>
          <button className="us07-bell-btn">
            <Info size={20} />
          </button>
        </div>

        <div className="us07-content" style={{ flex: 1, marginTop: '0.5rem' }}>
          {/* Top Red Card */}
          <div className="us07-slot-hero">
            <div className="us07-slot-hero-bg"></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 10 }}>
              <div>
                <div className="us07-subject-badges">
                  <span className="us07-badge" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>MAT301</span>
                  <span className="us07-badge" style={{ border: '1px solid #facc15', color: '#facc15', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Key size={10} /> LLAVE CURRICULAR
                  </span>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.25rem', marginTop: 0 }}>Cálculo Diferencial</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.6875rem', fontWeight: 500, margin: 0 }}>4 créditos • Sem. 3 • 2 intentos previos</p>
              </div>
              
              <div className="us07-ic-circle">
                <div className="us07-slot-hero-ic">
                  <span className="us07-slot-hero-ic-val">0.95</span>
                </div>
                <span style={{ color: 'white', fontSize: '0.5625rem', fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase' }}>criticidad</span>
                <span style={{ color: 'white', fontSize: '0.5625rem', fontWeight: 900, padding: '0.125rem 0.5rem', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.3)', marginTop: '0.25rem' }}>CRÍTICO</span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
                <div className="us07-dot" style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}></div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>3 cupos disponibles de 35</span>
              </div>
              <div className="us07-slot-bar-bg">
                <div className="us07-slot-bar-fill" style={{ width: '8.5%' }}></div>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="us07-slot-options">
            <h3 className="us07-card-title" style={{ marginBottom: '1rem' }}>Elige tu franja horaria</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Option 1: Conflict */}
              <div 
                className={`us07-slot-option ${selectedSlot === 1 ? 'yellow' : ''}`}
                onClick={() => setSelectedSlot(1)}
              >
                <div className="us07-opt-row">
                  <div className="us07-opt-time-box yellow">
                    <span className="us07-opt-time-day">Lun</span>
                    <span className="us07-opt-time-hr">08:00</span>
                  </div>
                  <div className="us07-opt-info">
                    <h4 className="us07-opt-title">Lunes • 08:00–10:00</h4>
                    <div className="us07-opt-meta">
                      <span className="us07-opt-loc"><MapPin size={12} /> A-201</span>
                      <span className="us07-badge" style={{ backgroundColor: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.5625rem' }}>
                        <Zap size={10} /> Zona Bienestar
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '0.5rem' }}>
                    <div className="us07-opt-radio">
                      {selectedSlot === 1 && <div className="us07-opt-radio-inner"></div>}
                    </div>
                  </div>
                </div>

                <div className="us07-conflict-strip">
                  <div className="us07-conflict-item green">♡ Bienestar US-01</div>
                  <div className="us07-conflict-item orange">⚠ CONFLICTO</div>
                  <div className="us07-conflict-item red">⏱ Cálculo Dif.</div>
                </div>
              </div>

              {/* Option 2: Available */}
              <div 
                className={`us07-slot-option ${selectedSlot === 2 ? 'blue' : ''}`}
                onClick={() => setSelectedSlot(2)}
              >
                <div className="us07-opt-row">
                  <div className="us07-opt-time-box blue">
                    <span className="us07-opt-time-day">Mie</span>
                    <span className="us07-opt-time-hr">14:00</span>
                  </div>
                  <div className="us07-opt-info">
                    <h4 className="us07-opt-title">Miércoles • 14:00–16:00</h4>
                    <div className="us07-opt-meta">
                      <span className="us07-opt-loc"><MapPin size={12} /> B-105</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '0.5rem' }}>
                    <div className="us07-opt-radio">
                      {selectedSlot === 2 && <div className="us07-opt-radio-inner"></div>}
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: '#fafafa', marginTop: '1rem' }}>
          <button 
            className={`us07-btn us07-btn-full ${selectedSlot ? 'blue' : 'disabled'}`}
            disabled={!selectedSlot}
            onClick={onConfirm}
          >
            {selectedSlot ? 'Confirmar Selección' : 'Selecciona una franja horaria'}
          </button>
        </div>
      </div>
    </div>
  );
}
