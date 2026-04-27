import React, { useState } from 'react'
import LandingPage from './LandingPage'

function App() {
  const [showDashboard, setShowDashboard] = useState(false)

  if (!showDashboard) {
    return <LandingPage onStart={() => setShowDashboard(true)} />
  }

  return (
    <div className="min-h-screen bg-background text-on-surface p-8 flex flex-col items-center justify-center font-body">
      <div className="max-w-4xl w-full text-center space-y-8 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tighter text-white">
          Dashboard <span className="text-primary">OptimaAcademia</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-8 text-left space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-primary">analytics</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-white">Estado del Sistema</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Todos los motores de IA están operativos y sincronizados con el SIA.
            </p>
          </div>
          
          <div className="glass-card p-8 text-left space-y-4">
            <div className="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center border border-tertiary/20">
              <span className="material-symbols-outlined text-tertiary">person</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-white">Tu Perfil</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Santiago Parra • Ingeniería de Software
            </p>
          </div>
        </div>

        <button 
          onClick={() => setShowDashboard(false)}
          className="mt-12 bg-surface-container text-on-surface hover:bg-white/10 px-8 py-3 rounded-full font-semibold transition-all border border-white/5"
        >
          Volver a la Landing
        </button>
      </div>
    </div>
  )
}

export default App
