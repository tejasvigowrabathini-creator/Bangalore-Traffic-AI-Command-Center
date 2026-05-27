// ============================================================
// FILE: src/hooks/useSimulation.ts
// PURPOSE: React hook wrapping the SimulationEngine.
//          Manages all simulation UI state.
// ============================================================

import { useState, useCallback } from 'react';
import { ReActLogStep, SimulationStatus, CrisisScenario } from '../lib/types';
import { simulationEngine } from '../lib/simulationEngine';

export interface UseSimulationReturn {
  status: SimulationStatus;
  activeScenarioId: string | null;
  visibleSteps: ReActLogStep[];
  currentStepIndex: number;
  startSimulation: (scenarioId: string, customLog?: ReActLogStep[]) => void;
  resetSimulation: () => void;
  setSimulationComplete: () => void;
  addStep: (step: ReActLogStep) => void;
}

export function useSimulation(): UseSimulationReturn {
  const [status, setStatus] = useState<SimulationStatus>('IDLE');
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [visibleSteps, setVisibleSteps] = useState<ReActLogStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);

  const startSimulation = useCallback((scenarioId: string, customLog?: ReActLogStep[]) => {
    // Reset state for new scenario
    setVisibleSteps([]);
    setCurrentStepIndex(-1);
    setActiveScenarioId(scenarioId);
    setStatus('RUNNING');

    if (customLog) {
      // Run custom simulation from actual Gemini server response!
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < customLog.length) {
          const step = customLog[currentIndex];
          setVisibleSteps((prev) => [...prev, step]);
          setCurrentStepIndex(currentIndex);
          currentIndex++;
        } else {
          clearInterval(interval);
          setStatus('COMPLETE');
        }
      }, 1000); // 1.0s reveal pacing for custom GPT calls
      
      // Store a custom abort logic or allow simulationEngine.stop() to be passive
      simulationEngine.stop();
    } else {
      simulationEngine.run(
        scenarioId,
        (step: ReActLogStep, index: number) => {
          setVisibleSteps((prev) => [...prev, step]);
          setCurrentStepIndex(index);
        },
        () => {
          setStatus('COMPLETE');
        }
      );
    }
  }, []);

  const resetSimulation = useCallback(() => {
    simulationEngine.stop();
    setStatus('IDLE');
    setActiveScenarioId(null);
    setVisibleSteps([]);
    setCurrentStepIndex(-1);
  }, []);

  const setSimulationComplete = useCallback(() => {
    setStatus('COMPLETE');
  }, []);

  const addStep = useCallback((step: ReActLogStep) => {
    setVisibleSteps((prev) => [...prev, step]);
    setCurrentStepIndex((prev) => prev + 1);
  }, []);

  return {
    status,
    activeScenarioId,
    visibleSteps,
    currentStepIndex,
    startSimulation,
    resetSimulation,
    setSimulationComplete,
    addStep,
  };
}
