import React, { useState, useEffect } from 'react';
import { confirmSwapMatch, rejectSwap } from '../../services/api';
import FormalizationCertificate from '../swaps/FormalizationCertificate';

interface SwapMatch {
  id: string;
  peerName: string;
  peerMajor: string;
  subjectGive: string;
  subjectReceive: string;
  timeGive: string;
  timeReceive: string;
  status: 'MATCH' | 'PENDIENTE' | 'APROBADO' | 'FORMALIZADO';
  timestamp: string;
  classroomGive?: string;
  classroomReceive?: string;
}

/**
 * US-10/11: Centro de Confirmación de Swaps
 * Versión Corregida: Sin errores de sintaxis y flujo de formalización integrado.
 */
const SwapMarket: React.FC = () => {
  const [selectedMatch, setSelectedMatch] = useState<SwapMatch | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const [matches, setMatches] = useState<SwapMatch[]>([
    { 
      id: 'SW-98234-MART', 
      peerName: 'Elena Martínez', 
      peerMajor: 'Ingeniería Informática',
      subjectGive: 'Criptografía I',
      subjectReceive: 'Sistemas Distribuidos',
      timeGive: 'Mar 10:00 - 12:00',
      timeReceive: 'Jue 14:00 - 16:00',
      status: 'APROBADO',
      timestamp: 'Hace 12m',
      classroomGive: 'Aula 402',
      classroomReceive: 'Laboratorio L1'
    },
    { 
      id: 'SW-98235-RUIZ', 
      peerName: 'Carlos Ruiz', 
      peerMajor: 'Ciencia de Datos',
      subjectGive: 'Álgebra Lineal',
      subjectReceive: 'Cálculo IV',
      timeGive: 'Lun 08:00 - 10:00',
      timeReceive: 'Mie 08:00 - 10:00',
      status: 'MATCH',
      timestamp: 'Hace 1h'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const pendingMatch = matches.find(m => m.status === 'PENDIENTE');
      if (pendingMatch) {
        console.log('US-10: Polling state for match:', pendingMatch.id);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [matches]);

  const handleReject = async () => {
    if (!selectedMatch) return;
    setIsProcessing(true);
    try {
      await rejectSwap(selectedMatch.id);
      setMatches(prev => prev.filter(m => m.id !== selectedMatch.id));
      setSelectedMatch(null);
    } catch (error) {
      console.error('Error al rechazar:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedMatch) return;
    setIsProcessing(true);
    try {
      const result = await confirmSwapMatch(selectedMatch.id, 'santiago-123');
      setMatches(prev => prev.map(m => 
        m.id === selectedMatch.id ? { ...m, status: result.status || 'PENDIENTE' } : m
      ));
      setSelectedMatch(prev => prev ? { ...prev, status: result.status || 'PENDIENTE' } : null);
      setShowWarning(false);
    } catch (error) {
      console.error('Error en confirmación:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormalizeSuccess = (txId: string) => {
    if (!selectedMatch) return;
    setMatches(prev => prev.map(m => 
      m.id === selectedMatch.id ? { ...m, status: 'FORMALIZADO' } : m
    ));
    setSelectedMatch(prev => prev ? { ...prev, status: 'FORMALIZADO' } : null);
  };

  return (
    <div className="flex gap-8 h-full animate-fade-in">
      {/* Inbox List */}
      <section className="w-1/3 flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
            Matches Encontrados
            <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full">US-10</span>
          </h3>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
          {matches.map(match => (
            <div 
              key={match.id}
              onClick={() => setSelectedMatch(match)}
              className={`glass-panel p-4 rounded-xl border-l-4 transition-all duration-200 cursor-pointer group relative overflow-hidden ${
                selectedMatch?.id === match.id ? 'border-l-primary active-ring bg-white/5' : 'border-l-transparent hover:border-l-primary/30'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary font-bold">
                    {match.peerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{match.peerName}</h4>
                    <p className="text-[10px] text-slate-500">{match.peerMajor} • {match.timestamp}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  match.status === 'PENDIENTE' ? 'bg-tertiary-container/20 text-tertiary animate-pulse' :
                  match.status === 'APROBADO' ? 'bg-green-500/20 text-green-400' :
                  match.status === 'FORMALIZADO' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-primary/10 text-primary'
                }`}>
                  {match.status === 'FORMALIZADO' ? '¡EXITOSO!' : match.status}
                </span>
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">sync_alt</span>
                {match.subjectGive} <span className="text-slate-500">por</span> {match.subjectReceive}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detail View */}
      <section className="flex-1">
        {selectedMatch ? (
          <div className="glass-panel h-full rounded-3xl flex flex-col overflow-hidden relative border-white/10 shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-white/2">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Detalles del Intercambio</h2>
                  <p className="text-xs text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">info</span>
                    ID de Transacción: {selectedMatch.id}
                  </p>
                </div>
                {selectedMatch.status === 'PENDIENTE' && (
                  <div className="bg-tertiary-container/10 text-tertiary text-[10px] font-bold px-4 py-1.5 rounded-full border border-tertiary/20 animate-pulse">
                    Esperando confirmación de la contraparte
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
              {selectedMatch.status === 'APROBADO' || selectedMatch.status === 'FORMALIZADO' ? (
                <FormalizationCertificate 
                  matchId={selectedMatch.id}
                  studentA="Santiago Parra"
                  studentB={selectedMatch.peerName}
                  subjectA={selectedMatch.subjectGive}
                  subjectB={selectedMatch.subjectReceive}
                  status={selectedMatch.status}
                  onSuccess={handleFormalizeSuccess}
                />
              ) : (
                <div className="h-full flex flex-col justify-center">
                  <div className="grid grid-cols-11 items-center gap-6">
                    <div className="col-span-5">
                      <div className="mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Tú entregas</span>
                      </div>
                      <div className="bg-slate-900/50 rounded-2xl p-6 border-l-4 border-indigo-500 group">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                            <span className="material-symbols-outlined">security</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">{selectedMatch.subjectGive}</h3>
                            <p className="text-xs text-slate-400">{selectedMatch.timeGive}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1 flex justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-primary-container font-bold">swap_horiz</span>
                      </div>
                    </div>

                    <div className="col-span-5">
                      <div className="mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Tú recibes</span>
                      </div>
                      <div className="bg-slate-900/50 rounded-2xl p-6 border-l-4 border-cyan-500 group">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
                            <span className="material-symbols-outlined">dns</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">{selectedMatch.subjectReceive}</h3>
                            <p className="text-xs text-slate-400">{selectedMatch.timeReceive}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-white/5 bg-white/1">
              <div className="flex gap-6 relative">
                {selectedMatch.status === 'MATCH' && (
                  <>
                    <button 
                      onMouseEnter={() => setShowWarning(true)}
                      onMouseLeave={() => setShowWarning(false)}
                      onClick={handleConfirm}
                      disabled={isProcessing}
                      className="flex-1 py-4 bg-primary text-on-primary font-bold rounded-xl flex items-center justify-center gap-3 hover:brightness-110"
                    >
                      <span className="material-symbols-outlined">handshake</span>
                      Confirmar Intercambio
                    </button>
                    {showWarning && (
                      <div className="absolute -top-16 left-0 right-0 p-3 bg-slate-900 border border-white/10 rounded-xl text-[10px] text-slate-300">
                        ⚠️ Al confirmar, te comprometes legalmente a realizar este cambio.
                      </div>
                    )}
                  </>
                )}

                {selectedMatch.status === 'PENDIENTE' && (
                  <button disabled className="flex-1 py-4 bg-slate-800 text-slate-500 font-bold rounded-xl flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined animate-spin">sync</span>
                    Esperando a {selectedMatch.peerName}...
                  </button>
                )}

                <button 
                  onClick={handleReject}
                  disabled={isProcessing || selectedMatch.status === 'FORMALIZADO'}
                  className="px-8 py-4 border border-error/30 text-error hover:bg-error/10 font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel h-full rounded-3xl flex flex-col items-center justify-center text-center opacity-40">
            <span className="material-symbols-outlined text-6xl mb-4">move_to_inbox</span>
            <p className="text-lg font-bold">Selecciona un match para ver los detalles</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default SwapMarket;
