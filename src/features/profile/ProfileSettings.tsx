import React, { useState } from 'react';

/**
 * US-01/03: Gestión de Zonas Prohibidas y Desplazamiento
 */
const ProfileSettings: React.FC = () => {
  const [transportTime, setTransportTime] = useState(45);
  const [blockedZones, _setBlockedZones] = useState([
    { day: 'Lunes', start: '08:00', end: '12:00', label: 'Trabajo' },
    { day: 'Miércoles', start: '18:00', end: '22:00', label: 'Entrenamiento' }
  ]);

  return (
    <div className="space-y-12 animate-fade-in">
      <div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">Configuración Académica</h2>
        <p className="text-on-surface-variant">Define tus parámetros logísticos para que la IA genere el horario perfecto.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Logística de Desplazamiento (US-03) */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary">commute</span>
            <h3 className="text-xl font-bold text-white">Logística (US-03)</h3>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-on-surface-variant">Tiempo de desplazamiento (minutos)</label>
                <span className="text-primary font-bold">{transportTime} min</span>
              </div>
              <input 
                type="range" 
                min="15" 
                max="120" 
                value={transportTime}
                onChange={(e) => setTransportTime(parseInt(e.target.value))}
                className="w-full accent-primary bg-white/5 h-2 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <p className="text-xs text-on-surface-variant italic">
              * La IA evitará clases con menos de {transportTime} minutos de margen entre sedes.
            </p>
          </div>
        </div>

        {/* Zonas Prohibidas (US-01) */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-error">event_busy</span>
            <h3 className="text-xl font-bold text-white">Zonas Prohibidas (US-01)</h3>
          </div>
          <div className="space-y-4">
            {blockedZones.map((zone, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-error/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">{zone.day}</div>
                  <div>
                    <div className="text-white font-medium">{zone.label}</div>
                    <div className="text-xs text-on-surface-variant">{zone.start} - {zone.end}</div>
                  </div>
                </div>
                <button className="material-symbols-outlined text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-all">delete</button>
              </div>
            ))}
            <button className="w-full py-3 rounded-xl border border-dashed border-white/10 text-on-surface-variant hover:bg-white/5 hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">add</span>
              Añadir Bloqueo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
