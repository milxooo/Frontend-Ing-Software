import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { syncAcademicHistory } from '../services/api';

/**
 * OptimaAcademia Dashboard Page
 * Main entry point for authenticated users.
 */
const DashboardPage: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // US-02: Realizamos la llamada al servicio de sincronización
      await syncAcademicHistory('santiago-123', 'TOKEN_UNIVERSITARIO_PRO_2026');
      setSyncStatus('success');
    } catch (error) {
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
    }
  };

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
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-display font-bold text-white mb-4">Sincronización Académica (US-02)</h2>
              <p className="text-on-surface-variant mb-8">Conecta tu cuenta institucional para importar tu historia académica, prerrequisitos y cupos disponibles.</p>
              
              <div className="glass-card p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface-variant">Token Institucional (SIA/Banner)</label>
                  <input 
                    type="password" 
                    defaultValue="••••••••••••••••••••"
                    className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                
                <button 
                  onClick={handleSync}
                  disabled={isSyncing}
                  className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    isSyncing ? 'bg-surface-container text-on-surface-variant' : 'bg-primary text-on-primary hover:brightness-110 shadow-lg shadow-primary/20'
                  }`}
                >
                  {isSyncing ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">sync</span>
                      Sincronizando con SIA...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">cloud_sync</span>
                      Iniciar Sincronización Pro
                    </>
                  )}
                </button>

                {syncStatus === 'success' && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined">check_circle</span>
                    Historia académica sincronizada con éxito (US-02-OK)
                  </div>
                )}
              </div>
            </div>
          </div>
        );

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
