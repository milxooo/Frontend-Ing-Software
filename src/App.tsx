import { useState } from 'react'
import { RiskDashboard } from './components/RiskDashboard'
import { SlotSelection } from './components/SlotSelection'
import { PriorityQueue } from './components/PriorityQueue'

function App() {
  const [currentView, setCurrentView] = useState<'menu' | 'us07_risk' | 'us07_slot' | 'us07_priority'>('menu');

  if (currentView === 'us07_risk') {
    return (
      <div style={{ position: 'relative' }}>
        <button 
          style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 50, backgroundColor: 'white', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', color: '#4b5563', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', cursor: 'pointer' }}
          onClick={() => setCurrentView('menu')}
        >
          Volver al Menú
        </button>
        <RiskDashboard onSelectSubject={() => setCurrentView('us07_slot')} />
      </div>
    );
  }

  if (currentView === 'us07_slot') {
    return (
      <div style={{ position: 'relative' }}>
        <button 
          style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 50, backgroundColor: 'white', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', color: '#4b5563', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', cursor: 'pointer' }}
          onClick={() => setCurrentView('menu')}
        >
          Volver al Menú
        </button>
        <SlotSelection onBack={() => setCurrentView('us07_risk')} onConfirm={() => setCurrentView('menu')} />
      </div>
    );
  }

  if (currentView === 'us07_priority') {
    return (
      <div style={{ position: 'relative' }}>
        <button 
          style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 50, backgroundColor: 'white', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', color: '#4b5563', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', cursor: 'pointer' }}
          onClick={() => setCurrentView('menu')}
        >
          Volver al Menú
        </button>
        <PriorityQueue onSelectSubject={() => setCurrentView('us07_slot')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-white">
      <header className="mb-12 text-center animate-fade-in">
        <h1 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Enrollment Optimizer</h1>
        <p className="text-slate-400 text-lg">Plataforma Inteligente de Gestión Académica</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* US-07: Riesgo Académico */}
        <div className="bg-slate-800 rounded-3xl p-8 flex flex-col items-center text-center shadow-xl border border-slate-700">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-6 border border-red-500/30">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold mb-3">Panel de Riesgo (US-07)</h3>
          <p className="text-slate-400 mb-6 flex-grow">Visualiza el impacto de las materias reprobadas en tu trayectoria (Mockups 1.1, 1.2, 1.3).</p>
          <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors" onClick={() => setCurrentView('us07_risk')}>
            Ver Panel de Riesgo
          </button>
        </div>

        {/* US-07: Cola Prioritaria */}
        <div className="bg-slate-800 rounded-3xl p-8 flex flex-col items-center text-center shadow-xl border border-slate-700">
          <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/30">
            <span className="text-3xl">⚡</span>
          </div>
          <h3 className="text-xl font-bold mb-3">Cola Prioritaria (US-07)</h3>
          <p className="text-slate-400 mb-6 flex-grow">Gestiona proactivamente la asignación de materias en riesgo crítico (Mockup 3).</p>
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors" onClick={() => setCurrentView('us07_priority')}>
            Ver Cola Prioritaria
          </button>
        </div>
      </main>

      <footer className="mt-20 text-slate-500 text-sm">
        © 2026 Arquitecto de Horarios • Ingeniería de Software
      </footer>
    </div>
  )
}

export default App
