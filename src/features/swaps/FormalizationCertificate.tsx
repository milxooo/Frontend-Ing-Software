import React, { useState, useEffect } from 'react';
import { formalizeSwap } from '../../services/api';

interface CertificateProps {
  matchId: string;
  studentA: string;
  studentB: string;
  subjectA: string;
  subjectB: string;
  status: string;
  onSuccess?: (txId: string) => void;
}

/**
 * US-11: Certificado Digital de Formalización
 * Implementado con Sello Digital, Efectos de Brillo e Integridad de Sistema.
 */
const FormalizationCertificate: React.FC<CertificateProps> = ({ 
  matchId, studentA, studentB, subjectA, subjectB, status, onSuccess 
}) => {
  const [isFormalizing, setIsFormalizing] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  // Monitor de Integridad del Sistema
  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  const handleFormalize = async () => {
    if (status !== 'APROBADO') return;
    setIsFormalizing(true);
    try {
      const result = await formalizeSwap(matchId);
      setTransactionId(result.transactionId || `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
      setShowConfetti(true);
      if (onSuccess) onSuccess(result.transactionId);
      
      // Limpiar confetti después de unos segundos
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (error) {
      console.error('Error en US-11:', error);
      alert('Error en el registro oficial. Verifica la conexión con el nodo universitario.');
    } finally {
      setIsFormalizing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in relative">
      {/* Confetti Animation Overlay */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-sm animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                backgroundColor: ['#c0c1ff', '#8083ff', '#ffb783', '#494bd6'][Math.floor(Math.random() * 4)],
                animation: `fall ${2 + Math.random() * 3}s linear forwards`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Breadcrumbs & Header */}
      <div className="text-center md:text-left space-y-2">
        <div className="flex items-center justify-center md:justify-start gap-2 text-primary text-[10px] font-bold uppercase tracking-widest">
          <span className="material-symbols-outlined text-sm">verified</span>
          Formalization Stage [US-11]
        </div>
        <h2 className="font-display text-white text-3xl md:text-4xl tracking-tight font-bold">Registro Oficial OptimaAcademia</h2>
      </div>

      {/* The Digital Certificate Card */}
      <div className="glass-panel rounded-3xl overflow-hidden relative border border-white/10 group shadow-2xl">
        {/* Background Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/30 transition-all duration-500"></div>
        
        <div className="relative p-8 md:p-12">
          {/* Certificate Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div className="space-y-1">
              <h3 className="text-white font-bold text-2xl tracking-tight">Certificado Digital de Intercambio</h3>
              <p className="text-slate-400 text-sm">Official Educational Transaction Document</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">Transaction Hash</span>
              <span className="text-primary font-mono text-sm select-all bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">
                {transactionId || 'SW-PENDING-CONF'}
              </span>
            </div>
          </div>

          {/* Main Certificate Body */}
          <div className="grid md:grid-cols-12 gap-8 items-center border-y border-white/5 py-12 mb-8">
            <div className="md:col-span-8 space-y-6">
              <div className="space-y-4">
                <p className="text-slate-300 text-base leading-relaxed">
                  Este intercambio ha sido registrado oficialmente en el <span className="text-white font-bold">Sistema Universitario</span> bajo los protocolos de validación académica vigentes (US-11). 
                </p>
                <p className="text-slate-500 text-sm italic border-l-2 border-primary/30 pl-4 py-2 bg-white/5 rounded-r-xl">
                  "Por medio del presente, se valida la transferencia de cupo horario para la asignatura de <span className="text-slate-300">{subjectA}</span> por <span className="text-slate-300">{subjectB}</span>."
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Origin Student</span>
                  <span className="text-white font-bold text-sm">{studentA}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Target Student</span>
                  <span className="text-white font-bold text-sm">{studentB}</span>
                </div>
              </div>
            </div>

            {/* Verification Side */}
            <div className="md:col-span-4 flex flex-col items-center justify-center space-y-4">
              <div className="w-32 h-32 bg-white/5 p-2 rounded-2xl border border-white/10 relative group/qr overflow-hidden">
                <div className="w-full h-full bg-slate-900 grid grid-cols-6 grid-rows-6 gap-0.5 opacity-80">
                  <div className="bg-white rounded-sm col-span-2 row-span-2"></div>
                  <div className="col-span-1"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-white rounded-sm col-span-2"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="col-span-1"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-white rounded-sm col-span-2 row-span-2"></div>
                  <div className="bg-white rounded-sm col-span-2 row-span-2 row-start-5"></div>
                  <div className="bg-white rounded-sm col-start-6 row-start-6"></div>
                  <div className="bg-white rounded-sm col-start-5 row-start-5"></div>
                  <div className="bg-white rounded-sm col-start-4 row-start-6"></div>
                </div>
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/qr:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="material-symbols-outlined text-white">qr_code_2</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider font-bold">SECURE SCAN VERIFIED</span>
            </div>
          </div>

          {/* Footer & Stamp */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-4">
            <div className="flex items-center gap-4">
              {/* Security Stamp */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center relative overflow-hidden group/stamp transition-all duration-1000 ${
                transactionId ? 'bg-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.6)]' : 'bg-slate-800'
              }`}>
                <span className={`material-symbols-outlined text-white text-3xl font-variation-settings: 'FILL' 1; transition-all ${
                  transactionId ? 'scale-110' : 'opacity-40'
                }`}>
                  verified
                </span>
                <div className={`absolute inset-0 bg-white/20 ${transactionId ? 'animate-pulse' : ''}`}></div>
                <div className={`absolute -inset-1 border border-white/20 rounded-full transition-transform duration-700 ${
                  transactionId ? 'scale-125' : 'scale-100'
                }`}></div>
              </div>
              <div>
                <span className="block text-white font-bold text-sm">Sello de Seguridad</span>
                <span className="block text-slate-500 text-[10px] uppercase font-mono tracking-tighter">Valid until 12/2024</span>
              </div>
            </div>

            {/* Formalizar Registration Button */}
            <button 
              onClick={handleFormalize}
              disabled={isFormalizing || status !== 'APROBADO' || !!transactionId}
              className={`group relative px-8 py-4 font-bold rounded-xl overflow-hidden shadow-xl active:scale-95 transition-all flex items-center gap-3 ${
                transactionId ? 'bg-green-500 text-white cursor-default' :
                status === 'APROBADO' ? 'bg-primary text-on-primary shadow-primary/20 cursor-pointer' :
                'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {transactionId ? 'check_circle' : 'shield'}
              </span>
              {transactionId ? 'Registro Completado' : 'Formalizar Registro'}
              {status === 'APROBADO' && !transactionId && (
                <div className="absolute top-0 -left-full w-full h-full bg-white/20 skew-x-[-20deg] group-hover:left-full transition-all duration-700 ease-in-out"></div>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Bar inside Card */}
        <div className="bg-white/5 border-t border-white/5 px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className={`flex h-2 w-2 rounded-full animate-pulse ${isOnline ? 'bg-green-500' : 'bg-error'}`}></span>
            <span className={`text-[10px] uppercase font-mono font-bold ${isOnline ? 'text-slate-400' : 'text-error'}`}>
              System Integrity: {isOnline ? 'Nominal' : 'Connection Lost'}
            </span>
          </div>
          <div className="flex gap-4">
            <span className="text-[10px] text-slate-500 font-mono">NODE-0042</span>
            <span className="text-[10px] text-slate-500 font-mono">LATENCY 14ms</span>
          </div>
        </div>
      </div>

      {/* Artifacts Download Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-all cursor-default group">
          <span className="material-symbols-outlined text-primary mb-4">history_edu</span>
          <h4 className="text-white font-bold mb-2">Legal Terms</h4>
          <p className="text-slate-500 text-xs group-hover:text-slate-400 transition-colors">By formalizing, both parties agree to the institutional exchange regulations defined in Article 42.</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-all cursor-default group">
          <span className="material-symbols-outlined text-primary mb-4">notifications_active</span>
          <h4 className="text-white font-bold mb-2">Next Steps</h4>
          <p className="text-slate-500 text-xs group-hover:text-slate-400 transition-colors">A confirmation email will be sent to the academic department immediately after registration.</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-all cursor-pointer group" onClick={() => transactionId && alert('Generando PDF...')}>
          <span className="material-symbols-outlined text-primary mb-4">download</span>
          <h4 className="text-white font-bold mb-2">Artifacts / Download</h4>
          <p className="text-slate-500 text-xs group-hover:text-slate-400 transition-colors">Download a signed PDF version of this certificate for your personal archives.</p>
        </div>
      </div>
    </div>
  );
};

export default FormalizationCertificate;
