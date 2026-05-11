import React, { useState, useEffect } from 'react';

const EnrollmentManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [enrolled, setEnrolled] = useState<number[]>([2]); // Calculus already enrolled

  const subjects = [
    { id: 1, name: 'Algoritmos Avanzados', section: '04A', prof: 'Aranda', credits: 4, slots: '12 / 30', icon: 'code' },
    { id: 2, name: 'Cálculo Multivariable', section: '02B', prof: 'Mendoza', credits: 5, slots: '0 / 30', icon: 'functions' },
    { id: 3, name: 'Arquitectura de Datos', section: '01C', prof: 'Torres', credits: 4, slots: '05 / 25', icon: 'database' },
    { id: 4, name: 'Sistemas Operativos', section: '03D', prof: 'Ramírez', credits: 4, slots: '08 / 20', icon: 'terminal' },
    { id: 5, name: 'Redes de Computadoras', section: '01A', prof: 'Gómez', credits: 3, slots: '15 / 25', icon: 'router' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnroll = (id: number) => {
    setProcessingId(id);
    setTimeout(() => {
      setEnrolled([...enrolled, id]);
      setProcessingId(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header with Performance Badge */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 pt-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-primary font-mono text-sm tracking-tighter bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">
                PROCESS_ID: 992-MAT
              </span>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">Alto Rendimiento Activo</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter">Gestión de <span className="text-primary italic font-light">Matrícula</span></h1>
            <p className="text-slate-400 text-lg max-w-xl font-medium leading-relaxed">
              Sistema optimizado para baja latencia. Las animaciones pesadas se han desactivado para garantizar tu cupo.
            </p>
          </div>

          <div className="flex gap-6">
            <div className="glass-panel px-8 py-5 rounded-[2rem] border border-white/5 flex flex-col items-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black mb-1">Créditos</span>
              <span className="text-3xl font-black text-primary">{enrolled.length * 4} <span className="text-slate-700">/ 24</span></span>
            </div>
            <div className="glass-panel px-8 py-5 rounded-[2rem] border border-white/5 flex flex-col items-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black mb-1">Estado</span>
              <span className="text-3xl font-black text-emerald-400">ABIERTO</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Main List */}
          <section className="xl:col-span-8 space-y-6">
            <div className="flex items-center justify-between mb-2 px-2">
              <h3 className="text-2xl font-black tracking-tight">Materias Disponibles</h3>
              <div className="flex gap-2">
                <span className="px-4 py-1.5 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 border border-white/5">Ingeniería</span>
                <span className="px-4 py-1.5 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 border border-white/5">Nivel 4</span>
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                // Skeletons
                [1, 2, 3, 4].map(i => (
                  <div key={i} className="glass-panel p-6 rounded-[2rem] border border-white/5 flex items-center justify-between opacity-50">
                    <div className="flex items-center gap-6 w-full">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 animate-pulse shrink-0"></div>
                      <div className="space-y-3 w-full max-w-[250px]">
                        <div className="h-4 w-full bg-white/10 rounded animate-pulse"></div>
                        <div className="h-3 w-2/3 bg-white/5 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="h-12 w-32 bg-white/5 rounded-2xl animate-pulse shrink-0"></div>
                  </div>
                ))
              ) : (
                subjects.map(sub => (
                  <div 
                    key={sub.id} 
                    className={`glass-panel p-6 rounded-[2rem] border transition-all duration-500 flex items-center justify-between group ${
                      enrolled.includes(sub.id) 
                      ? 'border-emerald-500/30 bg-emerald-500/5' 
                      : 'border-white/5 hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        enrolled.includes(sub.id) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary'
                      }`}>
                        <span className="material-symbols-outlined text-3xl">{sub.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{sub.name}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-1">Sección {sub.section} • Prof. {sub.prof} • {sub.credits} Créditos</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Cupos</p>
                        <p className={`text-sm font-mono font-bold ${enrolled.includes(sub.id) ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {enrolled.includes(sub.id) ? 'RESERVADO' : sub.slots}
                        </p>
                      </div>
                      
                      {enrolled.includes(sub.id) ? (
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                          <span className="material-symbols-outlined text-2xl font-bold">check_circle</span>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleEnroll(sub.id)}
                          disabled={processingId !== null}
                          className="relative h-12 px-8 bg-primary hover:bg-primary/80 disabled:bg-slate-800 text-on-primary text-xs font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
                        >
                          {processingId === sub.id ? (
                            <>
                              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                              </svg>
                              Procesando
                            </>
                          ) : (
                            <>Inscribir <span className="material-symbols-outlined text-sm">add_circle</span></>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Metrics Sidebar */}
          <aside className="xl:col-span-4 space-y-8">
            <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="material-symbols-outlined text-8xl">speed</span>
              </div>
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">analytics</span>
                Métricas del Sistema
              </h3>
              
              <div className="space-y-6">
                <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Latencia Global</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">14ms</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full w-[15%] bg-emerald-500"></div>
                  </div>
                </div>

                <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Carga Servidor</span>
                    <span className="text-xs font-mono font-bold text-primary">22%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full w-[22%] bg-primary"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <span className="text-xs font-bold text-slate-300">Usuarios en Línea</span>
                  <span className="text-lg font-black text-white tracking-tight">1,249</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden">
               <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-emerald-400 text-3xl">verified</span>
                  <div>
                    <h4 className="font-black text-white mb-2">Transacción Segura</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      Tu proceso de matrícula está protegido por el nodo de alta prioridad. No cierres esta ventana hasta finalizar.
                    </p>
                  </div>
               </div>
            </div>

            <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 h-48 relative group overflow-hidden">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDim_FAMEnD_y9RbNQCzB7-IbHX_2keMcqHyeJFQ4Wblyqk5hzSp2CTyMlrbJkOF1jqH7M9DFK3ngOlSQoyystQA1H8RzJWNfL6xaLhiMrbAGbZjbQOK4wLYfQSHUFovMGAQCRmpf8Cgfoc-sFtk8PelbKG-IZO1KOY6JgQTUZeqMJsR-bIxv61rLdAZVHPPkUeMlb7LfHTYjBsXzE13XKqz0VYrQWsEM2VPu4LvZmm--TPnGr-IJL-3Lv1DE5o9kB7pmVL8hxtKfE" 
                alt="Datacenter Node" 
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
              <div className="relative z-10 h-full flex flex-col justify-end">
                <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">Localización del Nodo</p>
                <p className="text-sm font-bold text-white">Campus Principal - Centro de Datos</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Action FAB */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[80]">
        <button className="bg-white text-slate-950 px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
          Finalizar Matrícula <span className="material-symbols-outlined text-xl">assignment_turned_in</span>
        </button>
      </div>
    </div>
  );
};

export default EnrollmentManager;
