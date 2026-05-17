import React from 'react';

/**
 * OptimaAcademia Landing Page - Architect Edition
 * Ubicación: src/pages/LandingPage.tsx
 */
const LandingPage: React.FC<{ onStart: () => void; onLoginClick: () => void }> = ({ onStart, onLoginClick }) => {
  return (
    <div className="min-h-screen font-body antialiased">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 shadow-2xl shadow-indigo-500/5 font-manrope">
        <div className="flex items-center justify-between h-16 px-6 max-w-7xl mx-auto">
          <div className="text-2xl font-bold tracking-tighter text-white font-display">OptimaAcademia</div>
          <div className="hidden md:flex items-center gap-x-10">
            <a className="text-primary font-bold transition-all duration-300" href="#">Plataforma</a>
            <a className="text-slate-400 font-semibold hover:text-white transition-all duration-300" href="#">Funciones</a>
            <a className="text-slate-400 font-semibold hover:text-white transition-all duration-300" href="#">Soluciones</a>
            <a className="text-slate-400 font-semibold hover:text-white transition-all duration-300" href="#">Precios</a>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onLoginClick}
              className="text-slate-400 font-bold px-4 py-2 hover:text-white transition-colors cursor-pointer"
            >
              Entrar
            </button>
            <button 
              onClick={onStart}
              className="bg-primary text-slate-950 px-8 py-2.5 rounded-full font-bold scale-100 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 cursor-pointer"
            >
              Empezar
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden px-6">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/15 rounded-full blur-[140px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">NUEVO: MOTOR IA V2.0 ACTIVADO</span>
            </div>
            
            <h1 className="font-display text-6xl md:text-[9rem] leading-[0.9] mb-10 tracking-tighter text-white font-extrabold">
              Horarios.<br/>
              <span className="bg-gradient-to-r from-primary via-indigo-400 to-primary bg-clip-text text-transparent italic font-light">Inteligentes.</span>
            </h1>
            
            <p className="text-slate-400 max-w-2xl mx-auto mb-14 text-xl md:text-2xl leading-relaxed font-medium">
              Experimenta la precisión académica definitiva. OptimaAcademia utiliza redes neuronales de vanguardia para sincronizar tu vida universitaria sin fricciones.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <button 
                onClick={onStart}
                className="bg-primary text-white px-12 py-6 rounded-full font-black text-xl hover:shadow-[0_0_40px_rgba(73,75,214,0.4)] transition-all transform hover:-translate-y-1"
              >
                Empezar a Optimizar
              </button>
              <button className="flex items-center gap-3 text-white font-bold group px-8 py-5 text-lg">
                Ver Presentación
                <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">play_circle</span>
              </button>
            </div>
          </div>

          <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-full max-w-7xl aspect-video glass-card overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border-white/5">
            <img 
              className="w-full h-full object-cover opacity-30 mix-blend-overlay" 
              alt="Background logic" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8z3Cz8Rn7YRkHNKufTKaFnMbYTqBZoULdY0uJpvB7myo3c495Doj2VAmEp0JA4H0XZFLZsTw2YvlqCdzP7L1hDypDld4UxMn0wpDy16TfE1xTU8e9raXAvoc37GAFBuQ4mYKZ5TtYoNoSMFhGDm4Mk5EmH57UjzUSV_EQ2D51xBQT8ant5lmAkjQvsPSCzFMQmiueGkO0dfjmbHMXrsijcep-sOQ3bv7Yhayl3WovrZ6fKHDz1zueOMJLIG17aCDe-zCr9jkQRqg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
          </div>
        </section>

        {/* Bento Grid */}
        <section className="py-40 px-6 max-w-7xl mx-auto mt-64">
          <div className="text-center mb-32">
            <h2 className="font-display text-5xl md:text-7xl mb-8 font-bold tracking-tight">Diseño de Élite.</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-xl font-medium">Nuestra plataforma integra las herramientas más sofisticadas para la gestión académica institucional de la Sergio Arboleda.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 glass-card p-12 flex flex-col justify-between group relative overflow-hidden border-white/5">
              <div className="relative z-10">
                <span className="material-symbols-outlined text-primary text-6xl mb-8" style={{ fontVariationSettings: "'FILL' 1" }}>neurology</span>
                <h3 className="font-display text-4xl mb-6 text-white font-bold">Algoritmos de IA</h3>
                <p className="text-slate-400 max-w-md text-xl leading-relaxed">
                  Resuelve conflictos de horarios en milisegundos. Nuestra IA considera disponibilidad docente, capacidad de aulas y tus preferencias automáticamente.
                </p>
              </div>
              <div className="absolute -bottom-20 -right-20 w-96 h-96 opacity-10 group-hover:opacity-30 transition-all duration-1000">
                <img 
                  className="w-full h-full object-contain rotate-12" 
                  alt="Pattern" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6WVY8chaETMnI8HIQtZMELBV3ewS1fbwjLTIMyd7ETzA7uzFFeifVpRsQiUHoX-MMauVKqhEX4LDE6B1MUTx2DuMAiggvQ1uuXZEkscROEs5e51E7sMtM2iQl-1pqdNv9zStuLjQd67MNJjgwt8U5EO5DmrVe_zK4ybKSysEe05-NIcdun1PK8nxmr-AhBy2zmwFNRATjXKkRROD8Qcr_-WWTkf98lBoiniL1HUdQzefvUjjb9FPYLZ1Qe421kaFhYCIjdkuGSmA"
                />
              </div>
            </div>

            <div className="md:col-span-4 bg-primary text-white rounded-[2.5rem] p-12 flex flex-col justify-end group hover:shadow-[0_0_50px_rgba(73,75,214,0.3)] transition-all">
              <span className="material-symbols-outlined text-7xl mb-12" style={{ fontVariationSettings: "'FILL' 1" }}>biotech</span>
              <h3 className="font-display text-3xl mb-4 font-bold">Precisión Total</h3>
              <p className="text-white/80 text-lg leading-relaxed font-medium">
                Análisis de datos que empoderan a los estudiantes para enfocarse en lo que importa: aprender.
              </p>
            </div>

            <div className="md:col-span-4 glass-card p-10 flex flex-col items-start hover:border-primary/50 transition-all border-white/5">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                <span className="material-symbols-outlined text-primary text-4xl">analytics</span>
              </div>
              <h3 className="font-display text-2xl mb-4 text-white font-bold">Lógica Institucional</h3>
              <p className="text-slate-400 text-lg">Mapea jerarquías académicas complejas con absoluta claridad y control.</p>
            </div>

            <div className="md:col-span-4 glass-card p-10 flex flex-col items-start hover:border-primary/50 transition-all border-white/5">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                <span className="material-symbols-outlined text-primary text-4xl">sync_alt</span>
              </div>
              <h3 className="font-display text-2xl mb-4 text-white font-bold">Sincronización</h3>
              <p className="text-slate-400 text-lg">Actualización en tiempo real en todos tus dispositivos y aplicaciones móviles.</p>
            </div>

            <div className="md:col-span-4 glass-card p-10 flex flex-col items-start hover:border-primary/50 transition-all border-white/5">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                <span className="material-symbols-outlined text-primary text-4xl">support_agent</span>
              </div>
              <h3 className="font-display text-2xl mb-4 text-white font-bold">Soporte de Élite</h3>
              <p className="text-slate-400 text-lg">Asistencia dedicada 24/7 para operaciones académicas críticas y urgentes.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-60 px-6">
          <div className="max-w-7xl mx-auto rounded-[4rem] bg-gradient-to-br from-primary via-indigo-950 to-slate-950 p-16 md:p-32 text-center relative overflow-hidden border border-white/10 shadow-3xl">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="relative z-10">
              <h2 className="font-display text-5xl md:text-[6rem] text-white mb-12 tracking-tighter leading-none font-black">¿Listo para optimizar tu carrera?</h2>
              <p className="text-white/70 text-2xl md:text-3xl max-w-3xl mx-auto mb-20 font-medium">
                Únete a los estudiantes de vanguardia que usan OptimaAcademia para simplificar su ecosistema educativo.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                <button 
                  onClick={onStart}
                  className="bg-white text-slate-950 px-16 py-7 rounded-full font-black text-2xl hover:scale-105 transition-all shadow-2xl active:scale-95"
                >
                  Empezar Ahora
                </button>
                <button className="border border-white/30 text-white bg-white/5 backdrop-blur-2xl px-16 py-7 rounded-full font-black text-2xl hover:bg-white/10 transition-all">
                  Contactar Soporte
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-24 mt-auto bg-slate-950 border-t border-white/5 font-manrope">
        <div className="flex flex-col md:flex-row justify-between items-center gap-16 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="text-3xl font-black text-white tracking-tighter font-display">OptimaAcademia</div>
            <div className="text-slate-500 max-w-xs text-center md:text-left font-medium text-base">© 2024 OptimaAcademia. Todos los derechos reservados. Precisión Pedagógica en cada bit.</div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-8">
            <a className="text-slate-400 hover:text-primary transition-all font-bold text-base" href="#">Privacidad</a>
            <a className="text-slate-400 hover:text-primary transition-all font-bold text-base" href="#">Términos</a>
            <a className="text-slate-400 hover:text-primary transition-all font-bold text-base" href="#">Contacto</a>
          </div>
          <div className="flex items-center gap-3 text-slate-400 bg-white/5 px-6 py-3 rounded-full border border-white/10 font-bold">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)] animate-pulse"></span>
            Sistemas Operativos
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
