import React, { useState } from 'react';
import { confirmSwap, formalizeSwap } from '../../services/api';

/**
 * US-10/11: Mercado de Swaps & Formalización Legal
 * Gestiona el intercambio de cupos entre estudiantes.
 */
const SwapMarket: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedMatches, setConfirmedMatches] = useState<string[]>([]);
  const [formalizedMatches, setFormalizedMatches] = useState<Record<string, string>>({});

  const matches = [
    { id: 'match_001', studentB: 'Mateo Hidalgo', subject: 'Cálculo Diferencial', hash: '8a3f...92c1' },
    { id: 'match_002', studentB: 'Ana García', subject: 'Física Mecánica', hash: 'b2e1...f0a4' }
  ];

  const handleConfirm = async (matchId: string) => {
    setIsProcessing(true);
    try {
      // US-10: Confirmación bilateral (Student A confirma)
      await confirmSwap(matchId, 'santiago-123');
      setConfirmedMatches(prev => [...prev, matchId]);
    } catch (error) {
      console.error('Error confirmando swap:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormalize = async (matchId: string) => {
    setIsProcessing(true);
    try {
      // US-11: Formalización Legal (Genera Sello Digital)
      const result = await formalizeSwap(matchId);
      setFormalizedMatches(prev => ({ ...prev, [matchId]: result.transactionId || 'TX-998877-OK' }));
    } catch (error) {
      console.error('Error formalizando swap:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">Mercado de Swaps (US-12)</h2>
        <p className="text-on-surface-variant">Intercambia cupos de forma segura con validación bilateral y sello digital.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matches.map(match => (
          <div key={match.id} className="glass-card p-8 border-t-4 border-primary">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-xs text-primary font-bold uppercase tracking-widest mb-1">Match Encontrado</div>
                <h3 className="text-2xl font-bold text-white">{match.subject}</h3>
              </div>
              <div className="text-right text-xs text-on-surface-variant">
                ID: {match.id}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary font-bold text-xs">MH</div>
                <div className="text-sm">
                  <span className="text-on-surface-variant">Intercambio con: </span>
                  <span className="text-white font-bold">{match.studentB}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/50 rounded-xl border border-white/5 font-mono text-[10px] text-primary/70 break-all">
                Safety Hash: {match.hash}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {!confirmedMatches.includes(match.id) ? (
                <button 
                  onClick={() => handleConfirm(match.id)}
                  disabled={isProcessing}
                  className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">handshake</span>
                  Confirmar Intercambio (US-10)
                </button>
              ) : !formalizedMatches[match.id] ? (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-xs font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined">check_circle</span>
                    Esperando confirmación bilateral...
                  </div>
                  <button 
                    onClick={() => handleFormalize(match.id)}
                    disabled={isProcessing}
                    className="w-full bg-tertiary text-on-tertiary py-3 rounded-xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-tertiary/20"
                  >
                    <span className="material-symbols-outlined">verified</span>
                    Formalizar con Sello Digital (US-11)
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-400 text-center space-y-2">
                  <div className="font-bold">Intercambio Formalizado</div>
                  <div className="text-[10px] font-mono opacity-80">TX-ID: {formalizedMatches[match.id]}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SwapMarket;
