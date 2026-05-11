import React, { useState } from 'react';
import { getCurrentUser } from '../../services/auth.service';

const UserProfile: React.FC = () => {
  const user = getCurrentUser();
  const [semester, setSemester] = useState(user?.semester || 1);
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-black text-white tracking-tight">Perfil de Usuario</h1>
          <p className="text-on-surface-variant font-medium">Gestiona tu identidad académica y preferencias.</p>
        </div>
      </div>

      {/* Profile Identity Card */}
      <div className="glass-panel rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10 items-center shadow-2xl relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        
        <div className="relative group">
          <div className="w-40 h-40 rounded-full overflow-hidden ring-8 ring-primary/10 group-hover:ring-primary/20 transition-all duration-500 shadow-2xl">
            <img 
              alt="Student Portrait" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDAi1JMekVznCOHpjHWGzh44iUYqCChtKafTuLciTJ0WRC39sdllToxk-Xl2Bx58LF2O_BigbnKbPh_6lYnWq70mnHH_dxetw_Wkcq3Q_-Krnp2B_GQZRhhx-xwa7NL3LTY_qfnB2UVI2MmM1rTILS9JNTEROWAA5_Kw8SE19I7aArpky5lpRCFOyMOHW6ZD8wxu9dCDDELXuBZEjtnVkqTbXob8Co7qofnh2VaNDo0s8WmzwbFzjx6SycDTXNxirTXQkZnfpeEq8"
            />
          </div>
          <button className="absolute bottom-2 right-2 w-10 h-10 bg-primary text-white rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center border-4 border-slate-950">
            <span className="material-symbols-outlined text-lg">edit</span>
          </button>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4 relative z-10">
          <h2 className="text-4xl font-display font-black text-white tracking-tight">{user?.fullName || 'Alex Thorne'}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-primary/20">
              ID: {user?.studentId || '2024-OPT-8821'}
            </span>
            <span className="bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/5">
              Pregrado
            </span>
            <span className="bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/5">
              {user?.program || 'Ingeniería de Sistemas'}
            </span>
          </div>
          <p className="text-slate-500 font-medium pt-2 italic">Universidad de los Sabios Avanzados</p>
        </div>
      </div>

      {/* Academic Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Semester Selector */}
        <div className="md:col-span-2 glass-panel rounded-[2.5rem] p-8 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">calendar_month</span>
              </div>
              <h3 className="text-xl font-black">Semestre Actual</h3>
            </div>
            <span className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-400/20">
              <span className="material-symbols-outlined text-sm font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              En Curso
            </span>
          </div>

          <div className="space-y-10">
            <div className="relative pt-6">
              <label className="absolute top-0 left-0 text-[10px] font-black uppercase tracking-[0.2em] text-primary">Seleccionar Semestre</label>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={semester} 
                onChange={(e) => setSemester(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-primary" 
              />
              <div className="flex justify-between mt-4 text-[10px] font-black text-slate-500 tracking-tighter">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                  <span key={s} className={semester === s ? 'text-primary font-bold scale-125 transition-transform' : ''}>SEM {s}</span>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500">
                  <span className="material-symbols-outlined">update</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Ciclo 2024-II</p>
                  <p className="text-xs text-slate-500 font-medium">Grado Estimado: Junio 2026</p>
                </div>
              </div>
              <button 
                onClick={handleSave}
                className="bg-primary hover:bg-primary/80 text-on-primary font-black px-8 py-3 rounded-2xl text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-primary/20"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>

        {/* Performance Card */}
        <div className="glass-panel rounded-[2.5rem] p-8 border border-white/5 flex flex-col gap-6 bg-primary/5">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white">Rendimiento</h3>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Índice GPA Actual</p>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-white/5" cx="72" cy="72" r="66" fill="transparent" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-primary" cx="72" cy="72" r="66" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="414.6" strokeDashoffset="41.5"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black leading-none text-white tracking-tighter">4.8</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">PROMEDIO</span>
              </div>
            </div>
          </div>

          <button className="w-full py-4 rounded-2xl border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-all">
            Ver Historial Completo
          </button>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="glass-panel rounded-[2.5rem] overflow-hidden border border-white/5">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
          <h3 className="text-xl font-black">Preferencias del Sistema</h3>
          <span className="material-symbols-outlined text-slate-500">tune</span>
        </div>
        <div className="divide-y divide-white/5">
          {[
            { icon: 'notifications', title: 'Notificaciones de Sincronización', desc: 'Alertas para actualizaciones de registros', active: true },
            { icon: 'cloud_sync', title: 'Auto-Sync Hub', desc: 'Vinculación bi-direccional con la universidad', active: false },
            { icon: 'shield', title: 'Cifrado de Privacidad', desc: 'Protección de registros con AES-256', active: true },
          ].map((pref, i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
              <div className="flex items-center gap-6">
                <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">{pref.icon}</span>
                <div>
                  <p className="font-bold text-white">{pref.title}</p>
                  <p className="text-xs text-slate-500 font-medium">{pref.desc}</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-colors ${pref.active ? 'bg-primary' : 'bg-slate-800'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${pref.active ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Toast */}
      <div className={`fixed bottom-8 right-8 glass-panel rounded-3xl p-6 shadow-2xl border-primary/30 flex items-center gap-4 transition-all duration-500 z-[100] ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>done_all</span>
        </div>
        <div>
          <p className="font-black text-white text-sm">Registros Sincronizados</p>
          <p className="text-xs text-slate-500 font-medium">El semestre se actualizó correctamente.</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
