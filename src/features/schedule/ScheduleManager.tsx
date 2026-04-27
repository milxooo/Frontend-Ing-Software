import React, { useState } from 'react';
import { generateSchedules } from '../../services/api';

/**
 * US-05: Arquitecto de Horarios (IA Engine)
 * Permite gestionar zonas prohibidas y generar propuestas.
 */
const ScheduleManager: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposals, setProposals] = useState<any[]>([]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // US-05: Llamada al motor de IA del backend
      const data = await generateSchedules('santiago-123');
      // Simulamos recepción de propuestas si el backend aún no devuelve datos reales
      setProposals(data.proposals || [
        { id: 1, score: 98, conflictFree: true, desc: 'Optimización máxima: Mañanas libres' },
        { id: 2, score: 92, conflictFree: true, desc: 'Balanceado: Bloques concentrados' }
      ]);
    } catch (error) {
      console.error('Error generando horarios:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-white mb-2">Arquitecto de Horarios</h2>
          <p className="text-on-surface-variant">Configura tus restricciones y deja que la IA optimice tu semestre.</p>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="glow-button bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          {isGenerating ? (
            <>
              <span className="material-symbols-outlined animate-spin">smart_toy</span>
              Calculando...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">psychology</span>
              Generar Propuestas IA
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* US-01: Zonas Prohibidas Selector (Mockup Visual) */}
        <div className="lg:col-span-7 glass-card p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">block</span>
              Zonas Prohibidas (US-01)
            </h3>
            <span className="text-xs text-on-surface-variant uppercase tracking-widest">Arrastra para bloquear</span>
          </div>
          
          <div className="grid grid-cols-6 gap-2 opacity-50">
            {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map(day => (
              <div key={day} className="text-center text-xs font-bold text-on-surface-variant pb-2">{day}</div>
            ))}
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className={`h-8 rounded-md border border-white/5 ${i > 10 && i < 15 ? 'bg-error/20 border-error/30' : 'bg-white/5'}`}></div>
            ))}
          </div>
          <p className="mt-4 text-sm text-on-surface-variant italic">
            * Se han bloqueado 4 horas los lunes y martes por compromisos laborales.
          </p>
        </div>

        {/* US-05: Propuestas Generadas */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">auto_awesome_motion</span>
            Propuestas IA
          </h3>
          
          {proposals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
              <span className="material-symbols-outlined text-4xl text-white/20 mb-4">lightbulb</span>
              <p className="text-on-surface-variant text-sm px-8">Haz clic en "Generar" para que el backend calcule tus mejores opciones.</p>
            </div>
          ) : (
            proposals.map((prop) => (
              <div key={prop.id} className="glass-card p-6 hover:border-primary/50 transition-colors group cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/30">
                    Match: {prop.score}%
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">arrow_forward</span>
                </div>
                <h4 className="text-white font-bold mb-1">{prop.desc}</h4>
                <p className="text-xs text-on-surface-variant">US-05: Propuesta generada con arquitectura hexagonal.</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleManager;
