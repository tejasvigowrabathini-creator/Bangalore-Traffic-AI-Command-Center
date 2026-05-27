// ============================================================
// FILE: src/components/RightPanel.tsx
// PURPOSE: Right panel - contains MapVisualizer on top and
//          DispatchBroadcast below. 340px fixed width.
//          Shows scenario stats header when active.
// ============================================================

import { Map, Send, Wifi } from 'lucide-react';
import { CrisisScenario, SimulationStatus, DispatchMessage, ReActLogStep } from '../lib/types';
import { cn, getSeverityColors } from '../lib/utils';
import { MapVisualizer } from './MapVisualizer';
import { DispatchBroadcast } from './DispatchBroadcast';

interface RightPanelProps {
  activeScenario: CrisisScenario | null;
  simulationStatus: SimulationStatus;
  currentStepIndex: number;
  visibleSteps: ReActLogStep[];
}

export function RightPanel({ activeScenario, simulationStatus, currentStepIndex, visibleSteps }: RightPanelProps) {
  const isCustom = activeScenario?.id === 'custom_scenario';

  // Progressively reveal markers and dispatch messages based on simulation progress
  const markerRevealThreshold = activeScenario
    ? Math.floor((currentStepIndex / (activeScenario.reactLog.length || 1)) * (activeScenario.mapMarkers?.length || 1))
    : 0;

  // Process and pull dynamic public advisories for custom AI solver runs
  const getMessagesToRun = (): DispatchMessage[] => {
    if (!activeScenario) return [];
    if (activeScenario.id !== 'custom_scenario') {
      return activeScenario.dispatchMessages || [];
    }

    const customDispatches: DispatchMessage[] = [];
    visibleSteps.forEach((step, idx) => {
      if (step.type === 'ACTION' && step.toolName === 'broadcast_public_advisory' && step.toolInput) {
        customDispatches.push({
          id: `custom_dm_${idx}`,
          channel: 'TWITTER',
          content: step.toolInput.message || step.message,
          targetAudience: step.toolInput.affected_areas || 'Bangalore commuters',
          dispatchedAt: step.timestamp,
          status: 'SENT',
        });
      }
    });
    return customDispatches;
  };

  const messagesToRender = getMessagesToRun();

  const dispatchRevealThreshold = isCustom
    ? messagesToRender.length
    : simulationStatus === 'COMPLETE'
    ? (activeScenario?.dispatchMessages?.length ?? 0)
    : currentStepIndex > 10 ? 1 : 0;

  const severityColors = activeScenario && activeScenario.id !== 'custom_scenario'
    ? getSeverityColors(activeScenario.severity)
    : {
        text: 'text-blue-400',
        border: 'border-blue-500',
        bg: 'bg-blue-950',
        badge: 'bg-blue-500/20 text-blue-400 border border-blue-500/50',
      };

  return (
    <aside className="w-[340px] shrink-0 flex flex-col overflow-hidden bg-gray-900/40">

      {/* ---- Scenario Stats Header ---- */}
      {activeScenario ? (
        <div className={cn(
          'px-3 py-2.5 border-b shrink-0',
          severityColors.border + '/30',
          severityColors.bg + '/20'
        )}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className={cn('text-[9px] font-bold tracking-widest uppercase mb-0.5', severityColors.text)}>
                {isCustom ? 'DYNAMIC LLM' : activeScenario.severity} INCIDENT
              </div>
              <div className="text-gray-300 text-[11px] font-bold leading-snug truncate">
                {isCustom ? 'Active User Emergency' : activeScenario.title}
              </div>
            </div>
            <Wifi className={cn('w-4 h-4 shrink-0 mt-0.5', severityColors.text)} />
          </div>
          <div className="mt-1.5 flex items-center gap-3 text-[9px] text-gray-500">
            <span>Reported: {isCustom ? 'Live Prompt Submission' : activeScenario.reportedBy.split('+')[0].trim()}</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {isCustom ? (
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
                User Defined Route
              </span>
            ) : (
              activeScenario.affectedRoutes?.map((route) => (
                <span key={route} className="text-[8px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
                  {route}
                </span>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="px-3 py-2.5 border-b border-green-900/30 shrink-0">
          <div className="text-gray-600 text-[10px] tracking-widest uppercase">Situational Awareness</div>
          <div className="text-gray-700 text-[9px] mt-0.5">Select incident to populate</div>
        </div>
      )}

      {/* ---- MAP SECTION ---- */}
      <div className="flex-none h-[220px] p-2 border-b border-green-900/20">
        {/* Section Label */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <Map className="w-3 h-3 text-green-700" />
          <span className="text-gray-600 text-[9px] tracking-widest uppercase">Live Incident Map</span>
        </div>

        {/* Map Component */}
        <div className="h-[185px]">
          <MapVisualizer
            scenario={activeScenario}
            visibleMarkerCount={markerRevealThreshold + 1}
          />
        </div>
      </div>

      {/* ---- DISPATCH BROADCAST SECTION ---- */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex items-center gap-1.5 mb-2">
          <Send className="w-3 h-3 text-green-700" />
          <span className="text-gray-600 text-[9px] tracking-widest uppercase">Outbound Dispatch Broadcast</span>
          {activeScenario && dispatchRevealThreshold > 0 && (
            <span className="ml-auto text-green-500 text-[9px] font-bold status-pulse">
              {dispatchRevealThreshold} SENT
            </span>
          )}
        </div>

        <DispatchBroadcast
          messages={messagesToRender}
          showCount={dispatchRevealThreshold}
        />
      </div>
    </aside>
  );
}
