import React, { useState, useEffect } from 'react';
import { login, register, isAuthenticated } from '../services/auth.service';
import type { AuthUser } from '../services/auth.service';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirigir si ya está autenticado (protección extra)
  useEffect(() => {
    if (isAuthenticated()) {
      // En una app con Router aquí iría un navigate('/')
      // Como manejamos vistas en App.tsx, esto es manejado por el padre
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      if (activeTab === 'register') {
        // En un registro real pediríamos más campos, aquí usamos defaults para simplificar
        const result = await register(email, password, fullName, 'std-' + Math.floor(Math.random()*1000), 'Ingeniería', 1);
        onLoginSuccess(result.user);
      } else {
        const result = await login(email, password);
        onLoginSuccess(result.user);
      }
    } catch (err: any) {
      setError(err.message || 'Error en la autenticación. Revisa tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  const simulateDemoLogin = async () => {
    if (isLoading) return;
    setActiveTab('login');
    setEmail('');
    setPassword('');
    
    const demoEmail = 'santiago.parra@usa.edu.co';
    const demoPass = 'demo123';

    // Efecto de escritura para el demo
    for (let i = 0; i < demoEmail.length; i++) {
      setEmail(prev => prev + demoEmail[i]);
      await new Promise(r => setTimeout(r, 30));
    }
    await new Promise(r => setTimeout(r, 200));
    for (let i = 0; i < demoPass.length; i++) {
      setPassword(prev => prev + demoPass[i]);
      await new Promise(r => setTimeout(r, 30));
    }
    
    await new Promise(r => setTimeout(r, 400));
    
    setIsLoading(true);
    try {
      const result = await login(demoEmail, demoPass);
      onLoginSuccess(result.user);
    } catch (err: any) {
      setError("Error en acceso demo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-[#e4e1ed] font-sans selection:bg-primary/30 antialiased overflow-x-hidden">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10 shadow-2xl shadow-indigo-500/5">
        <div className="flex items-center justify-between h-16 px-6 max-w-7xl mx-auto">
          <div className="text-xl font-black tracking-tighter text-white">OptimaAcademia</div>
          <div className="hidden md:flex items-center gap-x-8">
            <a className="text-primary font-bold transition-all" href="#">Platform</a>
            <a className="text-slate-400 font-medium hover:text-primary transition-all" href="#">Features</a>
            <a className="text-slate-400 font-medium hover:text-primary transition-all" href="#">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('login')}
              className="text-slate-400 font-bold px-4 py-2 hover:text-white transition-colors"
            >
              Log In
            </button>
            <button 
              onClick={() => setActiveTab('register')}
              className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
            >
              Empezar
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 min-h-screen flex items-center justify-center relative px-6">
        {/* Glow Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="glass-panel rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-white/10 relative overflow-hidden">
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-4 shadow-inner">
                <span className="material-symbols-outlined font-black">auto_awesome</span>
              </div>
              <h2 className="text-2xl font-black tracking-tighter text-white">Bienvenido de nuevo</h2>
              <p className="text-slate-500 text-sm font-medium mt-1">Precisión en la gestión académica</p>
            </div>

            {/* Tab Toggle */}
            <div className="flex p-1 bg-slate-900/50 rounded-2xl mb-8 border border-white/5">
              <button 
                onClick={() => { setActiveTab('login'); setError(null); }}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'login' ? 'bg-primary text-on-primary shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Ingresar
              </button>
              <button 
                onClick={() => { setActiveTab('register'); setError(null); }}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'register' ? 'bg-primary text-on-primary shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Registrar
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'register' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                  <input 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Santiago Parra"
                    className="w-full bg-slate-900/80 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 text-white text-sm transition-all placeholder:text-slate-700"
                  />
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Correo Institucional</label>
                <input 
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="estudiante@usa.edu.co"
                  className="w-full bg-slate-900/80 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 text-white text-sm transition-all placeholder:text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contraseña</label>
                  {activeTab === 'login' && <a href="#" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">¿Olvidaste?</a>}
                </div>
                <input 
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/80 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 text-white text-sm transition-all placeholder:text-slate-700"
                />
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-primary text-on-primary font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 disabled:opacity-50 flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">sync</span>
                    Procesando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">{activeTab === 'login' ? 'login' : 'person_add'}</span>
                    {activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                  </>
                )}
              </button>
            </form>

            {/* Demo Button */}
            <div className="mt-8 pt-8 border-t border-white/5">
              <p className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">¿Solo quieres explorar?</p>
              <button 
                onClick={simulateDemoLogin}
                disabled={isLoading}
                type="button"
                className="w-full flex items-center justify-center gap-3 py-4 bg-amber-500/10 text-amber-500 font-black rounded-2xl hover:bg-amber-500/20 transition-all border border-amber-500/20 group disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">rocket_launch</span>
                <span className="text-xs uppercase tracking-widest">Acceso Demo Rápido</span>
              </button>
            </div>
          </div>

          <p className="text-center text-[10px] font-black text-slate-700 uppercase tracking-widest mt-8">
            Protegido con AES-256 & JWT • © 2026 OptimaAcademia
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-slate-950 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>OptimaAcademia</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary">Privacidad</a>
            <a href="#" className="hover:text-primary">Términos</a>
            <a href="#" className="hover:text-primary">API</a>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            Sistemas Operativos
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
