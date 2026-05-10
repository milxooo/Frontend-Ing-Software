import React, { useState, useEffect } from 'react';
import '../../styles/us07.css';
import { PrioritySelection } from './PrioritySelection';
import { SmartMatch } from './SmartMatch';
import { getCriticality } from '../../services/api';

/* ── Types ──────────────────────────────────────────────────── */
type CriticalityLevel = 'CRÍTICO' | 'ALTO' | 'MEDIO' | 'BAJO';

interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  attempts: number;
  criticality: CriticalityLevel;
  score: number;
  isKey: boolean;
}

/* ── Initial Data Fallback ──────────────────────────────────── */
const FALLBACK_SUBJECTS: Subject[] = [];

/* ── Helper: badge styling ───────────────────────────────────── */
function criticalityBadge(level: CriticalityLevel) {
  switch (level) {
    case 'CRÍTICO':
      return 'text-app-danger border border-app-danger/50';
    case 'ALTO':
      return 'text-app-warning border border-app-warning/50';
    case 'MEDIO':
      return 'text-yellow-300 border border-yellow-300/50';
    default:
      return 'text-app-success border border-app-success/50';
  }
}

function criticalityScore(level: CriticalityLevel) {
  switch (level) {
    case 'CRÍTICO': return 'text-app-danger';
    case 'ALTO':    return 'text-app-warning';
    case 'MEDIO':   return 'text-yellow-300';
    default:        return 'text-app-success';
  }
}

/* ── Sub-components ──────────────────────────────────────────── */
function SubjectCard({ subject }: { subject: Subject }) {
  return (
    <div className="us07-subject-row bg-app-card border border-app-border rounded-xl p-5 flex items-center gap-4 cursor-pointer">
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
          subject.isKey ? 'bg-[#3f3127]' : 'bg-slate-700/50'
        }`}
      >
        {subject.isKey ? (
          <i className="fa-solid fa-key text-app-warning text-lg" />
        ) : (
          <i className="fa-solid fa-book text-app-textMuted text-lg" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-3 mb-1">
          <h4 className="text-white font-bold text-lg leading-tight">{subject.name}</h4>
          {subject.isKey && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-app-warning bg-app-warning/10 border border-app-warning/20 rounded whitespace-nowrap">
              LLAVE
            </span>
          )}
        </div>
        <p className="text-sm text-app-textMuted">
          {subject.code} • {subject.credits} créditos • Intentos: {subject.attempts}
        </p>
      </div>

      {/* Score */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span
          className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${criticalityBadge(subject.criticality)}`}
        >
          {subject.criticality}
        </span>
        <span className={`text-3xl font-bold ${criticalityScore(subject.criticality)}`}>
          {subject.score}
        </span>
      </div>
    </div>
  );
}

function RiskGauge({ delay }: { delay: number }) {
  return (
    <div className="bg-app-surface rounded-2xl border border-app-border p-6 flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <i className="fa-regular fa-hourglass-half text-white" />
        <h3 className="text-white font-semibold">Medidor de Retraso</h3>
      </div>

      {/* Gauge */}
      <div className="relative w-64 h-40 mx-auto flex items-end justify-center mb-6">
        {/* Arc background */}
        <div
          className="absolute inset-0 gauge-arc"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
        />
        {/* Inner circle */}
        <div
          className="gauge-inner absolute inset-[15px] flex flex-col items-center justify-center pt-8"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
        >
          <span className="text-4xl font-bold text-white">{delay.toFixed(1)}</span>
          <span className="text-[10px] font-semibold text-app-textMuted tracking-widest mt-1 text-center">
            SEMESTRES EN RIESGO
          </span>
        </div>
        {/* Indicator dot */}
        <div 
          className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10 transition-all duration-1000" 
          style={{ 
            top: `${20 + (4 - delay) * 15}%`, 
            right: `${30 + (delay - 2) * 20}%` 
          }} 
        />
        {/* Labels */}
        <span className="absolute bottom-2 left-0 text-xs text-app-textMuted">0</span>
        <span className="absolute top-10 left-12 text-xs text-app-textMuted">1</span>
        <span className="absolute top-0 left-1/2 -translate-x-1/2 text-xs text-app-textMuted">2</span>
        <span className="absolute top-10 right-12 text-xs text-app-textMuted">3</span>
        <span className="absolute bottom-2 right-0 text-xs text-app-textMuted">4</span>
      </div>

      {/* Progress bars */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white font-medium">Avance General</span>
            <span className="text-white font-bold">47%</span>
          </div>
          <div className="h-2 bg-app-card rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-[47%] rounded-full us07-progress-glow" />
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-app-textMuted font-medium">Créditos</span>
          <span className="text-white font-bold">68 / 160</span>
        </div>
      </div>
    </div>
  );
}

function StudentInfo() {
  const [student, setStudent] = useState({
    name: 'Cargando...',
    major: '...',
    semester: '...',
    period: '...'
  });

  useEffect(() => {
    // Simulación de carga de perfil (US-01/03)
    setTimeout(() => {
      setStudent({
        name: 'Santiago Morales',
        major: 'Ingeniería de Sistemas',
        semester: '5',
        period: '2025-2'
      });
    }, 1000);
  }, []);

  const fields = [
    { label: 'Nombre',         value: student.name },
    { label: 'Carrera',        value: student.major },
    { label: 'Semestre Actual', value: student.semester },
    { label: 'Período',        value: student.period },
  ];

  return (
    <div className="bg-app-surface rounded-2xl border border-app-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <i className="fa-regular fa-user text-white" />
        <h3 className="text-white font-semibold">Información Estudiante</h3>
      </div>
      <div className="space-y-4">
        {fields.map((field, i) => (
          <div
            key={field.label}
            className={`flex justify-between items-center py-1 ${
              i < fields.length - 1 ? 'border-b border-app-border/50' : ''
            }`}
          >
            <span className="text-sm text-app-textMuted">{field.label}</span>
            <span className={`text-sm font-medium text-white ${student.name === 'Cargando...' ? 'animate-pulse' : ''}`}>{field.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Sidebar ─────────────────────────────────────────────────── */
type SideSection = 'risk' | 'priority' | 'smartmatch';

const SIDE_ITEMS: { id: SideSection; icon: string; label: string }[] = [
  { id: 'risk',       icon: 'fa-solid fa-triangle-exclamation', label: 'Panel de Riesgo' },
  { id: 'priority',   icon: 'fa-solid fa-layer-group',          label: 'Selección Prioritaria' },
  { id: 'smartmatch', icon: 'fa-solid fa-bolt',                 label: 'Smart Match Crítico' },
];

function US07Sidebar({
  active,
  onChange,
}: {
  active: SideSection;
  onChange: (s: SideSection) => void;
}) {
  return (
    <aside className="w-64 bg-app-bg border-r border-app-border flex flex-col shrink-0">
      <div className="p-6">
        <h2 className="text-xs font-bold text-app-textMuted uppercase tracking-wider mb-4">
          Navegación
        </h2>
        <nav className="space-y-2">
          {SIDE_ITEMS.map((item) => {
            const isActive = item.id === active;
            return (
              <button
                key={item.id}
                onClick={() => onChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium text-left ${
                  isActive
                    ? 'bg-app-card border border-app-accent/30 text-white'
                    : 'text-app-textMuted hover:bg-app-surface hover:text-white'
                }`}
              >
                <i className={`${item.icon} ${isActive ? 'text-app-accent' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <button className="us07-glow-btn w-full bg-indigo-500 hover:bg-indigo-400 text-white font-medium py-3 px-4 rounded-xl transition-all">
          Generar Horario
        </button>
      </div>
    </aside>
  );
}

/* ── Main Panel ──────────────────────────────────────────────── */
function RiskPanel() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxDelay, setMaxDelay] = useState(0);

  useEffect(() => {
    const fetchCriticality = async () => {
      try {
        const response = await getCriticality('STU-001', 'CS-2024');
        if (response.success && response.data) {
          let currentMaxDelay = 0;
          const finalMapped = response.data.map((report: any) => {
            if (report.potentialDelaySemesters > currentMaxDelay) {
              currentMaxDelay = report.potentialDelaySemesters;
            }
            
            let level: CriticalityLevel = 'BAJO';
            if (report.criticalityIndex >= 0.8) level = 'CRÍTICO';
            else if (report.criticalityIndex >= 0.5) level = 'ALTO';
            else if (report.criticalityIndex >= 0.2) level = 'MEDIO';

            return {
              id: report.courseId,
              name: report.courseName,
              code: report.courseId,
              credits: 3,
              attempts: 1,
              criticality: level,
              score: Math.round(report.criticalityIndex * 100),
              isKey: report.unlockedCoursesCount > 0,
            };
          });
          setSubjects(finalMapped);
          setMaxDelay(currentMaxDelay);
        }
      } catch (error) {
        console.error('Error fetching criticality data:', error);
        setSubjects(FALLBACK_SUBJECTS);
      } finally {
        setLoading(false);
      }
    };

    fetchCriticality();
  }, []);

  return (
    <main className="flex-1 overflow-y-auto bg-app-bg p-8 us07-scroll">
      <div className="max-w-6xl mx-auto">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Panel de Riesgo Académico</h1>
          <p className="text-app-textMuted">
            Monitorea tu situación académica actual y prioriza las materias críticas que impactan tu progresión curricular.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column */}
          <div className="lg:col-span-5 space-y-6">
            <RiskGauge delay={maxDelay} />
            <StudentInfo />
          </div>

          {/* Right column: Failed subjects */}
          <div className="lg:col-span-7 bg-app-surface rounded-2xl border border-app-border p-6 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Materias Reprobadas</h3>
                <p className="text-xs text-app-textMuted mt-1">
                  Ordenadas por índice de criticidad (impacto en graduación)
                </p>
              </div>
              <button className="text-app-textMuted hover:text-white transition-colors">
                <i className="fa-solid fa-filter" />
              </button>
            </div>

            {/* Subject list */}
            <div className="space-y-4 flex-1">
              {loading ? (
                <div className="py-12 text-center text-sm text-app-textMuted animate-pulse">
                  <i className="fa-solid fa-circle-notch fa-spin text-indigo-500 mb-3 text-2xl block" />
                  Calculando Índice de Criticidad...
                </div>
              ) : subjects.length === 0 ? (
                <div className="py-12 text-center text-sm text-app-textMuted">
                  No hay materias en riesgo detectadas.
                </div>
              ) : (
                subjects.map((s) => (
                  <SubjectCard key={s.id} subject={s} />
                ))
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-app-border flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-app-textMuted">
                <i className="fa-solid fa-circle-info" />
                <span>3 materias requieren priorización</span>
              </div>
              <button className="text-sm font-medium text-white hover:text-indigo-400 flex items-center gap-2 transition-colors">
                Exportar Reporte
                <i className="fa-solid fa-download" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating help button */}
      <button className="fixed bottom-6 right-6 w-10 h-10 bg-app-card border border-app-border rounded-full flex items-center justify-center text-app-textMuted hover:text-white hover:bg-app-surface transition-colors shadow-lg z-50">
        <i className="fa-solid fa-question" />
      </button>
    </main>
  );
}

/* ── Root Export ─────────────────────────────────────────────── */
export const AcademicPriority: React.FC = () => {
  const [section, setSection] = useState<SideSection>('risk');

  return (
    /*
     * This component fills the content area provided by DashboardLayout.
     * We use negative margin to break out of the parent's padding (p-8)
     * so the inner sidebar + main feel like a full-screen sub-layout.
     */
    <div className="-m-8 flex h-[calc(100vh-4rem)] overflow-hidden bg-app-bg">
      {/* Inner top bar */}
      <div className="absolute top-0 left-72 right-0 flex items-center justify-between px-6 py-4 bg-app-bg border-b border-app-border z-10">
        <nav className="flex items-center gap-8">
          {(['Panel Riesgo', 'Prioridad', 'Smart Match'] as const).map((label, i) => (
            <a
              key={label}
              href="#"
              className={`text-sm font-medium pb-1 transition-colors ${
                i === 0
                  ? 'text-white border-b-2 border-app-accent'
                  : 'text-app-textMuted hover:text-white'
              }`}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <button aria-label="Settings" className="text-app-textMuted hover:text-white transition-colors">
            <i className="fa-solid fa-gear" />
          </button>
          <button aria-label="User Profile" className="text-app-textMuted hover:text-white transition-colors">
            <i className="fa-regular fa-circle-user text-xl" />
          </button>
        </div>
      </div>

      {/* Layout: sidebar + content */}
      <div className="flex flex-1 overflow-hidden pt-[57px]">
        <US07Sidebar active={section} onChange={setSection} />

        {section === 'risk'       && <RiskPanel />}
        {section === 'priority'   && <PrioritySelection />}
        {section === 'smartmatch' && <SmartMatch />}
      </div>
    </div>
  );
};
