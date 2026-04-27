import { ArrowLeft } from 'lucide-react';
import '../styles/us12.css';

interface MarketplaceMatchProps {
  onBack: () => void;
}

export function MarketplaceMatch({ onBack }: MarketplaceMatchProps) {
  return (
    <div className="us12-app">
      <div className="us12-container">
        
        {/* Debug Header (from Mockup) */}
        <div className="us12-debug-header pink" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="us12-debug-title">Pantalla 3</h2>
            <p className="us12-debug-subtitle">Detalle de Match (Comparación)</p>
          </div>
        </div>

        {/* Empty State Body */}
        <div className="us12-empty-state">
          Match no encontrado
        </div>

      </div>
    </div>
  );
}
