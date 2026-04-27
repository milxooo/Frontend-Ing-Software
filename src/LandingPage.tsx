import React from 'react';

/**
 * OptimaAcademia Landing Page - Soul Edition
 * Estética: Vercel / Linear (Premium Dark Mode)
 */
const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="min-h-screen font-body antialiased selection:bg-cyan-500/30">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/5 font-manrope">
        <div className="flex items-center justify-between h-16 px-6 max-w-7xl mx-auto">
          <div className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-md shadow-lg shadow-indigo-500/20"></div>
            OptimaAcademia
          </div>
          <div className="hidden md:flex items-center gap-x-8">
            <a className="text-slate-400 text-sm font-medium hover:text-white transition-colors" href="#features">Funciones</a>
            <a className="text-slate-400 text-sm font-medium hover:text-white transition-colors" href="#tech">Tecnología</a>
            <a className="text-slate-400 text-sm font-medium hover:text-white transition-colors" href="#university">UNAL</a>
          </div>
          <button 
            onClick={onStart}
            className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-200 transition-all active:scale-95"
          >
            Empezar ahora
          </button>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-6">
          {/* Ambient Background Lights */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]"></div>
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-[0.2em]">Engineered by Software Experts</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-8xl font-extrabold leading-[1.1] mb-8 tracking-tighter text-white">
              Domina tu Matrícula con<br/>
              <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent italic">
                Inteligencia Artificial
              </span>
            </h1>
            
            <p className="text-slate-400 max-w-2xl mx-auto mb-14 text-lg md:text-xl leading-relaxed font-medium">
              Optimiza tus horarios, evita conflictos y asegura tus cupos con OptimaAcademia. La herramienta diseñada por ingenieros para resolver el caos de la vida universitaria.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={onStart}
                className="glow-button bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-10 py-5 rounded-full font-bold text-lg scale-100 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/25"
              >
                Empezar a Optimizar
              </button>
              <button className="flex items-center gap-2 text-slate-300 font-semibold group px-8 py-5 hover:text-white transition-colors">
                Ver Video Demo
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Card 1: Sincronización */}
            <div className="md:col-span-7 glass-card p-10 flex flex-col justify-between group relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-8 border border-indigo-500/20 group-hover:border-indigo-400/40 transition-colors">
                  <span className="material-symbols-outlined text-indigo-400">sync_alt</span>
                </div>
                <h3 className="font-display text-3xl font-bold mb-4 text-white">Tu historial, al instante.</h3>
                <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                  Conéctate directamente con el portal de la universidad y carga tus materias aprobadas y prerrequisitos en un solo click.
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Card 2: Arquitecto de Horarios */}
            <div className="md:col-span-5 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-10 flex flex-col justify-between shadow-2xl shadow-indigo-500/10 group">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-8 border border-white/10">
                <span className="material-symbols-outlined text-white">neurology</span>
              </div>
              <div>
                <h3 className="font-display text-3xl font-bold mb-4 text-white">Tu horario, tus reglas.</h3>
                <p className="text-indigo-100/80 text-lg leading-relaxed">
                  Define tus Zonas Prohibidas y deja que nuestra IA genere la combinación perfecta sin cruces de horario.
                </p>
              </div>
            </div>

            {/* Card 3: Swap Seguro */}
            <div className="md:col-span-12 glass-card p-10 flex flex-col md:flex-row items-center gap-12 group">
              <div className="flex-1">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-8 border border-cyan-500/20 group-hover:border-cyan-400/40 transition-colors">
                  <span className="material-symbols-outlined text-cyan-400">verified_user</span>
                </div>
                <h3 className="font-display text-4xl font-bold mb-4 text-white">Intercambios con validez legal.</h3>
                <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                  Encuentra el match perfecto para intercambiar cupos y formaliza el swap con firmas digitales y registro oficial en el sistema.
                </p>
              </div>
              <div className="w-full md:w-1/3 aspect-square rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center relative overflow-hidden">
                <span className="material-symbols-outlined text-slate-700 text-9xl absolute -bottom-10 -right-10 rotate-12">handshake</span>
                <div className="relative z-10 text-center p-6">
                  <div className="text-cyan-400 font-mono text-xs mb-2">CRYPTO_SIGNATURE_VERIFIED</div>
                  <div className="h-1 w-32 bg-cyan-400/20 mx-auto rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-cyan-400 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white tracking-tighter">¿Listo para dejar el caos atrás?</h2>
            <button 
              onClick={onStart}
              className="bg-white text-black px-12 py-5 rounded-full font-bold text-xl hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-2xl"
            >
              Empezar a Optimizar
            </button>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 bg-[#020617]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-slate-500 text-sm font-medium text-center md:text-left">
            © 2024 OptimaAcademia. Proyecto de Ingeniería de Software.<br/>
            Universidad Nacional de Colombia.
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-emerald-500/80 text-xs font-bold uppercase tracking-widest bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
