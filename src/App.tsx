import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import SyncHub from './features/sync/SyncHub';
import ScheduleManager from './features/schedule/ScheduleManager';
import SwapMarket from './features/marketplace/SwapMarket';
import FormalizationCertificate from './features/swaps/FormalizationCertificate';
import US08SeccionesDisponibles from './pages/US08SeccionesDisponibles';
import US09IntercambioSecciones from './pages/US09IntercambioSecciones';
import US13Sugerencias from './pages/US13Sugerencias';
import { AcademicPriority } from './features/academic-priority';

type ViewType =
  | 'landing'
  | 'sync'
  | 'priority'
  | 'schedule'
  | 'inbox'
  | 'formalize'
  | 'profile'
  | 'sections'
  | 'swaps'
  | 'suggestions';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('landing');

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('sync')} />;
  }

  const handleNavigate = (id: string) => {
    if (id === 'academic') setView('sync');
    else if (id === 'priority') setView('priority');
    else if (id === 'sections') setView('sections');
    else if (id === 'swaps') setView('swaps');
    else if (id === 'scheduler') setView('schedule');
    else if (id === 'marketplace') setView('inbox');
    else if (id === 'documents') setView('formalize');
    else if (id === 'profile') setView('profile');
    else if (id === 'suggestions') setView('suggestions');
    else setView('sync');
  };

  return (
    <DashboardLayout
      activeSection={
        view === 'sync' ? 'academic' :
        view === 'priority' ? 'priority' :
        view === 'sections' ? 'sections' :
        view === 'swaps' ? 'swaps' :
        view === 'schedule' ? 'scheduler' :
        view === 'inbox' ? 'marketplace' :
        view === 'formalize' ? 'documents' :
        view === 'suggestions' ? 'suggestions' : 'profile'
      }
      onNavigate={handleNavigate}
      onLogout={() => setView('landing')}
    >
      {view === 'sync' && <SyncHub />}
      {view === 'priority' && <AcademicPriority />}
      {view === 'sections' && <US08SeccionesDisponibles />}
      {view === 'swaps' && <US09IntercambioSecciones />}
      {view === 'suggestions' && <US13Sugerencias />}
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
      {view === 'profile' && (
        <div className="flex items-center justify-center min-h-[60vh] text-slate-500 italic">
          Configuraciones de Perfil (US-01/03) cargando...
        </div>
      )}
    </DashboardLayout>
  );
};

export default App;
