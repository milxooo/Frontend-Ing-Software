import { useState } from 'react'
import { MarketplacePublish } from './components/MarketplacePublish'
import { MarketplaceExplore } from './components/MarketplaceExplore'
import { MarketplaceMatch } from './components/MarketplaceMatch'

function App() {
  const [currentView, setCurrentView] = useState<'menu' | 'us12_publish' | 'us12_explore' | 'us12_match'>('menu');

  if (currentView === 'us12_publish') {
    return <MarketplacePublish onBack={() => setCurrentView('menu')} onExplore={() => setCurrentView('us12_explore')} />;
  }
  if (currentView === 'us12_explore') {
    return <MarketplaceExplore onBack={() => setCurrentView('us12_publish')} onMatch={() => setCurrentView('us12_match')} />;
  }
  if (currentView === 'us12_match') {
    return <MarketplaceMatch onBack={() => setCurrentView('us12_explore')} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <header className="mb-12 text-center animate-fade-in">
        <h1 className="neon-text mb-2">Enrollment Optimizer</h1>
        <p className="text-slate-400 text-lg">Plataforma Inteligente de Gestión Académica</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {/* US-01: Zonas Prohibidas */}
        <div className="glass-panel p-8 flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/30">
            <span className="text-3xl">🚫</span>
          </div>
          <h3 className="text-xl font-bold mb-3">Zonas Prohibidas</h3>
          <p className="text-slate-400 mb-6 flex-grow">Mapea tus compromisos laborales y de bienestar para optimizar tu tiempo.</p>
          <button className="btn-primary w-full">Configurar US-01</button>
        </div>

        {/* US-02: Sincronización Académica */}
        <div className="glass-panel p-8 flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/30">
            <span className="text-3xl">🔄</span>
          </div>
          <h3 className="text-xl font-bold mb-3">Sincronización</h3>
          <p className="text-slate-400 mb-6 flex-grow">Importa tu historial académico directamente desde el sistema universitario.</p>
          <button className="btn-primary w-full">Sincronizar US-02</button>
        </div>

        {/* US-12: Marketplace de Cupos */}
        <div className="glass-panel p-8 flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/30">
            <span className="text-3xl">🤝</span>
          </div>
          <h3 className="text-xl font-bold mb-3">Marketplace</h3>
          <p className="text-slate-400 mb-6 flex-grow">Publica cupos que no te sirven y encuentra intercambios proactivos.</p>
          <button className="btn-primary w-full" onClick={() => setCurrentView('us12_publish')}>Ir al Mercado US-12</button>
        </div>
      </main>

      <footer className="mt-20 text-slate-500 text-sm">
        © 2026 Arquitecto de Horarios • Ingeniería de Software
      </footer>
    </div>
  )
}

export default App
