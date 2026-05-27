// ============================================================
// FILE: src/components/CommandCenterDashboard.tsx
// PURPOSE: Root client component. Orchestrates all three panels,
//          manages shared state via useSimulation hook.
//          Layout: fixed viewport height, no page scroll.
//          Grid: [Header] / [Sidebar | Terminal | RightPanel]
// ============================================================

import { useSimulation } from '../hooks/useSimulation';
import { CRISIS_SCENARIOS } from '../lib/scenarios';
import { Header } from './Header';
import { ScenarioSidebar } from './ScenarioSidebar';
import { TerminalPanel } from './TerminalPanel';
import { RightPanel } from './RightPanel';
import { CrisisScenario } from '../lib/types';

export function CommandCenterDashboard() {
  const simulation = useSimulation();

  // Create virtual scenario container if running a live custom LLM call
  const activeScenario: CrisisScenario | null =
    simulation.activeScenarioId === 'custom_scenario'
      ? {
          id: 'custom_scenario',
          title: 'Custom Traffic Emergency',
          location: 'Live Incident Site, Bengaluru',
          coordinates: { x: 50, y: 50 },
          severity: 'HIGH',
          affectedRoutes: ['Unspecified Routes'],
          reportedBy: 'User submission',
          timestamp: new Date().toISOString(),
          description: 'Live custom resolver resolving user input incident...',
          reactLog: simulation.visibleSteps,
          dispatchMessages: [],
          mapMarkers: [
            { id: 'custom_pin_1', type: 'INCIDENT', label: 'Incident Node', coordinates: { x: 50, y: 50 }, color: 'red' },
          ],
        }
      : CRISIS_SCENARIOS.find((s) => s.id === simulation.activeScenarioId) ?? null;

  return (
    // Full-viewport container, no scroll
    <div className="h-screen w-screen flex flex-col bg-gray-950 overflow-hidden text-gray-100 font-mono select-none">

      {/* ---- TOP HEADER BAR ---- */}
      <Header simulationStatus={simulation.status} />

      {/* ---- THREE-COLUMN MAIN BODY ---- */}
      <div className="flex flex-1 overflow-hidden border-t border-green-900/30">

        {/* LEFT: Scenario Selector Sidebar - fixed 280px width */}
        <ScenarioSidebar
          scenarios={CRISIS_SCENARIOS}
          activeScenarioId={simulation.activeScenarioId}
          simulationStatus={simulation.status}
          onSelectScenario={simulation.startSimulation}
          onReset={simulation.resetSimulation}
        />

        {/* CENTER: ReAct Terminal - takes remaining space */}
        <TerminalPanel
          visibleSteps={simulation.visibleSteps}
          status={simulation.status}
          activeScenario={activeScenario}
        />

        {/* RIGHT: Map + Dispatch - fixed 340px width */}
        <RightPanel
          activeScenario={activeScenario}
          simulationStatus={simulation.status}
          currentStepIndex={simulation.currentStepIndex}
          visibleSteps={simulation.visibleSteps}
        />
      </div>
    </div>
  );
}
