import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import SyncHub from './features/sync/SyncHub';
import ScheduleManager from './features/schedule/ScheduleManager';
import SwapMarket from './features/marketplace/SwapMarket';
import FormalizationCertificate from './features/swaps/FormalizationCertificate';

type ViewType = 'landing' | 'sync' | 'schedule' | 'inbox' | 'formalize' | 'profile';

/**
 * App (Director de Orquesta)
 * Gestiona la transición Landing -> Dashboard y la navegación entre US.
 */
const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('landing');

  // Transición desde la Landing Page
  if (view === 'landing') {
    return <LandingPage onStart={() => setView('sync')} />;
  }

  // Mapeo de IDs del DashboardLayout a nuestros ViewTypes
  const handleNavigate = (id: string) => {
    if (id === 'academic') setView('sync');
    else if (id === 'scheduler') setView('schedule');
    else if (id === 'marketplace') setView('inbox');
    else if (id === 'documents') setView('formalize');
    else if (id === 'profile') setView('profile');
    else setView('sync'); // Default
  };

  // El Dashboard Maestro con el contenido de las Historias de Usuario
  return (
    <DashboardLayout 
      activeSection={view === 'sync' ? 'academic' : view === 'schedule' ? 'scheduler' : view === 'inbox' ? 'marketplace' : view === 'formalize' ? 'documents' : 'profile'} 
      onNavigate={handleNavigate}
      onLogout={() => setView('landing')}
    >
      {view === 'sync' && <SyncHub />}
      {view === 'schedule' && <ScheduleManager />}
      {view === 'inbox' && <SwapMarket />}
      {view === 'formalize' && (
        <FormalizationCertificate 
          matchId="SW-98234-MART"
          studentA="Roberto A. Martínez"
          studentB="Elena L. García"
          subjectA="Criptografía I"
          subjectB="Sistemas Distribuidos"
          status="APROBADO"
        />
      )}
      {/* Fallback para perfil u otras vistas */}
      {view === 'profile' && (
        <div className="flex items-center justify-center min-h-[60vh] text-slate-500 italic">
          Configuraciones de Perfil (US-01/03) cargando...
        </div>
      )}
    </DashboardLayout>
  );
};

export default App;
