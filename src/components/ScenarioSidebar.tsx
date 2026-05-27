// ============================================================
// FILE: src/components/ScenarioSidebar.tsx
// PURPOSE: Left sidebar listing the 3 crisis scenarios and providing
//          a gorgeous live custom input for real Gemini API dispatch.
//   - Each item: severity badge, title, location, description snippet
//   - Click to trigger simulation
//   - Active item highlighted with green left border
//   - Live Custom Incident Input section for real Gemini ReAct solver
//   - Reset button at the bottom
// Tailwind: w-[280px] shrink-0, bg-gray-900/60, border-r
// ============================================================

import React, { useState } from 'react';
import { MapPin, ChevronRight, AlertTriangle, RefreshCw, Zap, Send, Loader2 } from 'lucide-react';
import { CrisisScenario, SimulationStatus, ReActLogStep } from '../lib/types';
import { cn, getSeverityColors, truncate } from '../lib/utils';

interface ScenarioSidebarProps {
  scenarios: CrisisScenario[];
  activeScenarioId: string | null;
  simulationStatus: SimulationStatus;
  onSelectScenario: (id: string, customLog?: ReActLogStep[]) => void;
  onReset: () => void;
}

export function ScenarioSidebar({
  scenarios,
  activeScenarioId,
  simulationStatus,
  onSelectScenario,
  onReset,
}: ScenarioSidebarProps) {
  const isRunning = simulationStatus === 'RUNNING';
  const [customReport, setCustomReport] = useState('');
  const [loadingCustom, setLoadingCustom] = useState(false);
  const [errorCustom, setErrorCustom] = useState('');

  const handleCustomDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customReport.trim() || isRunning) return;

    setLoadingCustom(true);
    setErrorCustom('');

    try {
      const resp = await fetch('/api/react-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scenarioDescription: customReport }),
      });

      if (!resp.ok) {
        throw new Error('Failed to reach Gemini command agent.');
      }

      const data = await resp.json();
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.steps && Array.isArray(data.steps)) {
        // Feed custom steps to the simulation engine!
        onSelectScenario('custom_scenario', data.steps);
        setCustomReport('');
      } else {
        throw new Error('Invalid solver payload returned from server.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorCustom(err.message || 'Error executing AI model.');
    } finally {
      setLoadingCustom(false);
    }
  };

  return (
    <aside className="w-[280px] shrink-0 bg-gray-900/60 border-r border-green-900/30 flex flex-col overflow-hidden">

      {/* ---- Sidebar Header ---- */}
      <div className="px-4 py-3 border-b border-green-900/30 shrink-0">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span className="text-gray-300 text-xs font-bold tracking-widest uppercase">
            Active Incidents
          </span>
        </div>
        <p className="text-gray-600 text-[10px] mt-1 tracking-wide">
          Select a scenario to dispatch AI agent
        </p>
      </div>

      {/* ---- Scenario List ---- */}
      <div className="flex-1 overflow-y-auto py-2">
        {scenarios.map((scenario) => {
          const colors = getSeverityColors(scenario.severity);
          const isActive = scenario.id === activeScenarioId;

          return (
            <button
              key={scenario.id}
              onClick={() => onSelectScenario(scenario.id)}
              disabled={isRunning}
              className={cn(
                'w-full text-left px-4 py-3 border-l-2 transition-all duration-200 group relative',
                'hover:bg-gray-800/60 block',
                isActive
                  ? `border-green-400 bg-gray-800/80`
                  : `border-transparent hover:border-gray-600`,
                isRunning && !isActive && 'opacity-40 cursor-not-allowed'
              )}
            >
              {/* Severity + Title Row */}
              <div className="flex items-start justify-between gap-2 mb-1.5XY">
                <span className={cn(
                  'text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded',
                  colors.badge,
                  scenario.severity === 'CRITICAL' && 'glitch-text'
                )}>
                  {scenario.severity}
                </span>
                <ChevronRight className={cn(
                  'w-3.5 h-3.5 shrink-0 mt-0.5 transition-transform inline-block',
                  isActive ? 'text-green-400 translate-x-0.5' : 'text-gray-600 group-hover:text-gray-400'
                )} />
              </div>

              {/* Scenario Title */}
              <div className={cn(
                'text-xs font-bold leading-snug mb-1',
                isActive ? 'text-green-300' : 'text-gray-300 group-hover:text-gray-200'
              )}>
                {scenario.title}
              </div>

              {/* Location */}
              <div className="flex items-center gap-1 mb-1.5">
                <MapPin className="w-2.5 h-2.5 text-gray-500 shrink-0" />
                <span className="text-gray-500 text-[10px] truncate">{scenario.location}</span>
              </div>

              {/* Description Snippet */}
              <p className="text-gray-600 text-[10px] leading-relaxed">
                {truncate(scenario.description, 90)}
              </p>

              {/* Active Indicator */}
              {isActive && simulationStatus === 'RUNNING' && (
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 critical-pulse" />
                  <span className="text-amber-400 text-[9px] tracking-widest uppercase font-bold">
                    Agent Dispatched
                  </span>
                </div>
              )}
              {isActive && simulationStatus === 'COMPLETE' && (
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 status-pulse" />
                  <span className="text-green-400 text-[9px] tracking-widest uppercase font-bold">
                    Mission Complete
                  </span>
                </div>
              )}
            </button>
          );
        })}

        {/* Custom active indicator if custom scenario is running */}
        {activeScenarioId === 'custom_scenario' && (
          <div className="px-4 py-3 bg-gray-800/80 border-l-2 border-green-400 border-t border-b border-green-900/30">
            <span className="text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/50">
              LIVE LLM DISPATCH
            </span>
            <div className="text-xs font-bold leading-snug my-1 text-green-300">
              Custom Traffic Emergency
            </div>
            <p className="text-gray-500 text-[10px] italic">
              AI Command Agent solving real-time user-defined crisis.
            </p>
            {simulationStatus === 'RUNNING' && (
              <div className="flex items-center gap-1.5 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 critical-pulse" />
                <span className="text-amber-400 text-[9px] tracking-widest uppercase font-bold">
                  Solving Live
                </span>
              </div>
            )}
            {simulationStatus === 'COMPLETE' && (
              <div className="flex items-center gap-1.5 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 status-pulse" />
                <span className="text-green-400 text-[9px] tracking-widest uppercase font-bold">
                  Mitigated
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ---- Proactive Custom AI Dispatch Input ---- */}
      <div className="px-4 py-3 border-t border-b border-green-900/20 bg-black/20 text-xs text-left shrink-0">
        <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-bold">
          Custom Dispatch Center
        </label>
        <form onSubmit={handleCustomDispatch} className="space-y-1.5">
          <input
            type="text"
            required
            disabled={isRunning || loadingCustom}
            placeholder="e.g. Tree fall blocking Outer Ring Road"
            value={customReport}
            onChange={(e) => setCustomReport(e.target.value)}
            className="w-full bg-gray-950 border border-green-900/40 rounded px-2 py-1 text-[10px] text-gray-200 focus:outline-none focus:border-green-500 placeholder-gray-700"
          />
          <button
            type="submit"
            disabled={isRunning || loadingCustom || !customReport.trim()}
            className={cn(
              "w-full flex items-center justify-center gap-1 bg-green-900/30 hover:bg-green-800/50 border border-green-700/50 hover:border-green-500 text-green-400 text-[9px] tracking-widest uppercase rounded py-1 font-bold cursor-pointer transition-all",
              (isRunning || loadingCustom || !customReport.trim()) && "opacity-45 cursor-not-allowed hover:bg-green-900/30 hover:border-green-700/50 text-gray-500"
            )}
          >
            {loadingCustom ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-green-400" />
                <span>Generating Trace...</span>
              </>
            ) : (
              <>
                <Send className="w-3 h-3" />
                <span>Launch ReAct Solver</span>
              </>
            )}
          </button>
        </form>
        {errorCustom && (
          <p className="text-red-400 text-[9px] leading-tight mt-1 bg-red-950/45 p-1 rounded border border-red-900/30">
            {errorCustom}
          </p>
        )}
      </div>

      {/* ---- Bottom Controls ---- */}
      <div className="p-3 border-t border-green-900/30 space-y-2 shrink-0">
        {/* AI Mode indicator */}
        <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-gray-800/60 border border-green-900/30">
          <Zap className="w-3 h-3 text-green-500" />
          <span className="text-green-600 text-[9px] tracking-widest uppercase flex-1">
            ReAct Framework Active
          </span>
          <span className="text-green-400 text-[9px] font-bold">LIVE</span>
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          disabled={simulationStatus === 'IDLE'}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2 rounded',
            'border border-gray-700 text-gray-500 text-[10px] tracking-widest uppercase',
            'transition-all duration-200',
            simulationStatus !== 'IDLE'
              ? 'hover:border-red-800 hover:text-red-400 hover:bg-red-950/30 cursor-pointer'
              : 'opacity-30 cursor-not-allowed'
          )}
        >
          <RefreshCw className="w-3 h-3" />
          Reset System
        </button>
      </div>
    </aside>
  );
}
