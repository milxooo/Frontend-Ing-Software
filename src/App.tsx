import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Briefcase, 
  Heart, 
  Plus, 
  List, 
  Calendar as CalendarIcon, 
  X, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  BookOpen,
  Edit2,
  Trash2,
  Car,
  Bus,
  Footprints,
  AlertTriangle,
  Settings2
} from 'lucide-react';
import { format, startOfWeek, addWeeks, subWeeks, addDays, isSameDay, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Block, LogisticsConfig } from './types';
import { ForbiddenZonesService } from './services/forbidden-zones.service';

const hours = Array.from({ length: 13 }, (_, i) => i + 6); // 6:00 to 18:00 (extended to 18 to fit mockup)

export default function App() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'list'>('calendar');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Logistics State
  const [logisticsConfig, setLogisticsConfig] = useState<LogisticsConfig>({
    mode: 'bus',
    baseTime: 60,
    bufferTime: 15
  });
  const [isLogisticsModalOpen, setIsLogisticsModalOpen] = useState(false);
  
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());

  // Toast state
  const [toast, setToast] = useState<{show: boolean, type: 'success'|'error', message: string}>({show: false, type: 'success', message: ''});

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      setIsLoading(true);
      const data = await ForbiddenZonesService.getAll();
      setBlocks(data || []);
    } catch (error) {
      console.error("Error fetching blocks:", error);
      setBlocks([]); // Ensure it's empty on error, no pre-configured dummy data
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (type: 'success'|'error', message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ ...toast, show: false }), 5000);
  };

  const handleSaveBlock = async (block: Block) => {
    try {
      // Map frontend properties to backend expected properties
      const backendPayload = {
        ...block,
        recurrenceStartDate: block.startDate,
        recurrenceEndDate: block.endDate
      };
      
      if (selectedBlock) {
        await ForbiddenZonesService.update(block.id, backendPayload);
        setBlocks(blocks.map(b => b.id === block.id ? { ...block, ...backendPayload, startDate: backendPayload.recurrenceStartDate, endDate: backendPayload.recurrenceEndDate } : b));
        showToast('success', 'Bloque actualizado correctamente');
      } else {
        const { id, ...newBlock } = backendPayload;
        const savedBlock = await ForbiddenZonesService.create(newBlock);
        setBlocks([...blocks, savedBlock]);
        showToast('success', 'Bloque guardado correctamente');
      }
      setIsFormOpen(false);
      setSelectedBlock(null);
    } catch (error: any) {
      console.error("Error saving block:", error);
      const isConnectionError = error.name === 'AbortError' || error.message.includes('Failed to fetch') || error.message.includes('NetworkError');
      const errorMsg = isConnectionError 
        ? 'El servidor tardó en responder o está desconectado. Revisa tu BD y Redis.' 
        : (error.message || 'Error desconocido');
        
      showToast('error', errorMsg);
    }
  };

  const handleDeleteBlock = async (id: string) => {
    try {
      if (id.startsWith('manual-log')) {
        setLogisticsConfig(prev => ({ ...prev, departureDay: undefined, departureTime: undefined }));
        setSelectedBlock(null);
        showToast('success', 'Viaje eliminado correctamente');
        return;
      }
      await ForbiddenZonesService.delete(id);
      setBlocks(blocks.filter(b => b.id !== id));
      setSelectedBlock(null);
      showToast('success', 'Bloque eliminado correctamente');
    } catch (error: any) {
      console.error("Error deleting block:", error);
      const isConnectionError = error.message.includes('Failed to fetch') || error.message.includes('NetworkError');
      const errorMsg = isConnectionError 
        ? 'No se pudo conectar al servidor para eliminar.' 
        : (error.message || 'Error al eliminar el bloque.');
        
      showToast('error', errorMsg);
    }
  };

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = addDays(weekStart, 6);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

  return (
    <div className="app-container">
      {/* Desktop Header */}
      <header className="bg-white px-8 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              E
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">Enrollment Optimizer</h1>
          </div>
          
          <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

          <div className="flex bg-gray-100 p-1 rounded-lg mr-4">
            <button 
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'calendar' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveTab('calendar')}
            >
              <CalendarIcon size={16} />
              Calendario
            </button>
            <button 
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveTab('list')}
            >
              <List size={16} />
              Lista
            </button>
          </div>
          
          <button 
            className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            onClick={() => setIsLogisticsModalOpen(true)}
          >
            <Settings2 size={18} className="mr-2" />
            Configuración Logística
          </button>
        </div>

        <div className="flex items-center gap-6">
          {/* Week Navigation */}
          {activeTab === 'calendar' && (
            <div className="flex items-center gap-4">
              <button className="btn-icon" onClick={handlePrevWeek}><ChevronLeft size={20} /></button>
              <div className="text-center min-w-[160px]">
                <p className="text-sm font-semibold text-gray-900 capitalize">
                  {format(weekStart, "d MMM", { locale: es })} - {format(weekEnd, "d MMM yyyy", { locale: es })}
                </p>
              </div>
              <button className="btn-icon" onClick={handleNextWeek}><ChevronRight size={20} /></button>
            </div>
          )}

          <button 
            className="btn btn-primary"
            onClick={() => { setSelectedBlock(null); setIsFormOpen(true); }}
          >
            <Plus size={18} className="mr-2" />
            Nuevo Bloque
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col bg-gray-50">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : activeTab === 'calendar' ? (
          <CalendarView blocks={blocks} weekDays={weekDays} logisticsConfig={logisticsConfig} onBlockClick={setSelectedBlock} />
        ) : (
          <ListView blocks={blocks} onBlockClick={setSelectedBlock} />
        )}
      </main>

      {/* Modals & Overlays */}
      {isLogisticsModalOpen && (
        <LogisticsModal 
          config={logisticsConfig}
          onClose={() => setIsLogisticsModalOpen(false)}
          onSave={(cfg) => {
            setLogisticsConfig(cfg);
            setIsLogisticsModalOpen(false);
            showToast('success', 'Perfil logístico actualizado');
          }}
        />
      )}

      {isFormOpen && (
        <BlockForm 
          block={selectedBlock || undefined}
          onClose={() => { setIsFormOpen(false); setSelectedBlock(null); }}
          onSave={handleSaveBlock}
        />
      )}

      {selectedBlock && !isFormOpen && (
        <BlockDetail 
          block={selectedBlock} 
          onClose={() => setSelectedBlock(null)}
          onEdit={() => setIsFormOpen(true)}
          onDelete={() => handleDeleteBlock(selectedBlock.id)}
        />
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {toast.show && (
          <div className={`toast ${toast.type}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${toast.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
              {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            </div>
            <div className="flex-1">
              <h4 className={`font-semibold ${toast.type === 'success' ? 'text-emerald-800' : 'text-red-800'}`}>
                {toast.type === 'success' 
                  ? 'Guardado correctamente' 
                  : (toast.message.includes('conectar') ? 'Error de Conexión' : 'Error de conflicto')}
              </h4>
              <p className={`text-sm mt-1 ${toast.type === 'success' ? 'text-emerald-700' : 'text-red-700'}`}>
                {toast.message}
              </p>
            </div>
            <button className="text-gray-400 hover:text-gray-600" onClick={() => setToast({...toast, show: false})}>
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Component: CalendarView ---
function CalendarView({ blocks, weekDays, logisticsConfig, onBlockClick }: { blocks: Block[], weekDays: Date[], logisticsConfig: LogisticsConfig, onBlockClick: (b: Block) => void }) {
  const today = new Date();

  // Pre-calculate blocks per day to easily find conflicts
  const blocksPerDay: Record<number, any[]> = {};
  let globalConflictMsg = '';

  weekDays.forEach(day => {
    const jsDay = day.getDay();
    const appDayOfWeek = jsDay === 0 ? 7 : jsDay;
    const dayDate = new Date(day);
    dayDate.setHours(0, 0, 0, 0);

    // Get fixed blocks for this specific day
    const fixedBlocks = blocks.filter(b => {
      if (b.dayOfWeek !== appDayOfWeek) return false;
      if (!b.startDate) return true;
      const start = new Date(b.startDate + 'T12:00:00');
      start.setHours(0, 0, 0, 0);
      if (b.isRecurring) {
        if (!b.endDate) return dayDate >= start;
        const end = new Date(b.endDate + 'T12:00:00');
        end.setHours(23, 59, 59, 999);
        return dayDate >= start && dayDate <= end;
      } else {
        return isSameDay(dayDate, start);
      }
    });

    const totalTravel = logisticsConfig ? (logisticsConfig.baseTime + logisticsConfig.bufferTime) : 0;
    const allBlocks = [...fixedBlocks];

    const parseMins = (t: string) => { const [h,m] = t.split(':').map(Number); return h * 60 + m; };
    const formatMins = (m: number) => `${Math.floor(m/60).toString().padStart(2,'0')}:${(m%60).toString().padStart(2,'0')}`;
    const isOverlap = (s1:number, e1:number, s2:number, e2:number) => Math.max(s1, s2) < Math.min(e1, e2);


    if (logisticsConfig && logisticsConfig.departureDay === appDayOfWeek && logisticsConfig.departureTime) {
      const sMins = parseMins(logisticsConfig.departureTime);
      const eMins = sMins + totalTravel;
      
      const isConflict = fixedBlocks.some(other => isOverlap(sMins, eMins, parseMins(other.startTime), parseMins(other.endTime)));
      
      if (isConflict) {
        globalConflictMsg = `Se detectó un conflicto logístico el ${format(day, 'EEEE', {locale: es})}. Tu salida hacia la universidad se solapa con tu bloque programado.`;
      }
      
      allBlocks.push({ id: `manual-log-${appDayOfWeek}`, type: isConflict ? 'CONFLICT' : 'LOGISTICS', startTime: logisticsConfig.departureTime, endTime: formatMins(eMins), dayOfWeek: appDayOfWeek, isRecurring: true });
    }

    blocksPerDay[appDayOfWeek] = allBlocks;
  });

  return (
    <div className="calendar-container flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="calendar-header">
          <div className="bg-white"></div> {/* Empty top-left cell */}
          {weekDays.map((day) => {
            const isActive = isSameDay(day, today);
            return (
              <div key={day.toISOString()} className={`day-header ${isActive ? 'active' : ''}`}>
                <span className="uppercase text-xs font-semibold">{format(day, 'EEE', { locale: es })}</span>
                <span className="date">{format(day, 'd')}</span>
              </div>
            );
          })}
        </div>
        
        <div className="calendar-grid">
          {hours.map(hour => (
            <React.Fragment key={hour}>
              <div className="time-label">{hour}:00</div>
              {weekDays.map((day, dayIndex) => {
                const jsDay = day.getDay();
                const appDayOfWeek = jsDay === 0 ? 7 : jsDay;

                // Find blocks that start in this hour cell on this day
                const cellBlocks = blocksPerDay[appDayOfWeek].filter(b => parseInt(b.startTime.split(':')[0]) === hour);
                
                return (
                  <div key={`${dayIndex}-${hour}`} className="calendar-cell relative">
                    {cellBlocks.map(block => {
                      const [sH, sM] = block.startTime.split(':').map(Number);
                      const [eH, eM] = block.endTime.split(':').map(Number);
                      const durationMins = (eH * 60 + eM) - (sH * 60 + sM);
                      
                      const topOffset = (sM / 60) * 100;
                      const heightPct = (durationMins / 60) * 100;
                      
                      const cssClass = block.type === 'TRABAJO' ? 'block-trabajo' : 
                                       block.type === 'BIENESTAR' ? 'block-bienestar' : 
                                       block.type === 'OTRO' ? 'block-universidad' : 
                                       block.type === 'CONFLICT' ? 'block-conflict' : 'block-logistics';
                      
                      const isFixed = ['TRABAJO', 'BIENESTAR', 'OTRO'].includes(block.type);
                      
                      return (
                        <div 
                          key={block.id}
                          className={`calendar-block absolute w-[calc(100%-8px)] left-[4px] ${cssClass}`}
                          style={{ 
                            top: `${topOffset}%`,
                            height: `calc(${heightPct}% + ${(Math.floor(durationMins/60) - 1) * 1}px)`,
                            zIndex: block.type === 'CONFLICT' ? 20 : isFixed ? 10 : 5
                          }}
                          onClick={() => onBlockClick(block)}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            {block.type === 'TRABAJO' ? <Briefcase size={12} /> : 
                             block.type === 'BIENESTAR' ? <Heart size={12} /> : 
                             block.type === 'OTRO' ? <BookOpen size={12} /> :
                             block.type === 'CONFLICT' ? <AlertTriangle size={12} className="animate-pulse" /> :
                             <Car size={12} />
                            }
                            <span className="font-semibold truncate">
                              {block.type === 'TRABAJO' ? 'Trabajo' : 
                               block.type === 'BIENESTAR' ? 'Bienestar' : 
                               block.type === 'OTRO' ? 'Universidad' : 
                               block.type === 'CONFLICT' ? 'Conflicto' : ''}
                            </span>
                          </div>
                          {isFixed && <span className="text-[11px] opacity-90">{block.startTime} - {block.endTime}</span>}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {globalConflictMsg && (
        <div className="p-4 bg-orange-50 border-t border-orange-200 flex items-start gap-3 text-orange-800 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
          <AlertTriangle className="shrink-0 mt-0.5 text-orange-500" size={20} />
          <p className="font-medium text-sm capitalize">{globalConflictMsg}</p>
        </div>
      )}
    </div>
  );
}

// --- Component: ListView ---
function ListView({ blocks, onBlockClick }: { blocks: Block[], onBlockClick: (b: Block) => void }) {
  const daysMap = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  if (blocks.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
          <CalendarIcon size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">No hay bloques configurados</h2>
        <p className="text-gray-500 max-w-md">Comienza agregando zonas de trabajo o bienestar para organizar tu disponibilidad semanal.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Todos los Bloques</h2>
          <p className="text-gray-500">{blocks.length} bloques configurados</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blocks.map(block => (
          <div 
            key={block.id} 
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 flex items-start gap-4 cursor-pointer hover:border-gray-300 hover:shadow-md transition"
            onClick={() => onBlockClick(block)}
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${block.type === 'TRABAJO' ? 'bg-blue-50 text-blue-600' : block.type === 'BIENESTAR' ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600'}`}>
              {block.type === 'TRABAJO' ? <Briefcase size={24} /> : block.type === 'BIENESTAR' ? <Heart size={24} /> : <BookOpen size={24} />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900 text-lg">
                  {block.type === 'TRABAJO' ? 'Trabajo' : block.type === 'BIENESTAR' ? 'Bienestar' : 'Universidad'}
                </h3>
                {block.isRecurring ? <span className="badge badge-gray">Semanal</span> : <span className="badge badge-gray">Día único</span>}
              </div>
              <p className="text-gray-500 font-medium mb-3">
                {block.isRecurring ? daysMap[block.dayOfWeek - 1] : format(new Date((block.startDate||'') + 'T12:00:00'), 'dd MMM yyyy', {locale: es})}
              </p>
              <div className="flex items-center gap-1.5 text-gray-600 text-sm bg-gray-50 inline-flex px-3 py-1.5 rounded-lg border border-gray-100">
                <Clock size={14} />
                <span className="font-medium">{block.startTime} - {block.endTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Component: BlockForm ---
function BlockForm({ block, onClose, onSave }: { block?: Block, onClose: () => void, onSave: (b: Block) => Promise<void> | void }) {
  const [isSaving, setIsSaving] = useState(false);
  
  const today = new Date();
  const defaultStartDate = format(today, 'yyyy-MM-dd');
  const defaultEndDate = format(addMonths(today, 4), 'yyyy-MM-dd'); // 4 meses de semestre
  
  const [formData, setFormData] = useState<Partial<Block>>(block || {
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '11:00',
    type: 'TRABAJO',
    isRecurring: true,
    startDate: defaultStartDate,
    endDate: defaultEndDate
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        id: block?.id || Math.random().toString(36).substr(2, 9)
      } as Block);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="overlay">
      <div className="modal-content">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <button type="button" className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200" onClick={onClose}>
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-900">{block ? 'Editar Bloque' : 'Nuevo Bloque'}</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Horario */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hora inicio</label>
              <div className="relative">
                <input 
                  type="time" 
                  className="input-field pr-10" 
                  value={formData.startTime}
                  onChange={e => setFormData({...formData, startTime: e.target.value})}
                />
                <Clock className="absolute right-3 top-3 text-gray-400" size={18} />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hora fin</label>
              <div className="relative">
                <input 
                  type="time" 
                  className="input-field pr-10" 
                  value={formData.endTime}
                  onChange={e => setFormData({...formData, endTime: e.target.value})}
                />
                <Clock className="absolute right-3 top-3 text-gray-400" size={18} />
              </div>
            </div>
          </div>

          {/* Tipo de bloque */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de bloque</label>
            <div className="radio-group">
              <label className="radio-card">
                <input 
                  type="radio" 
                  name="type" 
                  checked={formData.type === 'TRABAJO'}
                  onChange={() => setFormData({...formData, type: 'TRABAJO'})}
                />
                <div className="radio-content type-trabajo">
                  <Briefcase size={18} />
                  <span>Trabajo</span>
                </div>
              </label>
              <label className="radio-card">
                <input 
                  type="radio" 
                  name="type" 
                  checked={formData.type === 'BIENESTAR'}
                  onChange={() => setFormData({...formData, type: 'BIENESTAR'})}
                />
                <div className="radio-content type-bienestar">
                  <Heart size={18} />
                  <span>Bienestar</span>
                </div>
              </label>
              <label className="radio-card">
                <input 
                  type="radio" 
                  name="type" 
                  checked={formData.type === 'OTRO'}
                  onChange={() => setFormData({...formData, type: 'OTRO'})}
                />
                <div className="radio-content type-universidad">
                  <BookOpen size={18} />
                  <span>Universidad</span>
                </div>
              </label>
            </div>
          </div>

          {/* Recurrencia */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <label className="font-semibold text-gray-700">Repetir semanalmente</label>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={formData.isRecurring}
                  onChange={e => {
                    const isRec = e.target.checked;
                    setFormData({
                      ...formData, 
                      isRecurring: isRec
                    });
                  }}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            {formData.isRecurring ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Día de la semana</label>
                  <select 
                    className="input-field cursor-pointer"
                    value={formData.dayOfWeek}
                    onChange={e => setFormData({...formData, dayOfWeek: parseInt(e.target.value)})}
                  >
                    <option value={1}>Lunes</option>
                    <option value={2}>Martes</option>
                    <option value={3}>Miércoles</option>
                    <option value={4}>Jueves</option>
                    <option value={5}>Viernes</option>
                    <option value={6}>Sábado</option>
                    <option value={7}>Domingo</option>
                  </select>
                </div>
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Fecha de inicio</label>
                    <input type="date" className="input-field py-2" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Fecha de fin</label>
                    <input type="date" className="input-field py-2" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha exacta</label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={formData.startDate} 
                  onChange={e => {
                    const dateVal = e.target.value;
                    const dateObj = new Date(dateVal + 'T12:00:00');
                    const day = dateObj.getDay() || 7;
                    setFormData({
                      ...formData, 
                      startDate: dateVal, 
                      endDate: dateVal,
                      dayOfWeek: day
                    });
                  }} 
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
            <button type="button" className="btn btn-secondary flex-1" onClick={onClose} disabled={isSaving}>Cancelar</button>
            <button type="submit" className="btn btn-primary flex-1 flex justify-center items-center gap-2" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Component: BlockDetail ---
function BlockDetail({ block, onClose, onEdit, onDelete }: { block: Block, onClose: () => void, onEdit: () => void, onDelete: () => void }) {
  const daysMap = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  return (
    <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${block.type === 'TRABAJO' ? 'bg-blue-500' : block.type === 'BIENESTAR' ? 'bg-emerald-500' : block.type === 'OTRO' ? 'bg-purple-500' : block.type === 'CONFLICT' ? 'bg-orange-500' : 'bg-teal-500'}`}></div>
              <span className="text-xs font-bold text-gray-500 tracking-wider">
                {block.type === 'TRABAJO' ? 'TRABAJO' : block.type === 'BIENESTAR' ? 'BIENESTAR' : block.type === 'OTRO' ? 'UNIVERSIDAD' : block.type === 'CONFLICT' ? 'CONFLICTO LOGÍSTICO' : 'DESPLAZAMIENTO'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {['LOGISTICS', 'CONFLICT'].includes(block.type) ? 'Viaje a la Universidad' : `Bloque de ${block.type === 'TRABAJO' ? 'Trabajo' : block.type === 'BIENESTAR' ? 'Bienestar' : 'Universidad'}`}
            </h2>
          </div>
          <button className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200 transition" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-6 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div className="flex gap-4 items-start">
            <div className="bg-white p-3 rounded-xl text-gray-500 shadow-sm border border-gray-100">
              <CalendarIcon size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Día</p>
              <p className="font-bold text-gray-900 text-lg">
                {block.isRecurring ? daysMap[block.dayOfWeek - 1] : format(new Date((block.startDate||'') + 'T12:00:00'), 'dd MMMM yyyy', {locale: es})}
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="bg-white p-3 rounded-xl text-gray-500 shadow-sm border border-gray-100">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Horario</p>
              <p className="font-bold text-gray-900 text-lg">{block.startTime} - {block.endTime}</p>
            </div>
          </div>

          {block.isRecurring ? (
            <div className="flex gap-4 items-start">
              <div className="bg-white p-3 rounded-xl text-gray-500 shadow-sm border border-gray-100">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Recurrencia</p>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge badge-gray">Semanal</span>
                </div>
                {block.startDate && block.endDate && (
                  <p className="text-sm text-gray-600 font-medium">{format(new Date(block.startDate + 'T12:00:00'), 'dd MMM yyyy', {locale: es})} al {format(new Date(block.endDate + 'T12:00:00'), 'dd MMM yyyy', {locale: es})}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex gap-4 items-start">
              <div className="bg-white p-3 rounded-xl text-gray-500 shadow-sm border border-gray-100">
                <CalendarIcon size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Fecha Específica</p>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge badge-gray">Día único</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          {!['LOGISTICS', 'CONFLICT'].includes(block.type) && (
            <button className="btn btn-secondary flex-1 border border-gray-200" onClick={onEdit}>
              <Edit2 size={18} className="mr-2" />
              Editar
            </button>
          )}
          <button className="btn bg-red-50 text-red-600 hover:bg-red-100 flex-1 border border-red-100" onClick={onDelete}>
            <Trash2 size={18} className="mr-2" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Component: LogisticsModal ---
function LogisticsModal({ config, onClose, onSave }: { config: LogisticsConfig, onClose: () => void, onSave: (c: LogisticsConfig) => void }) {
  const [formData, setFormData] = useState<LogisticsConfig>({
    ...config,
    departureDay: config.departureDay || 1,
    departureTime: config.departureTime || '08:00'
  });
  
  return (
    <div className="overlay z-50">
      <div className="modal-content max-w-md w-full bg-white shadow-2xl rounded-3xl p-8 relative">
        <button type="button" className="absolute top-6 right-6 bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200" onClick={onClose}>
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tiempos de Desplazamiento</h2>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Define cuánto tardas en llegar a la U. Esto asegura que el horario propuesto sea logísticamente viable y no se asigne clase en tus tiempos de viaje.
        </p>
        
        {/* Modes */}
        <div className="flex gap-4 mb-10 justify-center">
           <button 
             className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all w-28 relative overflow-hidden ${formData.mode === 'car' ? 'border-teal-500 text-teal-700 bg-teal-50 ring-4 ring-teal-500/20 shadow-md transform scale-105' : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}
             onClick={() => setFormData({...formData, mode: 'car'})}
           >
             {formData.mode === 'car' && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-500"></div>}
             <Car size={32} />
             <span className="text-sm font-bold">Coche</span>
           </button>
           <button 
             className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all w-28 relative overflow-hidden ${formData.mode === 'bus' ? 'border-teal-500 text-teal-700 bg-teal-50 ring-4 ring-teal-500/20 shadow-md transform scale-105' : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}
             onClick={() => setFormData({...formData, mode: 'bus'})}
           >
             {formData.mode === 'bus' && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-500"></div>}
             <Bus size={32} />
             <span className="text-sm font-bold">Autobús</span>
           </button>
           <button 
             className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all w-28 relative overflow-hidden ${formData.mode === 'walk' ? 'border-teal-500 text-teal-700 bg-teal-50 ring-4 ring-teal-500/20 shadow-md transform scale-105' : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}
             onClick={() => setFormData({...formData, mode: 'walk'})}
           >
             {formData.mode === 'walk' && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-500"></div>}
             <Footprints size={32} />
             <span className="text-sm font-bold">Caminando</span>
           </button>
        </div>
        
        {/* Base Time Slider */}
        <div className="mb-10">
          <p className="font-semibold text-gray-700 text-sm mb-4">Tiempo de Traslado Base</p>
          <div className="text-center mb-6">
            <span className="text-gray-500 font-medium">Tardas</span>
            <span className="text-5xl font-bold text-teal-600 mx-3">{formData.baseTime}</span>
            <span className="text-gray-500 font-medium">minutos</span>
          </div>
          <div className="px-2">
            <input 
              type="range" min="0" max="180" step="15" 
              value={formData.baseTime} 
              onChange={e => setFormData({...formData, baseTime: parseInt(e.target.value)})} 
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500" 
            />
            <div className="flex justify-between text-xs font-medium text-gray-400 mt-3">
               <span>0</span><span>45</span><span>90</span><span>135</span><span>180</span>
            </div>
          </div>
        </div>

        {/* Buffer */}
        <div className="mb-10">
          <p className="font-semibold text-gray-700 text-sm mb-3">Colchón de Seguridad Adicional</p>
          <select 
            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors cursor-pointer appearance-none" 
            value={formData.bufferTime} 
            onChange={e => setFormData({...formData, bufferTime: parseInt(e.target.value)})}
          >
             <option value={0}>Sin colchón</option>
             <option value={15}>15 minutos</option>
             <option value={30}>30 minutos</option>
             <option value={45}>45 minutos</option>
          </select>
        </div>
        
        {/* Departure Day/Time */}
        <div className="mb-10 grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-gray-700 text-sm mb-3">Día de salida</p>
            <select 
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors cursor-pointer appearance-none" 
              value={formData.departureDay || 1} 
              onChange={e => setFormData({...formData, departureDay: parseInt(e.target.value)})}
            >
               <option value={1}>Lunes</option>
               <option value={2}>Martes</option>
               <option value={3}>Miércoles</option>
               <option value={4}>Jueves</option>
               <option value={5}>Viernes</option>
               <option value={6}>Sábado</option>
               <option value={7}>Domingo</option>
            </select>
          </div>
          <div>
            <p className="font-semibold text-gray-700 text-sm mb-3">Hora de salida</p>
            <input 
              type="time" 
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors cursor-pointer" 
              value={formData.departureTime || "08:00"} 
              onChange={e => setFormData({...formData, departureTime: e.target.value})}
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold text-lg py-4 rounded-2xl transition-colors shadow-lg shadow-teal-500/20" 
            onClick={() => onSave(formData)}
          >
            Guardar Viaje
          </button>
        </div>
      </div>
    </div>
  );
}
