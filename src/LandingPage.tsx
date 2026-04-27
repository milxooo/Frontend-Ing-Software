import React from 'react';

/**
 * OptimaAcademia Landing Page - US-Ready Edition
 * Este componente representa el inicio profesional del proyecto.
 */
const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-[#e4e1ed] font-sans selection:bg-indigo-500/30">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between h-16 px-6 max-w-7xl mx-auto">
          <div className="text-2xl font-bold tracking-tighter text-white bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            OptimaAcademia
          </div>
          <div className="hidden md:flex items-center gap-x-8">
            <a className="text-slate-400 hover:text-white transition-colors" href="#features">Funciones</a>
            <a className="text-slate-400 hover:text-white transition-colors" href="#tech">Tecnología</a>
            <a className="text-slate-400 hover:text-white transition-colors" href="#team">Equipo</a>
          </div>
          <button 
            onClick={onStart}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-full font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            Empezar a Optimizar
          </button>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden px-6">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <span className="text-xs font-medium text-indigo-300 tracking-wider uppercase">AI Engine v2.0 Live</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-extrabold leading-tight mb-8 tracking-tighter text-white">
              Horarios Inteligentes.<br/>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent italic">Sin Conflictos.</span>
            </h1>
            
            <p className="text-slate-400 max-w-2xl mx-auto mb-12 text-lg md:text-xl leading-relaxed">
              La plataforma definitiva para gestionar matrículas académicas. Sincroniza tu historial, optimiza tu tiempo y encuentra el intercambio perfecto con seguridad criptográfica.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={onStart}
                className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl hover:shadow-indigo-500/10"
              >
                Acceder al Dashboard
              </button>
              <button className="flex items-center gap-2 text-white font-semibold group px-8 py-4">
                Ver Video Demo
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* Value Prop / Bento Grid Section */}
        <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* US-05: AI Scheduling */}
            <div className="md:col-span-8 bg-slate-900/50 border border-white/5 backdrop-blur-md rounded-[2rem] p-10 flex flex-col justify-between group overflow-hidden relative">
              <div className="relative z-10">
                <div className="text-indigo-400 mb-6 text-4xl">智能</div>
                <h3 className="text-3xl font-bold mb-4 text-white">Arquitecto de Horarios (IA)</h3>
                <p className="text-slate-400 max-w-md text-lg leading-relaxed">
                  Generación automática de propuestas basadas en tus zonas prohibidas y prioridad académica. Resolución de conflictos en milisegundos.
                </p>
              </div>
              <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
            </div>

            {/* US-02: Sync */}
            <div className="md:col-span-4 bg-indigo-600 rounded-[2rem] p-10 flex flex-col justify-end group">
              <h3 className="text-2xl font-bold mb-4 text-white">Sincronización Total</h3>
              <p className="text-indigo-100/80 leading-relaxed">
                Conexión directa con SIA/Banner. Carga tu historial académico y prerrequisitos de forma instantánea y segura.
              </p>
            </div>

            {/* US-12: Marketplace */}
            <div className="md:col-span-4 bg-slate-900/50 border border-white/5 rounded-[2rem] p-8 hover:border-indigo-500/50 transition-all">
              <h3 className="text-xl font-bold mb-2 text-white">Marketplace de Swaps</h3>
              <p className="text-slate-400 text-sm">Intercambia cupos de forma proactiva con otros estudiantes mediante Smart Matching.</p>
            </div>

            {/* US-10/11: Confirmation & Legal */}
            <div className="md:col-span-4 bg-slate-900/50 border border-white/5 rounded-[2rem] p-8 hover:border-indigo-500/50 transition-all">
              <h3 className="text-xl font-bold mb-2 text-white">Formalización Legal</h3>
              <p className="text-slate-400 text-sm">Garantía mutua y registro oficial en el sistema universitario con firma digital.</p>
            </div>

            {/* US-04: Security */}
            <div className="md:col-span-4 bg-slate-900/50 border border-white/5 rounded-[2rem] p-8 hover:border-indigo-500/50 transition-all">
              <h3 className="text-xl font-bold mb-2 text-white">Cifrado Militar</h3>
              <p className="text-slate-400 text-sm">Tus datos personales y horarios están protegidos con cifrado AES-256 de extremo a extremo.</p>
            </div>

          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>© 2024 OptimaAcademia. Proyecto Ingeniería de Software. Universidad Nacional.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
