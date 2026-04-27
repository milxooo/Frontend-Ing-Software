import React, { useState } from 'react'
import LandingPage from './LandingPage'

function App() {
  const [showDashboard, setShowDashboard] = useState(false)

  if (!showDashboard) {
    return <LandingPage onStart={() => setShowDashboard(true)} />
  }

  return (
    <div className="min-h-screen bg-background text-on-surface p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-display text-primary mb-8">Dashboard de OptimaAcademia</h1>
      <p className="text-on-surface-variant mb-12">Bienvenido a la plataforma de gestión académica.</p>
      
      <button 
        onClick={() => setShowDashboard(false)}
        className="bg-secondary text-on-secondary px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-all"
      >
        Volver a la Landing
      </button>
    </div>
  )
}

export default App


