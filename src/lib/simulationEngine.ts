// ============================================================
// FILE: src/lib/simulationEngine.ts
// PURPOSE: Deterministic state machine that drives the ReAct
//          loop animation. Used by useSimulation hook.
// ============================================================

import { ReActLogStep } from './types';
import { CRISIS_SCENARIOS } from './scenarios';
import { sleep } from './utils';

/** Callback invoked each time a new step becomes visible */
export type StepRevealCallback = (step: ReActLogStep, stepIndex: number) => void;

/** Callback invoked when simulation completes */
export type SimulationCompleteCallback = () => void;

export class SimulationEngine {
  private abortController: AbortController | null = null;

  /**
   * Runs the simulation for a given scenario, revealing steps one by one
   * with realistic timing delays. Calls onStepReveal for each step.
   */
  async run(
    scenarioId: string,
    onStepReveal: StepRevealCallback,
    onComplete: SimulationCompleteCallback
  ): Promise<void> {
    // Cancel any in-progress simulation
    this.stop();
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    const scenario = CRISIS_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;

    for (let i = 0; i < scenario.reactLog.length; i++) {
      if (signal.aborted) return;

      const step = scenario.reactLog[i];

      // Reveal the step
      onStepReveal(step, i);

      // Wait for the step's configured duration before moving to next
      // Clamp between 400ms and 3500ms to keep UI snappy but readable
      const delay = Math.min(Math.max(step.durationMs, 400), 3500);
      await sleep(delay);

      if (signal.aborted) return;
    }

    onComplete();
  }

  /** Aborts any running simulation */
  stop(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}

/** Singleton engine instance */
export const simulationEngine = new SimulationEngine();
