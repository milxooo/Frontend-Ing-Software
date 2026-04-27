import React, { useState } from 'react'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  const [showDashboard, setShowDashboard] = useState(false)

  return (
    <>
      {showDashboard ? (
        <DashboardPage onLogout={() => setShowDashboard(false)} />
      ) : (
        <LandingPage onStart={() => setShowDashboard(true)} />
      )}
    </>
  )
}

export default App
