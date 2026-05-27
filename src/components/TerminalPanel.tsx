// ============================================================
// FILE: src/components/TerminalPanel.tsx
// PURPOSE: Center panel - the main ReAct terminal window.
//   - Dark terminal-bg with grid + scanlines effect
//   - Header bar showing active scenario title
//   - Scrollable log area that auto-scrolls to bottom as steps appear
//   - Empty state prompting user to select a scenario
//   - Uses ReActLogEntry for each step
// ============================================================

import { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { CrisisScenario, ReActLogStep, SimulationStatus } from '../lib/types';
import { cn, getSeverityColors } from '../lib/utils';
import { ReActLogEntry } from './ReActLogEntry';

interface TerminalPanelProps {
  visibleSteps: ReActLogStep[];
  status: SimulationStatus;
  activeScenario: CrisisScenario | null;
}

export function TerminalPanel({ visibleSteps, status, activeScenario }: TerminalPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever new steps are added
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleSteps.length]);

  const severityColors = activeScenario && activeScenario.id !== 'custom_scenario'
    ? getSeverityColors(activeScenario.severity)
    : null;

  return (
    <main className="flex-1 flex flex-col overflow-hidden border-r border-green-900/30">

      {/* ---- Terminal Title Bar ---- */}
      <div className="h-9 bg-gray-900/80 border-b border-green-900/30 flex items-center px-4 gap-3 shrink-0">
        {/* Fake window dots */}
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <div className="w-px h-4 bg-gray-750 bg-gray-700" />
        <Terminal className="w-3.5 h-3.5 text-green-600" />
        <span className="text-gray-400 text-[10px] tracking-widest uppercase flex-1 truncate">
          {activeScenario
            ? `react-agent - ${activeScenario.id === 'custom_scenario' ? 'Custom Live Solver' : activeScenario.title}`
            : 'react-agent - awaiting incident input'}
        </span>

        {/* Severity badge */}
        {activeScenario && severityColors && (
          <span className={cn('text-[9px] font-bold tracking-widest px-2 py-0.5 rounded uppercase border', severityColors.badge)}>
            {activeScenario.severity}
          </span>
        )}

        {/* Step count */}
        {visibleSteps.length > 0 && (
          <span className="text-gray-600 text-[9px] tabular-nums">
            {visibleSteps.length}/{activeScenario?.reactLog.length ?? '?'} steps
          </span>
        )}
      </div>

      {/* ---- Terminal Body ---- */}
      <div className="flex-1 overflow-y-auto terminal-bg relative">
        {/* Scanlines overlay */}
        <div className="scanlines absolute inset-0 pointer-events-none z-10" />

        <div className="relative z-20 p-4 space-y-3">

          {/* ---- Empty State ---- */}
          {visibleSteps.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center py-24 gap-4 select-none">
              <Terminal className="w-12 h-12 text-green-900" />
              <div className="text-center space-y-1">
                <p className="text-green-800 text-xs tracking-widest uppercase">
                  ReAct Agent Standby
                </p>
                <p className="text-gray-700 text-[10px]">
                  Select an incident from the left panel or compile a custom dispatch report.
                </p>
              </div>
              {/* Boot message */}
              <div className="mt-4 text-left font-mono text-[10px] text-green-900/80 space-y-1 max-w-sm">
                <p>{'> Initializing Gemini Smart-City solver...'}</p>
                <p>{'> Loading BBMP tool registry... [6 tools]'}</p>
                <p>{'> Connecting to traffic sensor grid...'}</p>
                <p className="cursor-blink">{'> Awaiting incident input'}</p>
              </div>
            </div>
          )}

          {/* ---- Log Steps ---- */}
          {visibleSteps.map((step, index) => (
            <ReActLogEntry
              key={`${step.stepNumber}-${index}`}
              step={step}
              isLatest={index === visibleSteps.length - 1 && status === 'RUNNING'}
            />
          ))}

          {/* ---- Complete Banner ---- */}
          {status === 'COMPLETE' && (
            <div className="border border-green-700/50 bg-green-950/30 rounded p-3 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-400 status-pulse" />
              <span className="text-green-400 text-[10px] tracking-widest uppercase font-bold">
                Incident Management Protocol Complete - AI Agent Returning to Standby
              </span>
            </div>
          )}

          {/* Bottom sentinel for auto-scroll */}
          <div ref={bottomRef} />
        </div>
      </div>
    </main>
  );
}
