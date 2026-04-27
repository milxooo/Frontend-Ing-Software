import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onNavigate: (section: string) => void;
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeSection, onNavigate, onLogout }) => {
  const menuItems = [
    { id: 'overview', label: 'Resumen', icon: 'dashboard' },
    { id: 'academic', label: 'Carga Académica [US-02]', icon: 'account_balance' },
    { id: 'scheduler', label: 'Arquitecto IA [US-05]', icon: 'psychology' },
    { id: 'marketplace', label: 'Mercado Swaps [US-10/11]', icon: 'swap_horiz' },
    { id: 'profile', label: 'Mi Perfil [US-01/03]', icon: 'person' },
  ];

  return (
    <div className="flex min-h-screen bg-background font-body text-on-surface antialiased">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-950/40 backdrop-blur-2xl border-r border-white/5 flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <div className="text-2xl font-display font-bold tracking-tighter text-white flex items-center gap-2">
            <span className="text-primary material-symbols-outlined text-3xl">auto_awesome</span>
            OptimaAcademia
          </div>
        </div>

        <nav className="flex-grow px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                activeSection === item.id 
                  ? 'bg-primary-container text-on-primary-container shadow-lg shadow-primary/20' 
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined ${activeSection === item.id ? '' : 'text-primary/70 group-hover:text-primary'}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
              {activeSection === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-on-primary-container" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-surface-container rounded-3xl p-4 border border-white/5 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-tertiary flex items-center justify-center text-white font-bold">
                SP
              </div>
              <div className="flex-grow overflow-hidden">
                <div className="text-sm font-bold text-white truncate">Santiago Parra</div>
                <div className="text-xs text-on-surface-variant truncate">Estudiante Ingeniería</div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-error hover:bg-error/10 transition-all duration-300"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-background/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <span className="text-on-surface-variant capitalize">{activeSection}</span>
            <span className="text-white/20">/</span>
            <span className="text-white font-bold">
              {menuItems.find(i => i.id === activeSection)?.label || 'Overview'}
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              SIA Sincronizado
            </div>
            <button className="material-symbols-outlined text-on-surface-variant hover:text-white transition-colors">notifications</button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
