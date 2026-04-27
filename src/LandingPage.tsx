import React from 'react';

/**
 * OptimaAcademia Landing Page - TS Edition
 * Migrated from HTML/Tailwind snippet to React/TypeScript.
 */
const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md selection:bg-primary-container/30 antialiased">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10 shadow-2xl shadow-indigo-500/5 font-manrope tracking-tight">
        <div className="flex items-center justify-between h-16 px-6 max-w-7xl mx-auto">
          <div className="text-xl font-bold tracking-tighter text-slate-50">OptimaAcademia</div>
          <div className="hidden md:flex items-center gap-x-8">
            <a className="text-indigo-400 font-semibold transition-all duration-300" href="#">Platform</a>
            <a className="text-slate-400 font-medium hover:text-indigo-400 hover:bg-white/5 px-3 py-1 rounded transition-all duration-300" href="#">Features</a>
            <a className="text-slate-400 font-medium hover:text-indigo-400 hover:bg-white/5 px-3 py-1 rounded transition-all duration-300" href="#">Solutions</a>
            <a className="text-slate-400 font-medium hover:text-indigo-400 hover:bg-white/5 px-3 py-1 rounded transition-all duration-300" href="#">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 font-medium px-4 py-2 hover:text-indigo-300 transition-colors">Log In</button>
            <button 
              onClick={onStart}
              className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-full font-semibold scale-95 active:scale-90 transition-transform shadow-lg shadow-indigo-500/20"
            >
              Empezar a Optimizar
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex items-center justify-center overflow-hidden px-6">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-tertiary-container/10 rounded-full blur-[100px]"></div>
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-label-md font-medium text-primary uppercase tracking-wider">New: AI Engine v2.0 is live</span>
            </div>
            
            <h1 className="font-display text-[56px] md:text-[84px] leading-tight mb-8 tracking-tighter text-white">
              Smarter Scheduling.<br/>
              <span className="bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent italic">Infinite Possibilities.</span>
            </h1>
            
            <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12 text-lg md:text-xl">
              Experience Precision in Pedagogy. OptimaAcademia leverages advanced neural networks to synchronize complex academic environments with zero friction.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={onStart}
                className="glow-button bg-primary-container text-on-primary-container px-10 py-5 rounded-full font-bold text-lg scale-100 hover:scale-105 active:scale-95 transition-all"
              >
                Empezar a Optimizar
              </button>
              <button className="flex items-center gap-2 text-white font-semibold group px-8 py-5">
                Watch the vision
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">play_circle</span>
              </button>
            </div>
          </div>

          {/* Floating Product Reveal */}
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-video rounded-3xl overflow-hidden border border-white/10 glass-card shadow-3xl shadow-black/50">
            <img 
              className="w-full h-full object-cover opacity-60" 
              alt="Abstract digital rendering" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8z3Cz8Rn7YRkHNKufTKaFnMbYTqBZoULdY0uJpvB7myo3c495Doj2VAmEp0JA4H0XZFLZsTw2YvlqCdzP7L1hDypDld4UxMn0wpDy16TfE1xTU8e9raXAvoc37GAFBuQ4mYKZ5TtYoNoSMFhGDm4Mk5EmH57UjzUSV_EQ2D51xBQT8ant5lmAkjQvsPSCzFMQmiueGkO0dfjmbHMXrsijcep-sOQ3bv7Yhayl3WovrZ6fKHDz1zueOMJLIG17aCDe-zCr9jkQRqg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
          </div>
        </section>

        {/* Value Prop / Bento Grid Section */}
        <section className="py-32 px-6 max-w-7xl mx-auto mt-32">
          <div className="text-center mb-24">
            <h2 className="font-h1 text-4xl md:text-5xl mb-6">Engineered for Excellence</h2>
            <p className="font-body-lg text-on-surface-variant max-w-xl mx-auto">Our platform integrates the most sophisticated tools for institutional management.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
            {/* AI-Driven Scheduling */}
            <div className="md:col-span-8 glass-card rounded-3xl p-10 flex flex-col justify-between group overflow-hidden relative">
              <div className="relative z-10">
                <span className="material-symbols-outlined text-primary text-4xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>neurology</span>
                <h3 className="font-h1 text-3xl mb-4 text-white">AI-Driven Scheduling</h3>
                <p className="text-on-surface-variant max-w-md text-lg leading-relaxed">
                  Solve multi-dimensional constraints in seconds. Our proprietary AI considers teacher availability, room capacity, and student preferences automatically.
                </p>
              </div>
              <div className="absolute bottom-0 right-0 w-3/4 h-3/4 opacity-20 group-hover:opacity-40 transition-opacity">
                <img 
                  className="w-full h-full object-contain" 
                  alt="Intricate geometric patterns" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6WVY8chaETMnI8HIQtZMELBV3ewS1fbwjLTIMyd7ETzA7uzFFeifVpRsQiUHoX-MMauVKqhEX4LDE6B1MUTx2DuMAiggvQ1uuXZEkscROEs5e51E7sMtM2iQl-1pqdNv9zStuLjQd67MNJjgwt8U5EO5DmrVe_zK4ybKSysEe05-NIcdun1PK8nxmr-AhBy2zmwFNRATjXKkRROD8Qcr_-WWTkf98lBoiniL1HUdQzefvUjjb9FPYLZ1Qe421kaFhYCIjdkuGSmA"
                />
              </div>
            </div>

            {/* Precision in Pedagogy */}
            <div className="md:col-span-4 bg-primary text-on-primary rounded-3xl p-10 flex flex-col justify-end group">
              <div className="mb-12">
                <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>biotech</span>
              </div>
              <h3 className="font-h1 text-2xl mb-4">Precision in Pedagogy</h3>
              <p className="text-on-primary/80 leading-relaxed">
                Data insights that empower educators to focus on what matters: the students.
              </p>
            </div>

            {/* Institutional Logic */}
            <div className="md:col-span-4 glass-card rounded-3xl p-8 flex flex-col items-start hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary">analytics</span>
              </div>
              <h3 className="font-h2 text-xl mb-2 text-white">Institutional Logic</h3>
              <p className="text-on-surface-variant text-body-md">Seamlessly map complex organizational hierarchies with absolute clarity.</p>
            </div>

            {/* Instant Deployment */}
            <div className="md:col-span-4 glass-card rounded-3xl p-8 flex flex-col items-start hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary">sync_alt</span>
              </div>
              <h3 className="font-h2 text-xl mb-2 text-white">Instant Deployment</h3>
              <p className="text-on-surface-variant text-body-md">One-click synchronization across all campus devices and mobile applications.</p>
            </div>

            {/* Elite Support */}
            <div className="md:col-span-4 glass-card rounded-3xl p-8 flex flex-col items-start hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary">support_agent</span>
              </div>
              <h3 className="font-h2 text-xl mb-2 text-white">Elite Support</h3>
              <p className="text-on-surface-variant text-body-md">24/7 dedicated assistance for mission-critical academic operations.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto rounded-[3rem] bg-gradient-to-br from-primary-container to-indigo-900 p-12 md:p-24 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="relative z-10">
              <h2 className="font-display text-4xl md:text-6xl text-white mb-8 tracking-tighter">Ready to redefine your institution?</h2>
              <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-12">
                Join the leading academies worldwide using OptimaAcademia to streamline their entire educational ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button 
                  onClick={onStart}
                  className="bg-white text-slate-950 px-10 py-5 rounded-full font-bold text-lg hover:bg-slate-100 transition-colors shadow-xl"
                >
                  Empezar a Optimizar
                </button>
                <button className="border border-white/20 text-white bg-white/10 backdrop-blur-md px-10 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-colors">
                  Talk to Sales
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 mt-auto bg-slate-950 border-t border-white/5 font-manrope text-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="text-lg font-bold text-slate-200">OptimaAcademia</div>
            <div className="text-slate-500">© 2024 OptimaAcademia. All rights reserved. Precision in Pedagogy.</div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <a className="text-slate-500 hover:text-indigo-300 transition-colors opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
            <a className="text-slate-500 hover:text-indigo-300 transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a>
            <a className="text-slate-500 hover:text-indigo-300 transition-colors opacity-80 hover:opacity-100" href="#">Contact</a>
            <a className="text-slate-500 hover:text-indigo-300 transition-colors opacity-80 hover:opacity-100" href="#">API Documentation</a>
            <a className="text-slate-500 hover:text-indigo-300 transition-colors opacity-80 hover:opacity-100" href="#">Status</a>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-500 px-3 py-1 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Systems Operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
