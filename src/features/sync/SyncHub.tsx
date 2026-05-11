import React, { useState, useRef } from 'react';
import { syncAcademicHistory, syncScheduleByImage, saveSyncData } from '../../services/api';

interface Subject {
  courseId: string;
  courseName: string;
  status: 'Aprobada' | 'En curso' | 'Pendiente' | 'CURSANDO';
  grade?: string;
  section?: string;
  professor?: string;
}

/**
 * US-02: Sync Hub
 * Sincronización segura con sistemas universitarios (API o Visión Artificial).
 */
const SyncHub: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [token, setToken] = useState('');
  const [institution, setInstitution] = useState('sap');
  const [syncMethod, setSyncMethod] = useState<'api' | 'vision'>('vision');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncData, setSyncData] = useState<Subject[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSync = async () => {
    if (!studentId || !token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await syncAcademicHistory(studentId, token);
      setSyncData(data.records || []);
    } catch (err: any) {
      setError(err.message || 'Error en la sincronización. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
      setToken('');
    }
  };

  const handleImageSync = async () => {
    if (!studentId || !imageFile) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await syncScheduleByImage(studentId, imageFile);
      setSyncData(data.records || []);
    } catch (err: any) {
      setError(err.message || 'Error al procesar la imagen del horario.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (syncData.length === 0 || !studentId) return;
    setIsLoading(true);
    try {
      await saveSyncData(studentId, syncData);
      alert('¡Sincronización guardada exitosamente en tu historial académico!');
      setSyncData([]);
    } catch (err: any) {
      setError('Error al guardar los datos sincronizados.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'aprobada' || s === 'cursando' || s === 'en curso') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (s === 'reprobada') return 'bg-error/10 text-error border-error/20';
    return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  };

  const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('calculus') || n.includes('matemát') || n.includes('cálculo')) return 'calculate';
    if (n.includes('physics') || n.includes('física')) return 'bolt';
    if (n.includes('software') || n.includes('programación') || n.includes('ingeniería')) return 'terminal';
    return 'data_object';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in relative z-10 pb-20">
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10"></div>
      
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          US-02 Vision Sia Engine v3.0
        </div>
        <h2 className="text-7xl font-display font-black text-white mb-6 tracking-tighter leading-none">Sync Hub</h2>
        <p className="text-xl text-on-surface-variant leading-relaxed max-w-2xl font-medium">
          Sincronización instantánea. Sube una foto de tu horario o usa tus credenciales oficiales.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-8 rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            
            {/* Method Toggle */}
            <div className="flex bg-slate-950/50 p-1 rounded-2xl mb-8 border border-white/5">
              <button 
                onClick={() => setSyncMethod('vision')}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${syncMethod === 'vision' ? 'bg-primary text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                <span className="material-symbols-outlined text-sm">photo_camera</span>
                Visión IA
              </button>
              <button 
                onClick={() => setSyncMethod('api')}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${syncMethod === 'api' ? 'bg-primary text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                <span className="material-symbols-outlined text-sm">api</span>
                API Directa
              </button>
            </div>

            <div className="space-y-6">
              {/* Student ID - Common */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Student Identifier</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-primary">badge</span>
                  <input 
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary text-sm text-white transition-all placeholder:text-slate-700 font-medium" 
                    placeholder="ej: santiago-123" 
                  />
                </div>
              </div>

              {syncMethod === 'api' ? (
                /* API Form */
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">SIA Security Token</label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-primary">lock</span>
                      <input 
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        type="password"
                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary text-sm text-white transition-all placeholder:text-slate-700 font-medium" 
                        placeholder="••••••••••••••••" 
                      />
                    </div>
                  </div>
                  <button 
                    onClick={handleSync}
                    disabled={isLoading || !studentId || !token}
                    className="w-full bg-primary text-slate-950 font-black py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
                  >
                    <span className={`material-symbols-outlined ${isLoading ? 'animate-spin' : ''}`}>
                      {isLoading ? 'sync' : 'cloud_sync'}
                    </span>
                    <span className="uppercase tracking-tight">{isLoading ? 'Sincronizando...' : 'Conectar con SIA'}</span>
                  </button>
                </div>
              ) : (
                /* Vision Form */
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Captura de Horario</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative h-48 rounded-[24px] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group overflow-hidden ${imageFile ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-primary/40 bg-slate-950/40'}`}
                    >
                      {previewUrl ? (
                        <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" alt="Preview" />
                      ) : (
                        <span className="material-symbols-outlined text-4xl text-slate-600 group-hover:text-primary group-hover:scale-110 transition-all">add_a_photo</span>
                      )}
                      <span className="text-xs font-bold text-slate-400 group-hover:text-white relative z-10">
                        {imageFile ? imageFile.name : 'Haz clic para subir foto del horario'}
                      </span>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  <button 
                    onClick={handleImageSync}
                    disabled={isLoading || !studentId || !imageFile}
                    className="w-full bg-primary text-slate-950 font-black py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
                  >
                    <span className={`material-symbols-outlined ${isLoading ? 'animate-spin' : ''}`}>
                      {isLoading ? 'psychology' : 'auto_awesome'}
                    </span>
                    <span className="uppercase tracking-tight">{isLoading ? 'Procesando Visión...' : 'Escanear Horario'}</span>
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-xs font-bold flex items-center gap-3 animate-shake">
                <span className="material-symbols-outlined text-lg">warning</span>
                {error}
              </div>
            )}
          </div>

          <div className="bg-primary/5 border border-primary/10 p-5 rounded-3xl flex gap-4">
            <span className="material-symbols-outlined text-primary">verified_user</span>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              Tus datos están protegidos por la US-04 (Cifrado Militar). El procesamiento de imagen ocurre en tiempo real sin almacenar la foto original.
            </p>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7">
          <div className="glass-panel h-full rounded-[32px] overflow-hidden flex flex-col min-h-[600px] border border-white/10 shadow-3xl bg-slate-900/40">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-950/20">
              <div>
                <h2 className="text-2xl font-display font-bold text-white">Resultados de Visión</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                  {syncData.length > 0 ? `Se detectaron ${syncData.length} asignaturas` : 'Esperando procesamiento de IA'}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-sm">filter_list</span>
                </button>
              </div>
            </div>

            <div className="grow p-6 space-y-4 overflow-y-auto max-h-[500px] custom-scrollbar">
              {syncData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20 opacity-30">
                  <span className="material-symbols-outlined text-8xl mb-6">center_focus_weak</span>
                  <p className="text-lg font-medium max-w-xs">Sube una foto legible de tu horario para extraer las materias automáticamente.</p>
                </div>
              ) : (
                syncData.map((subject, idx) => (
                  <div 
                    key={subject.courseId || idx} 
                    className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/10 hover:border-primary/20 transition-all group animate-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        subject.status === 'Aprobada' || subject.status === 'CURSANDO' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-primary/10 text-primary'
                      } group-hover:scale-110 shadow-lg`}>
                        <span className="material-symbols-outlined text-2xl">{getIcon(subject.courseName)}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{subject.courseId}</span>
                          {subject.grade && <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full">{subject.grade}</span>}
                        </div>
                        <h4 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors">{subject.courseName}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {subject.section ? `Sección ${subject.section}` : 'Pendiente de asignar'} • {subject.professor || 'Catedrático por definir'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(subject.status)}`}>
                        {subject.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Card Footer */}
            {syncData.length > 0 && (
              <div className="p-6 bg-slate-950/40 border-t border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">Estudiantes sincronizados hoy</p>
                </div>
                <button 
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-primary/10 text-primary px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-primary hover:text-slate-950 transition-all border border-primary/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? 'Guardando...' : 'Confirmar y Guardar'}
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncHub;

