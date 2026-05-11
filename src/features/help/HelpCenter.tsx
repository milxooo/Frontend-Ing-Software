import React, { useState, useEffect } from 'react';
import { createChatSession, sendChatMessage } from '../../services/api';

const HelpCenter: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: '¡Hola! Soy tu asistente de OptimaAcademia. ¿En qué puedo ayudarte con tus procesos internacionales hoy?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize chat session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        const id = await createChatSession();
        setSessionId(id);
      } catch (error) {
        console.error('Error al iniciar sesión de chat:', error);
      }
    };
    initSession();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !sessionId || loading) return;
    
    const userMessage = inputValue;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await sendChatMessage(sessionId, userMessage);
      setMessages(prev => [...prev, { role: 'ai', text: response.response || 'No pude procesar tu respuesta.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Error de conexión con el asistente. Reintenta en unos segundos.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-primary/30">
      <main className="max-w-7xl mx-auto px-6 py-12 pb-32">
        {/* Header Section */}
        <section className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Soporte 24/7 Activo</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
            ¿Cómo podemos <span className="italic font-light">ayudarte?</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl leading-relaxed font-medium">
            Consulta procesos internacionales, requisitos de visa y fechas académicas con nuestro motor de asistencia inteligente.
          </p>
        </section>

        {/* Bento Grid Actions */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
          <div className="md:col-span-2 glass-panel p-8 rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-8xl">description</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary text-3xl">description</span>
            </div>
            <h3 className="text-2xl font-bold mb-3">Requisitos de Intercambio</h3>
            <p className="text-slate-400 font-medium mb-6">Toda la documentación necesaria para homologaciones y convenios globales.</p>
            <button className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
              Ver Listado <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="glass-panel p-8 rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-emerald-400 text-3xl">calendar_today</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Fechas Límite</h3>
            <p className="text-sm text-slate-500 font-medium">Calendario de convocatorias 2024-2025.</p>
          </div>

          <div className="glass-panel p-8 rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-amber-400 text-3xl">explore</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Destinos</h3>
            <p className="text-sm text-slate-500 font-medium">Mapa de convenios internacionales.</p>
          </div>
        </section>

        {/* Info Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* FAQs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black tracking-tight">Preguntas Frecuentes</h2>
              <span className="text-primary font-bold text-xs">Ver Todo</span>
            </div>
            <div className="space-y-4">
              {[
                '¿Cómo solicito el certificado de notas internacional?',
                'Plazos para becas Erasmus+ 2024',
                'Validación de créditos en universidades US',
                'Seguro médico obligatorio para Asia'
              ].map((faq, i) => (
                <div key={i} className="group glass-panel p-6 rounded-2xl border border-white/5 hover:bg-white/5 transition-all cursor-pointer flex items-center justify-between">
                  <p className="font-bold text-slate-300 group-hover:text-white transition-colors">{faq}</p>
                  <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors">add_circle</span>
                </div>
              ))}
            </div>
          </div>

          {/* Process Tracker Visual */}
          <div className="lg:col-span-7">
            <div className="glass-panel h-full rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-primary/10 blur-[100px] rounded-full"></div>
              
              <div>
                <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-4xl">travel_explore</span>
                  Estado de tu Aplicación
                </h2>
                <div className="space-y-10">
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black uppercase tracking-tighter text-slate-500">Paso 1: Documentación</span>
                      <span className="text-xs font-bold text-emerald-400">Completado</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black uppercase tracking-tighter text-slate-500">Paso 2: Validación Académica</span>
                      <span className="text-xs font-bold text-primary italic">En proceso...</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full w-[65%] bg-primary shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-pulse"></div>
                    </div>
                  </div>

                  <div className="relative opacity-40">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black uppercase tracking-tighter text-slate-500">Paso 3: Entrevista</span>
                      <span className="text-xs font-bold text-slate-500">Pendiente</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-slate-950/50 p-6 rounded-2xl border border-white/5 flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 shrink-0">
                  <span className="material-symbols-outlined text-slate-500">contact_support</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">¿Necesitas hablar con un asesor?</p>
                  <p className="text-xs text-slate-500 font-medium">Horario de atención: Lun - Vie | 8:00 AM - 6:00 PM</p>
                </div>
                <button className="ml-auto bg-white text-slate-950 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                  Agendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Chat UI */}
      <div className={`fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 transition-all duration-500 ${chatOpen ? 'w-[400px]' : 'w-16'}`}>
        {/* Chat Window */}
        <div className={`w-full glass-panel rounded-[2rem] border border-primary/20 shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 origin-bottom-right ${chatOpen ? 'scale-100 opacity-100 h-[550px]' : 'scale-0 opacity-0 h-0'}`}>
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-primary/10 to-transparent border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-white text-2xl">smart_toy</span>
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-950"></span>
              </div>
              <div>
                <h4 className="font-bold text-white tracking-tight">Asistente Optima</h4>
                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">IA Inteligente</p>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-slate-400">close</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="h-[340px] overflow-y-auto p-6 space-y-6 bg-slate-950/30 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl font-medium text-sm leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10' 
                  : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-slate-900/40 border-t border-white/5">
            <div className="relative">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe tu duda aquí..."
                className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 pl-6 pr-14 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium"
              />
              <button 
                onClick={handleSendMessage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-xl">send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <button 
          onClick={() => setChatOpen(!chatOpen)}
          className={`w-16 h-16 rounded-[1.5rem] shadow-2xl flex items-center justify-center transition-all duration-500 active:scale-90 ${
            chatOpen ? 'bg-slate-900 text-slate-400 rotate-90' : 'bg-primary text-white hover:scale-110 shadow-primary/20'
          }`}
        >
          <span className="material-symbols-outlined text-3xl">
            {chatOpen ? 'close' : 'chat_bubble'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default HelpCenter;
