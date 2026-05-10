import React, { useState, useEffect } from 'react';
import { getDemandConflictReport, getConcurrencyHeatMap } from '../../services/api';

interface DemandEntry {
  courseId: string;
  courseName: string;
  demandCount: number;
  supplyCount: number;
  netDemand: number;
}

interface HeatMapEntry {
  day: string;
  hour: number;
  campus: string;
  freeStudentsCount: number;
}

const AdminReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'demand' | 'heatmap'>('demand');
  const [demandData, setDemandData] = useState<DemandEntry[]>([]);
  const [heatMapData, setHeatMapData] = useState<HeatMapEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'demand') {
        const data = await getDemandConflictReport();
        setDemandData(data);
      } else {
        const data = await getConcurrencyHeatMap();
        setHeatMapData(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">
          Panel de Administración <span className="text-primary">Académica</span>
        </h1>
        <p className="text-on-surface-variant max-w-2xl">
          Visualiza analíticas en tiempo real para optimizar la oferta académica y el uso de la infraestructura física de la universidad.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white/5 p-1 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('demand')}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
            activeTab === 'demand' 
              ? 'bg-primary text-white shadow-lg shadow-primary/25' 
              : 'text-on-surface-variant hover:text-white'
          }`}
        >
          Conflictos de Demanda [US-15]
        </button>
        <button
          onClick={() => setActiveTab('heatmap')}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
            activeTab === 'heatmap' 
              ? 'bg-primary text-white shadow-lg shadow-primary/25' 
              : 'text-on-surface-variant hover:text-white'
          }`}
        >
          Mapa de Concurrencia [US-14]
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-on-surface-variant animate-pulse">Generando reporte inteligente...</p>
        </div>
      ) : error ? (
        <div className="bg-error/10 border border-error/20 p-6 rounded-3xl text-error flex items-center gap-4">
          <span className="material-symbols-outlined">error</span>
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {activeTab === 'demand' ? (
            <DemandReportTable data={demandData} />
          ) : (
            <ConcurrencyHeatMap data={heatMapData} />
          )}
        </div>
      )}
    </div>
  );
};

const DemandReportTable: React.FC<{ data: DemandEntry[] }> = ({ data }) => {
  return (
    <div className="bg-surface-container rounded-3xl border border-white/5 overflow-hidden">
      <div className="p-6 border-b border-white/5 bg-white/2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">analytics</span>
          Materias con Conflictos de Cupos
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/2 text-on-surface-variant text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Código</th>
              <th className="px-6 py-4 font-semibold">Materia</th>
              <th className="px-6 py-4 font-semibold text-center">Demanda (Solicitan)</th>
              <th className="px-6 py-4 font-semibold text-center">Oferta (Liberan)</th>
              <th className="px-6 py-4 font-semibold text-right">Déficit Neto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((entry) => (
              <tr key={entry.courseId} className="hover:bg-white/2 transition-colors group">
                <td className="px-6 py-4 font-mono text-sm text-primary/80">{entry.courseId}</td>
                <td className="px-6 py-4 font-medium text-white">{entry.courseName}</td>
                <td className="px-6 py-4 text-center text-on-surface-variant">{entry.demandCount}</td>
                <td className="px-6 py-4 text-center text-on-surface-variant">{entry.supplyCount}</td>
                <td className="px-6 py-4 text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    entry.netDemand > 0 
                      ? 'bg-error/10 text-error border border-error/20' 
                      : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  }`}>
                    {entry.netDemand > 0 ? `+${entry.netDemand} faltantes` : `${Math.abs(entry.netDemand)} sobrantes`}
                  </span>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-on-surface-variant italic">
                  No hay solicitudes de intercambio pendientes para procesar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ConcurrencyHeatMap: React.FC<{ data: HeatMapEntry[] }> = ({ data }) => {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const hours = Array.from({ length: 15 }, (_, i) => i + 7); // 7:00 to 21:00
  
  // Group by campus
  const campuses = Array.from(new Set(data.map(d => d.campus)));

  return (
    <div className="space-y-6">
      {campuses.map(campus => (
        <div key={campus} className="bg-surface-container rounded-3xl border border-white/5 p-6 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">location_on</span>
            Sedes: {campus}
          </h3>
          
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Hours */}
              <div className="flex mb-4">
                <div className="w-24 shrink-0"></div>
                {hours.map(h => (
                  <div key={h} className="grow text-center text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
                    {h}:00
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="space-y-2">
                {days.map(day => (
                  <div key={day} className="flex items-center gap-2">
                    <div className="w-24 shrink-0 text-xs font-medium text-white">{day}</div>
                    <div className="grow flex gap-1 h-12">
                      {hours.map(hour => {
                        const entry = data.find(d => d.day === day && d.hour === hour && d.campus === campus);
                        const count = entry?.freeStudentsCount || 0;
                        
                        // Color scale based on count
                        let bgColor = 'bg-white/5';
                        if (count > 0 && count <= 5) bgColor = 'bg-primary/20';
                        else if (count > 5 && count <= 15) bgColor = 'bg-primary/40';
                        else if (count > 15 && count <= 30) bgColor = 'bg-primary/60';
                        else if (count > 30) bgColor = 'bg-primary';

                        return (
                          <div 
                            key={hour} 
                            className={`grow rounded-md ${bgColor} flex items-center justify-center transition-all hover:scale-110 hover:z-10 cursor-help group relative`}
                          >
                            {count > 0 && (
                              <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100">{count}</span>
                            )}
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-xl border border-white/10 z-50 transition-opacity">
                              {count} estudiantes libres ({hour}:00 - {hour+1}:00)
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 pt-4 border-t border-white/5">
            <div className="text-xs text-on-surface-variant flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-white/5"></span> Sin estudiantes
            </div>
            <div className="text-xs text-on-surface-variant flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-primary/40"></span> Concurrencia Media
            </div>
            <div className="text-xs text-on-surface-variant flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-primary"></span> Concurrencia Alta
            </div>
          </div>
        </div>
      ))}
      
      {campuses.length === 0 && (
        <div className="bg-surface-container rounded-3xl border border-white/5 p-20 text-center text-on-surface-variant italic">
          No hay datos de concurrencia disponibles para este periodo.
        </div>
      )}
    </div>
  );
};

export default AdminReports;
