import React, { useState } from 'react';
import { syncAcademicHistory } from '../../services/api';

interface Subject {
  courseId: string;
  courseName: string;
  status: 'Aprobada' | 'En curso' | 'Pendiente';
  grade?: string;
  section?: string;
  professor?: string;
}

/**
 * US-02: Sync Hub
 * Sincronización segura con sistemas universitarios.
 */
const SyncHub: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [token, setToken] = useState('');
  const [institution, setInstitution] = useState('sap');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncData, setSyncData] = useState<Subject[]>([]);

  const handleSync = async () => {
    if (!studentId || !token) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await syncAcademicHistory(studentId, token);
      // US-02: El backend devuelve los datos en la propiedad 'records'
      setSyncData(data.records || []);
    } catch (err: any) {
      setError(err.message || 'Error en la sincronización. Verifica tus credenciales del SAP.');
    } finally {
      setIsLoading(false);
      setToken(''); // Seguridad Local: Borramos el token de memoria
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'aprobada') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (s === 'reprobada') return 'bg-error/10 text-error border-error/20';
    return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  };

  const getIcon = (name: string) => {
    if (name.includes('Calculus') || name.includes('Matemáticas')) return 'calculate';
    if (name.includes('Physics') || name.includes('Física')) return 'bolt';
    if (name.includes('Software') || name.includes('Programación')) return 'terminal';
    return 'data_object';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in relative z-10">
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -z-10"></div>
      
      <div className="mb-12">
        <h2 className="text-6xl font-display font-black text-white mb-6 tracking-tighter">Sync Hub</h2>
        <p className="text-xl text-on-surface-variant leading-relaxed max-w-2xl">
          Sincroniza tu progreso académico con el SAP de la Sergio Arboleda de forma segura. 
          <span className="text-primary font-bold ml-2">US-02 Protocol Active.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Sync Controls */}
        <div className="md:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-indigo-400">cloud_sync</span>
              <h2 className="text-xl font-bold text-slate-100">Configuración</h2>
            </div>

            {/* Institution Selector (Solo Sergio Arboleda) */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 block ml-1">Institución</label>
              <div className="relative group">
                <select 
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-200 transition-all cursor-pointer"
                >
                  <option value="sap">SAP - Universidad Sergio Arboleda</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-indigo-400 transition-colors">expand_more</span>
              </div>
            </div>

            {/* Credentials */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 block ml-1">Student ID</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[20px]">badge</span>
                  <input 
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-200 transition-all placeholder:text-slate-600" 
                    placeholder="2024-XXXXX" 
                    type="text"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 block ml-1">Security Token</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[20px]">lock</span>
                  <input 
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-200 transition-all placeholder:text-slate-600" 
                    placeholder="••••••••••••" 
                    type="password"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-xl text-error text-xs flex items-center gap-2 animate-shake">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </div>
            )}

            {/* Action Button */}
            <div className="pt-4">
              <button 
                onClick={handleSync}
                disabled={isLoading || !studentId || !token}
                className={`w-full group relative overflow-hidden font-bold py-4 rounded-xl shadow-xl transition-all ${
                  isLoading || !studentId || !token 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-primary-container text-on-primary-container hover:scale-[1.02] active:scale-[0.98] shadow-indigo-600/20'
                }`}
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <span className={`material-symbols-outlined text-[20px] ${isLoading ? 'animate-spin' : ''}`}>
                    {isLoading ? 'sync' : 'cloud_sync'}
                  </span>
                  <span>{isLoading ? 'Sincronizando...' : 'Sincronizar Ahora'}</span>
                </div>
                {!isLoading && studentId && token && (
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
              </button>
              <p className="text-[11px] text-center mt-3 text-slate-500 uppercase tracking-tighter">Powered by Optima Engine v2.4</p>
            </div>
          </div>

          <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-2xl flex gap-3">
            <span className="material-symbols-outlined text-indigo-400">info</span>
            <p className="text-xs text-slate-400">Tus credenciales están encriptadas localmente y nunca se guardan en nuestros servidores.</p>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="md:col-span-7">
          <div className="glass-panel h-full rounded-2xl overflow-hidden flex flex-col min-h-[500px]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-100">Resultados del Hub</h2>
                <p className="text-xs text-slate-500">
                  {syncData.length > 0 ? `Se encontraron ${syncData.length} materias` : 'Esperando sincronización'}
                </p>
              </div>
              <span className="material-symbols-outlined text-slate-500 hover:text-indigo-400 cursor-pointer transition-colors">filter_list</span>
            </div>

            <div className="flex-grow p-4 space-y-3 overflow-y-auto max-h-[400px]">
              {syncData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-40 py-20">
                  <span className="material-symbols-outlined text-6xl mb-4">dataset</span>
                  <p className="text-sm">Inicia la sincronización para ver tu historia académica.</p>
                </div>
              ) : (
                syncData.map((subject, idx) => (
                  <div 
                    key={subject.courseId || idx} 
                    className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between hover:bg-white/10 transition-all group animate-fade-in"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        subject.status === 'Aprobada' ? 'bg-green-500/20 text-green-400' : 'bg-indigo-500/20 text-indigo-400'
                      } group-hover:scale-110`}>
                        <span className="material-symbols-outlined">{getIcon(subject.courseName)}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-200">{subject.courseName}</h4>
                        <p className="text-xs text-slate-500">
                          {subject.section ? `Sección ${subject.section}` : 'General'} • {subject.professor || 'Profesor por asignar'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(subject.status)}`}>
                        {subject.status}
                      </span>
                      {subject.grade && (
                        <span className="text-xs font-mono text-indigo-400 font-bold">{subject.grade} / 5.0</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Card Footer */}
            <div className="p-4 bg-slate-900/40 border-t border-white/5 flex justify-between items-center">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold">SP</div>
                {syncData.length > 0 && (
                  <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-indigo-500 flex items-center justify-center text-[10px] font-bold">OA</div>
                )}
              </div>
              <button 
                disabled={syncData.length === 0}
                className={`text-xs font-bold flex items-center gap-1 transition-colors ${
                  syncData.length === 0 ? 'text-slate-600' : 'text-indigo-400 hover:text-indigo-300'
                }`}
              >
                Exportar Reporte <span className="material-symbols-outlined text-[16px]">download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <span className="material-symbols-outlined text-indigo-400 bg-indigo-500/10 w-12 h-12 rounded-xl flex items-center justify-center">insights</span>
          <h4 className="text-lg font-bold text-slate-100">Predictor GPA</h4>
          <p className="text-xs text-slate-400 leading-relaxed">Analizamos tus tendencias actuales para predecir tu promedio final del semestre.</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <span className="material-symbols-outlined text-tertiary w-12 h-12 rounded-xl flex items-center justify-center bg-tertiary/10">auto_awesome</span>
          <h4 className="text-lg font-bold text-slate-100">Auto-Priorizar</h4>
          <p className="text-xs text-slate-400 leading-relaxed">Genera una lista de tareas basada en el peso porcentual de tus próximas entregas.</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <span className="material-symbols-outlined text-on-primary-container w-12 h-12 rounded-xl flex items-center justify-center bg-primary-container/20">verified_user</span>
          <h4 className="text-lg font-bold text-slate-100">Cifrado Militar</h4>
          <p className="text-xs text-slate-400 leading-relaxed">Protocolos AES-256 para asegurar que solo tú tengas acceso a tu información académica.</p>
        </div>
      </div>
    </div>
  );
};

export default SyncHub;
