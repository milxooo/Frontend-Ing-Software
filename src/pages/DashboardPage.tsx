import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import ScheduleManager from '../features/schedule/ScheduleManager';
import SwapMarket from '../features/marketplace/SwapMarket';
import ProfileSettings from '../features/profile/ProfileSettings';
import SyncHub from '../features/sync/SyncHub';

/**
 * OptimaAcademia Dashboard Page
 * Main entry point for authenticated users.
 */
const DashboardPage: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 border-l-4 border-primary">
                <div className="text-on-surface-variant text-sm font-medium mb-1">Promedio Acumulado</div>
                <div className="text-4xl font-display font-bold text-white">4.8</div>
              </div>
              <div className="glass-card p-6 border-l-4 border-tertiary">
                <div className="text-on-surface-variant text-sm font-medium mb-1">Créditos Aprobados</div>
                <div className="text-4xl font-display font-bold text-white">124 <span className="text-sm text-on-surface-variant">/ 160</span></div>
              </div>
              <div className="glass-card p-6 border-l-4 border-emerald-500">
                <div className="text-on-surface-variant text-sm font-medium mb-1">Estatus Matrícula</div>
                <div className="text-4xl font-display font-bold text-white">Activo</div>
              </div>
            </div>

            <div className="glass-card p-8">
              <h3 className="text-2xl font-display font-bold text-white mb-6">Próximos Pasos (US-05)</h3>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">event_note</span>
                  </div>
                  <div>
                    <div className="text-white font-bold">Generar Horario Optimizado</div>
                    <div className="text-sm text-on-surface-variant">El algoritmo IA ya tiene tus zonas prohibidas.</div>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveSection('scheduler')}
                  className="bg-primary text-on-primary px-4 py-2 rounded-xl font-bold text-sm hover:brightness-110 transition-all"
                >
                  Abrir Arquitecto
                </button>
              </div>
            </div>
          </div>
        );

      case 'academic':
        return <SyncHub />;

      case 'marketplace':
        return <SwapMarket />;

      case 'scheduler':
        return <ScheduleManager />;

      case 'profile':
        return <ProfileSettings />;

      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant">construction</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-2">Módulo en Construcción</h3>
            <p className="text-on-surface-variant max-w-sm">Este módulo de la arquitectura Feature-Based estará listo pronto.</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout 
      activeSection={activeSection} 
      onNavigate={setActiveSection}
      onLogout={onLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default DashboardPage;
