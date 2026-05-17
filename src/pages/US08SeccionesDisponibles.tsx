import React, { useState } from 'react';

interface Section {
  id: number;
  nombre: string;
  cuposDisponibles: number;
}

const PROF_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuASPEn9WOY2EOMydXSlJxTaWNcBtkHa2GEb9r46PkFYDlI6Zf8JDDNMtYkljQUXbM_b_2Ez6sP0Q9OH4ygTf0l0jqBBM2wrNk8b9YDqa457JTAb80HIzEmmt06tJf9uuYaEbRcwocmBA2ZynQld4amth083Xq1GHR-qWmx1NSZ_H455gh5JsTt8lUdu3wHZWFiFsaIbwiAreJFWEYSzUrLpFAQSGsSzDX765fdf-JXZGGlrnhRZ3CuuePKaF_AIBEJngeOeijOh_URB",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAAHnDLU471ZgbVJLCIYf0r2nsWkL0NRrxPo-NTzK-DRj1ilFFTJuM5Ui4n5xUip3VHR99nsJvg4wX4mG3eiDZdxBKuZ23vR3aVUFP8Js_jPrsGRWWL318UR7u7G3RSXbV-crROg5XQrjeMA4hY8v9VSJAc9KD1chWLmNnoW_7yznAQjnv6ITcISOXlQQPpdcc2g34FX_foFSmX_x1UiWqaIo4Sf-aWszVGe85wAtGJbBF771meFQ5h2_1ckoAawnQgQxjIBtCKUXQW",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD2-N-Ha0aI5E8fE7Bo22arQm9aZJWJd65p9aEZAGdwPsF9HjC2NSvuFac2RdqFZh5LnBDw5f_iiuVl641O8DdnaMkj6DH2iH6NhUHxq8A-6ecJXZlTBOXNb9NBl-GMf_raWhcNOtYUyb_12BahKJTyHRqF-16nabXu_5XymwU9JFXUv_dDN18vx7Pa8NeBjTWywrN9qsydf79QWhHHjzcyuYp5QP4i-0T8LM9LvzECa39aIiXdUhhymcOycLqpBwkb4VkxBhNzkVJE"
];

const SUBJECT_DETAILS: Record<string, any> = {
  "MAT101": { title: "Cálculo I", code: "MAT-101", desc: "Límites, derivadas y aplicaciones de la derivada en funciones de una variable." },
  "FIS101": { title: "Física Mecánica", code: "FIS-101", desc: "Cinemática, dinámica y leyes de conservación para sistemas de partículas." },
  "PROG101": { title: "Fundamentos de Programación", code: "PROG-101", desc: "Introducción al pensamiento algorítmico y estructuras básicas de datos." },
  "MAT102": { title: "Cálculo II", code: "MAT-102", desc: "Integrales, sucesiones y series infinitas." },
};

const US08SeccionesDisponibles: React.FC = () => {
  const [materiaId, setMateriaId] = useState('');
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!materiaId) return;
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const response = await fetch(`http://localhost:3000/api/secciones/${materiaId}/disponibles`);
      if (!response.ok) throw new Error('Error al conectar con el servidor');
      const data = await response.json();
      setSections(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const details = SUBJECT_DETAILS[materiaId] || { title: "Materia Seleccionada", code: "GEN-000", desc: "Detalles técnicos y secciones disponibles para la asignatura consultada." };
  const totalCupos = sections.reduce((acc, s) => acc + s.cuposDisponibles, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Search Header */}
      <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"></div>
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 w-full">
            <label className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3 block text-white">Módulo de Consulta US-08</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
              <input 
                type="text" 
                value={materiaId}
                onChange={(e) => setMateriaId(e.target.value)}
                placeholder="Ingrese código o nombre de materia (ej: MAT101)..." 
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>
          <button 
            onClick={handleSearch}
            className="w-full md:w-auto bg-primary text-slate-950 px-10 py-4 rounded-2xl font-black text-sm tracking-tight shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            {isLoading ? 'ESCANEAR...' : 'EXPLORAR SECCIONES'}
          </button>
        </div>
      </div>

      {!hasSearched ? (
        <div className="py-32 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-[32px] bg-slate-800/40 flex items-center justify-center mb-6 shadow-2xl">
            <span className="material-symbols-outlined text-4xl text-slate-500">grid_view</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 font-manrope">Inicie una consulta</h3>
          <p className="text-slate-500 max-w-xs text-sm">Ingrese el ID de la materia en el buscador superior para ver la disponibilidad en tiempo real.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-primary">{details.code}</div>
            <h1 className="text-5xl font-manrope font-black text-white tracking-tighter">{details.title}</h1>
            <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">{details.desc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 border-l-4 border-l-primary">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Promedio Depto.</span>
              <div className="text-3xl font-manrope font-bold text-white">3.42 GPA</div>
              <div className="w-full bg-white/5 h-1.5 rounded-full mt-4"><div className="bg-primary h-full rounded-full" style={{ width: '85%' }}></div></div>
            </div>
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Cupos Totales</span>
              <div className="text-3xl font-manrope font-bold text-white">{totalCupos} / 300</div>
            </div>
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Estado General</span>
              <div className={`text-xl font-manrope font-bold ${totalCupos > 15 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {totalCupos > 0 ? (totalCupos > 15 ? 'ALTA DISPONIBILIDAD' : 'MODERADA') : 'AGOTADO'}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="py-20 text-center animate-pulse text-xs text-slate-500 tracking-widest">SINCRONIZANDO CON SIA...</div>
            ) : error ? (
              <div className="p-8 text-center bg-red-500/5 rounded-2xl border border-red-500/20 flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-red-400 text-3xl">wifi_off</span>
                <p className="text-sm text-red-400 font-medium">{error}</p>
                <button onClick={handleSearch} className="text-xs text-primary font-bold hover:underline">Reintentar</button>
              </div>
            ) : sections.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 bg-white/5 rounded-2xl border border-dashed border-white/10">No se detectaron cupos libres.</div>
            ) : (
              sections.map((s, idx) => (
                <div key={s.id} className="bg-slate-900/40 border border-white/5 hover:border-primary/30 p-5 rounded-2xl flex items-center justify-between gap-6 transition-all duration-300 animate-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Sección</span>
                      <span className="text-xl font-manrope font-black text-primary">SEC-{s.id}-{String.fromCharCode(65 + idx)}</span>
                    </div>
                    <div className="h-10 w-[1px] bg-white/10"></div>
                    <div className="flex items-center gap-3">
                      <img src={PROF_IMAGES[idx % 3]} className="w-10 h-10 rounded-full border border-white/10 shadow-lg" alt="Prof" />
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Catedrático</span>
                        <span className="text-xs font-bold text-white">{s.nombre}</span>
                      </div>
                    </div>
                    <div className="h-10 w-[1px] bg-white/10"></div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Disponibilidad</span>
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${s.cuposDisponibles > 10 ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                        <span className={`text-[10px] font-bold uppercase ${s.cuposDisponibles > 10 ? 'text-emerald-400' : 'text-amber-400'}`}>{s.cuposDisponibles} Cupos</span>
                      </div>
                    </div>
                  </div>
                  <button className="bg-white/5 hover:bg-primary hover:text-slate-950 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border border-white/10 hover:border-primary">
                    Solicitar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default US08SeccionesDisponibles;
