// ============================================================
// FILE: src/lib/types.ts
// PURPOSE: All shared TypeScript interfaces, types, and enums
// ============================================================

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export type ReActStepType =
  | 'THOUGHT'
  | 'ACTION'
  | 'OBSERVATION'
  | 'FINAL_OUTPUT';

export type SimulationStatus =
  | 'IDLE'
  | 'RUNNING'
  | 'COMPLETE'
  | 'ERROR';

// ---- Crisis Scenario ----
export interface CrisisScenario {
  id: string;                         // e.g. "scenario_001"
  title: string;                      // e.g. "Silk Board Flyover Flash Flood"
  location: string;                   // Human-readable location
  coordinates: MapCoordinates;        // For the CSS map visualizer
  description: string;                // 2-3 sentence incident description
  severity: SeverityLevel;
  affectedRoutes: string[];           // e.g. ["NICE Road", "Hosur Road"]
  reportedBy: string;                 // e.g. "BBMP Sensor Grid #SB-12"
  timestamp: string;                  // ISO string of simulated incident time
  reactLog: ReActLogStep[];           // Full deterministic ReAct execution trace
  dispatchMessages: DispatchMessage[];// Pre-written public safety broadcasts
  mapMarkers: MapMarker[];            // Points to render on the CSS map
}

// ---- ReAct Log Step ----
export interface ReActLogStep {
  stepNumber: number;
  type: ReActStepType;
  agentLabel: string;                 // e.g. "AI Dispatch Agent", "TrafficAPI Tool"
  message: string;                    // Full text content for this step
  toolName?: string;                  // Populated when type === 'ACTION'
  toolInput?: Record<string, string>; // JSON type input sent to the tool
  toolOutput?: string;                // Raw output (populated for OBSERVATION)
  durationMs: number;                 // Simulated execution delay for animation timing
  timestamp: string;                  // Simulated HH:MM:SS for display
}

// ---- Tool Definition ----
export interface ToolDefinition {
  name: string;                       // e.g. "get_traffic_density"
  description: string;                // What the AI agent sees about this tool
  inputSchema: ToolInputParam[];      // Parameter definitions
  mockedReturnValue: string;          // Exact string returned during simulation
}

export interface ToolInputParam {
  name: string;
  type: 'string' | 'number' | 'boolean';
  description: string;
  required: boolean;
}

// ---- Dispatch Message ----
export interface DispatchMessage {
  id: string;
  channel: 'TWITTER' | 'SMS' | 'INTERNAL_RADIO';
  content: string;
  targetAudience: string;
  dispatchedAt: string;               // Simulated time
  status: 'PENDING' | 'SENT' | 'ACKNOWLEDGED';
}

// ---- Map Primitives ----
export interface MapCoordinates {
  x: number;                          // Percentage 0-100 within the map box
  y: number;                          // Percentage 0-100 within the map box
}

export interface MapMarker {
  id: string;
  type: 'INCIDENT' | 'DETOUR_START' | 'DETOUR_END' | 'CHECKPOINT' | 'HOSPITAL';
  label: string;
  coordinates: MapCoordinates;
  color: string;                      // Tailwind color class suffix, e.g. "red", "amber", "green"
}

// ---- Simulation Engine State ----
export interface SimulationState {
  status: SimulationStatus;
  activeScenarioId: string | null;
  currentStepIndex: number;           // Which ReActLogStep is currently being rendered
  visibleSteps: ReActLogStep[];       // Steps revealed so far
  isStreaming: boolean;               // True while a step is being typed out
}
