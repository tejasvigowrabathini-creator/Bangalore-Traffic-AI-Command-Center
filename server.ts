// ============================================================
// FILE: server.ts
// PURPOSE: Full-stack Express server with integrated Vite middleware.
//          Binds to port 3000 and serves APIs/Assets.
// ============================================================

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client utility safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: ReAct Agent Solver Route
app.post('/api/react-agent', async (req, res) => {
  try {
    const { scenarioDescription } = req.body;

    if (!scenarioDescription || typeof scenarioDescription !== 'string') {
      res.status(400).json({ error: 'scenarioDescription is required and must be a string' });
      return;
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Return a graceful mocking error if the API key isn't provided or set
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured yet. Configure your secret key in Settings > Secrets to unlock live AI dispatching!',
      });
      return;
    }

    const REACT_SYSTEM_PROMPT = `You are an Autonomous AI Traffic Dispatch Agent for Bangalore, India.
You are embedded in the BBMP Smart City Emergency Command Center.
You operate using the ReAct (Reasoning and Acting) framework: you alternate between THOUGHT, ACTION, OBSERVATION, and FINAL_OUTPUT steps.

Available tools:
1. get_traffic_density(road_segment_id, radius_km)
2. activate_signal_override(junction_id, mode, duration_minutes)
3. dispatch_emergency_units(unit_type, count, destination_lat, destination_lng, priority)
4. broadcast_public_advisory(message, severity_code, affected_areas)
5. query_alternate_routes(blocked_segment, origin_area, destination_area)
6. get_weather_flood_risk(area_name, include_forecast_hours)

You must produce 8 to 15 sequence steps to fully mitigate the emergency. Be extremely descriptive of Bangalore's local roads (e.g., ORR, Marathahalli flyover, Ring roads, Sarjapur, Whitefield, Silk Board underpass) as well as emergency vehicles.

Guidelines for output JSON:
Produce a JSON array of steps matching this schema:
[
  {
    "stepNumber": number,
    "type": "THOUGHT" | "ACTION" | "OBSERVATION" | "FINAL_OUTPUT",
    "agentLabel": "AI Dispatch Agent" | "SensorSystem Tool" | "RescueDispatch Tool" | "TrafficSystem Tool",
    "message": string,
    "toolName": string (optional, e.g. "dispatch_emergency_units"),
    "toolInput": object (optional, containing parameters for the tool call),
    "toolOutput": string (optional, populated for tool output observation step),
    "durationMs": number (visual presentation delay, e.g., 1000),
    "timestamp": string (HH:MM:SS format)
  }
]
Make sure to alternate sequence cycles properly: THOUGHT -> ACTION -> OBSERVATION -> THOUGHT... until FINAL_OUTPUT reporting. Return ONLY raw JSON array, no markdown fences should be output.`;

    // Query 'gemini-3.5-flash' for advanced full-stack reasoning and structural output
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `INCIDENT REPORT: ${scenarioDescription}\n\nGenerate the complete ReAct agent step trace solving this crisis.`,
      config: {
        systemInstruction: REACT_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              stepNumber: { type: Type.INTEGER },
              type: { type: Type.STRING },
              agentLabel: { type: Type.STRING },
              message: { type: Type.STRING },
              toolName: { type: Type.STRING },
              toolInput: {
                type: Type.OBJECT,
                properties: {
                  message: { type: Type.STRING },
                  severity_code: { type: Type.STRING },
                  affected_areas: { type: Type.STRING },
                  unit_type: { type: Type.STRING },
                  count: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  road_segment_id: { type: Type.STRING },
                  junction_id: { type: Type.STRING },
                  mode: { type: Type.STRING },
                }
              },
              toolOutput: { type: Type.STRING },
              durationMs: { type: Type.INTEGER },
              timestamp: { type: Type.STRING },
            },
            required: ['stepNumber', 'type', 'agentLabel', 'message', 'durationMs', 'timestamp'],
          },
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Empirical model solver returned empty response.');
    }

    const parsedSteps = JSON.parse(textOutput.trim());
    res.json({ steps: parsedSteps });

  } catch (err: any) {
    console.error('Server side Gemini Solver failed:', err);
    res.status(500).json({ error: err.message || 'Severe command center LLM error' });
  }
});

// Configure Vite middleware or serve static static files
async function serveApp() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Autonomous Command Center server listing on http://localhost:${PORT}`);
  });
}

serveApp();
