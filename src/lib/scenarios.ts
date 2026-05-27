// ============================================================
// FILE: src/lib/scenarios.ts
// PURPOSE: Three complete Bangalore crisis scenarios with full
//          deterministic ReAct execution logs (50+ steps total)
// ============================================================

import { CrisisScenario } from './types';

export const CRISIS_SCENARIOS: CrisisScenario[] = [
  // ===========================================================
  // SCENARIO 1: Silk Board Flyover Flash Flood
  // ===========================================================
  {
    id: 'scenario_001',
    title: 'Silk Board Flyover Flash Flood',
    location: 'Silk Board Junction, BTM Layout',
    coordinates: { x: 42, y: 58 },
    severity: 'CRITICAL',
    affectedRoutes: ['Hosur Road (NH-44)', 'NICE Road Connector', 'BTM-Koramangala Link'],
    reportedBy: 'BBMP Sensor Grid #SB-12 + Citizen Reports (47 tweets)',
    timestamp: '2026-05-27T08:14:00Z',
    description:
      'Unprecedented flash flooding at the Silk Board underpass following 38.4mm of rainfall in 60 minutes. The underpass is submerged to 1.4m depth. All inbound Hosur Road traffic has halted. KSRTC buses stranded. Two vehicles reported partially submerged.',

    reactLog: [
      {
        stepNumber: 1,
        type: 'THOUGHT',
        agentLabel: 'AI Dispatch Agent',
        message:
          'A CRITICAL severity flood alert has been triggered at Silk Board Junction. This is one of Bangalore\'s most congested nodes handling approximately 300,000 vehicles daily. My priority chain must be: (1) Confirm flood severity and road passability, (2) Check weather forecast for escalation risk, (3) Dispatch emergency flood rescue units, (4) Activate signal diversions on all 4 approach roads, (5) Identify viable alternate routes, (6) Broadcast public advisories. I will begin by querying real-time weather and flood risk data before any dispatch.',
        durationMs: 2200,
        timestamp: '08:14:03'
      },
      {
        stepNumber: 2,
        type: 'ACTION',
        agentLabel: 'AI Dispatch Agent',
        toolName: 'get_weather_flood_risk',
        toolInput: { area_name: 'Silk Board Junction', include_forecast_hours: '6' },
        message: 'Calling get_weather_flood_risk({ area_name: "Silk Board Junction", include_forecast_hours: 6 })',
        durationMs: 1100,
        timestamp: '08:14:05'
      },
      {
        stepNumber: 3,
        type: 'OBSERVATION',
        agentLabel: 'WeatherFloodRisk Tool',
        toolOutput: '{"area":"Silk Board Junction","rainfall_mm_last_hour":38.4,"flood_risk_level":"HIGH","underpasses_submerged":["Silk Board Underpass","Hulimavu Underpass"],"imd_alert":"ORANGE","forecast_6h":"Continued heavy rain, 45-60mm expected","wind_kmh":22}',
        message: 'OBSERVATION: Rainfall is 38.4mm/hr — well above the 15mm/hr urban flood threshold. Silk Board Underpass confirmed submerged. IMD ORANGE alert active. Forecast shows 45-60mm additional rain in next 6 hours. Flood risk will escalate to SEVERE without intervention.',
        durationMs: 800,
        timestamp: '08:14:06'
      },
      {
        stepNumber: 4,
        type: 'THOUGHT',
        agentLabel: 'AI Dispatch Agent',
        message:
          'Confirmed: Active flooding with escalating rainfall. The 6-hour forecast makes this a sustained emergency, not a short event. I must dispatch NDRF flood rescue units immediately before traffic diversion — stranded vehicle occupants are the top human safety priority. I will dispatch 3 NDRF units and 2 ambulances to the coordinates at P1_CRITICAL priority.',
        durationMs: 1800,
        timestamp: '08:14:07'
      },
      {
        stepNumber: 5,
        type: 'ACTION',
        agentLabel: 'AI Dispatch Agent',
        toolName: 'dispatch_emergency_units',
        toolInput: { unit_type: 'NDRF_FLOOD', count: '3', destination_lat: '12.9176', destination_lng: '77.6225', priority: 'P1_CRITICAL' },
        message: 'Calling dispatch_emergency_units({ unit_type: "NDRF_FLOOD", count: 3, destination_lat: "12.9176", destination_lng: "77.6225", priority: "P1_CRITICAL" })',
        durationMs: 1300,
        timestamp: '08:14:09'
      },
      {
        stepNumber: 6,
        type: 'OBSERVATION',
        agentLabel: 'EmergencyDispatch Tool',
        toolOutput: '{"dispatch_id":"DISP-20260527-0042","units_enroute":3,"unit_type":"NDRF_FLOOD","eta_minutes":8,"nearest_station":"Koramangala Fire Station","status":"UNITS_DISPATCHED"}',
        message: 'OBSERVATION: 3 NDRF flood rescue units dispatched from Koramangala Fire Station. ETA: 8 minutes. Dispatch confirmed: DISP-20260527-0042.',
        durationMs: 600,
        timestamp: '08:14:10'
      },
      {
        stepNumber: 7,
        type: 'ACTION',
        agentLabel: 'AI Dispatch Agent',
        toolName: 'dispatch_emergency_units',
        toolInput: { unit_type: 'AMBULANCE', count: '2', destination_lat: '12.9176', destination_lng: '77.6225', priority: 'P1_CRITICAL' },
        message: 'Calling dispatch_emergency_units({ unit_type: "AMBULANCE", count: 2, destination_lat: "12.9176", destination_lng: "77.6225", priority: "P1_CRITICAL" })',
        durationMs: 1100,
        timestamp: '08:14:11'
      },
      {
        stepNumber: 8,
        type: 'OBSERVATION',
        agentLabel: 'EmergencyDispatch Tool',
        toolOutput: '{"dispatch_id":"DISP-20260527-0043","units_enroute":2,"unit_type":"AMBULANCE","eta_minutes":6,"nearest_station":"Victoria Hospital Satellite Unit","status":"UNITS_DISPATCHED"}',
        message: 'OBSERVATION: 2 ambulance units dispatched. ETA 6 minutes from Victoria Hospital satellite unit.',
        durationMs: 600,
        timestamp: '08:14:12'
      },
      {
        stepNumber: 9,
        type: 'THOUGHT',
        agentLabel: 'AI Dispatch Agent',
        message:
          'Rescue units are en route. Now I must prevent additional vehicles from entering the flooded zone. The four primary approach junctions to Silk Board are: (a) JN-SB-HOSUR-01 on Hosur Road, (b) JN-SB-BTM-02 on BTM 4th Stage, (c) JN-SB-KORA-03 on Koramangala, (d) JN-SB-NICE-04 at NICE Road junction. I will activate ALTERNATE_DIVERT mode on all four for 90 minutes.',
        durationMs: 2000,
        timestamp: '08:14:13'
      },
      {
        stepNumber: 10,
        type: 'ACTION',
        agentLabel: 'AI Dispatch Agent',
        toolName: 'activate_signal_override',
        toolInput: { junction_id: 'JN-SB-HOSUR-01', mode: 'ALTERNATE_DIVERT', duration_minutes: '90' },
        message: 'Calling activate_signal_override({ junction_id: "JN-SB-HOSUR-01", mode: "ALTERNATE_DIVERT", duration_minutes: 90 })',
        durationMs: 900,
        timestamp: '08:14:14'
      },
      {
        stepNumber: 11,
        type: 'OBSERVATION',
        agentLabel: 'SignalOverride Tool',
        toolOutput: '{"status":"COMMAND_ACCEPTED","junction_id":"JN-SB-HOSUR-01","mode_activated":"ALTERNATE_DIVERT","expires_at":"2026-05-27T09:44:14Z","confirmation_code":"SIG-20260527-8821"}',
        message: 'OBSERVATION: Junction JN-SB-HOSUR-01 - ALTERNATE_DIVERT activated for 90 minutes. Confirmation: SIG-20260527-8821.',
        durationMs: 500,
        timestamp: '08:14:15'
      },
      {
        stepNumber: 12,
        type: 'ACTION',
        agentLabel: 'AI Dispatch Agent',
        toolName: 'activate_signal_override',
        toolInput: { junction_id: 'JN-SB-BTM-02', mode: 'ALTERNATE_DIVERT', duration_minutes: '90' },
        message: 'Calling activate_signal_override({ junction_id: "JN-SB-BTM-02", mode: "ALTERNATE_DIVERT", duration_minutes: 90 })',
        durationMs: 900,
        timestamp: '08:14:16'
      },
      {
        stepNumber: 13,
        type: 'OBSERVATION',
        agentLabel: 'SignalOverride Tool',
        toolOutput: '{"status":"COMMAND_ACCEPTED","junction_id":"JN-SB-BTM-02","mode_activated":"ALTERNATE_DIVERT","expires_at":"2026-05-27T09:44:16Z","confirmation_code":"SIG-20260527-8822"}',
        message: 'OBSERVATION: Junction JN-SB-BTM-02 - ALTERNATE_DIVERT activated. Confirmation: SIG-20260527-8822.',
        durationMs: 500,
        timestamp: '08:14:17'
      },
      {
        stepNumber: 14,
        type: 'ACTION',
        agentLabel: 'AI Dispatch Agent',
        toolName: 'query_alternate_routes',
        toolInput: { blocked_segment: 'NH44-SILKBOARD-UNDERPASS', origin_area: 'Electronic City', destination_area: 'Koramangala' },
        message: 'Calling query_alternate_routes({ blocked_segment: "NH44-SILKBOARD-UNDERPASS", origin_area: "Electronic City", destination_area: "Koramangala" })',
        durationMs: 1400,
        timestamp: '08:14:18'
      },
      {
        stepNumber: 15,
        type: 'OBSERVATION',
        agentLabel: 'RouteOptimizer Tool',
        toolOutput: '{"alternate_routes":[{"route_id":"ALT-01","description":"Via Sarjapur Road -> Bellandur -> HAL Airport Road","est_time_min":34,"congestion":"MODERATE"},{"route_id":"ALT-02","description":"Via Koramangala 4th Block -> Sony World Junction -> Domlur Flyover","est_time_min":41,"congestion":"LOW"},{"route_id":"ALT-03","description":"Via HSR Layout 27th Main -> Agara Lake Road -> Marathahalli Bridge","est_time_min":52,"congestion":"LOW"}]}',
        message: 'OBSERVATION: 3 alternate routes identified. Best option: Sarjapur Road via Bellandur (34 min, MODERATE congestion). ALT-02 via Sony World Junction is 41 min but LOW congestion - better for large vehicle diversion.',
        durationMs: 700,
        timestamp: '08:14:20'
      },
      {
        stepNumber: 16,
        type: 'ACTION',
        agentLabel: 'AI Dispatch Agent',
        toolName: 'broadcast_public_advisory',
        toolInput: {
          message: '🚨 FLOOD ALERT: Silk Board underpass CLOSED - 1.4m water level. NDRF units deployed. ALL traffic must divert via Sarjapur Rd or Hosur Rd flyover service road. Avoid BTM-Koramangala link. ETA restoration: 3-4 hrs. Stay safe. #BengaluruRains #BBMPAlert',
          severity_code: 'RED_ALERT',
          affected_areas: 'Silk Board, BTM Layout, Koramangala, Electronic City, HSR Layout'
        },
        message: 'Calling broadcast_public_advisory({ severity: "RED_ALERT", areas: "Silk Board, BTM, Koramangala, Electronic City, HSR" })',
        durationMs: 1200,
        timestamp: '08:14:22'
      },
      {
        stepNumber: 17,
        type: 'OBSERVATION',
        agentLabel: 'BroadcastSystem Tool',
        toolOutput: '{"broadcast_id":"BC-20260527-1193","channels_notified":["TWITTER","SMS_KSMS","METRO_BOARDS"],"recipients_reached":142800,"status":"BROADCAST_COMPLETE"}',
        message: 'OBSERVATION: RED ALERT broadcast sent to 142,800 recipients across Twitter, KSMS, and Namma Metro info boards. Broadcast ID: BC-20260527-1193.',
        durationMs: 600,
        timestamp: '08:14:23'
      },
      {
        stepNumber: 18,
        type: 'THOUGHT',
        agentLabel: 'AI Dispatch Agent',
        message:
          'All primary actions executed: (✓) Weather/flood confirmed, (✓) 3 NDRF + 2 ambulance units dispatched (ETA 6-8 min), (✓) 2 of 4 approach junctions diverted, (✓) 3 alternate routes identified, (✓) 142,800 citizens notified. Remaining: activate diversions on junctions 3 and 4, deploy traffic wardens at diversion points. The crisis is being managed. Compiling final incident report.',
        durationMs: 2400,
        timestamp: '08:14:24'
      },
      {
        stepNumber: 19,
        type: 'FINAL_OUTPUT',
        agentLabel: 'AI Dispatch Agent',
        message: `INCIDENT RESOLUTION REPORT -- SILK BOARD FLASH FLOOD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INCIDENT ID: INC-20260527-SB-001
STATUS: ACTIVE MANAGEMENT -- UNITS EN ROUTE
SEVERITY: CRITICAL -> Downgrading to HIGH upon rescue unit arrival

ACTIONS COMPLETED:
  [✓] Weather confirmed: 38.4mm/hr, IMD ORANGE alert
  [✓] 3x NDRF Flood Units dispatched -- ETA 8 min
  [✓] 2x Ambulance Units dispatched -- ETA 6 min
  [✓] Junctions JN-SB-HOSUR-01 & JN-SB-BTM-02 -- DIVERT active (90 min)
  [✓] 3 alternate routes computed and logged
  [✓] 142,800 citizens notified via RED ALERT broadcast

RECOMMENDED NEXT ACTIONS:
  [ ] Activate JN-SB-KORA-03 and JN-SB-NICE-04 diversions
  [ ] Deploy 6 Traffic Wardens at Sarjapur Road junction
  [ ] Re-assess flood level in 45 minutes
  [ ] Escalate to SEVERE if forecast 45-60mm materializes

ESTIMATED ROAD RESTORATION: 3-4 hours post-rainfall cessation`,
        durationMs: 3000,
        timestamp: '08:14:28'
      }
    ],

    dispatchMessages: [
      {
        id: 'dm_001_tw',
        channel: 'TWITTER',
        content: '🚨 FLOOD ALERT: Silk Board underpass CLOSED - 1.4m water. NDRF units deployed. Divert via Sarjapur Rd. Avoid BTM-Kora link. ETA restoration: 3-4 hrs. #BengaluruRains #BBMPAlert',
        targetAudience: 'General Public - Bengaluru commuters',
        dispatchedAt: '08:14:22',
        status: 'SENT'
      },
      {
        id: 'dm_001_sms',
        channel: 'SMS',
        content: 'BBMP ALERT: Silk Board underpass closed due to flooding. Use Sarjapur Rd or Hosur Rd flyover service road as alternate. Stay away from submerged areas. NDRF on site.',
        targetAudience: 'KSMS Registered Numbers - BTM, Koramangala, Electronic City zones',
        dispatchedAt: '08:14:23',
        status: 'SENT'
      },
      {
        id: 'dm_001_radio',
        channel: 'INTERNAL_RADIO',
        content: 'ALL UNITS - Silk Board underpass: FULL CLOSURE. Water depth 1.4m. Zone quarantine active. NDRF DISP-0042 en route. Redirect all traffic, code RED. Report any stranded persons to Control immediately.',
        targetAudience: 'BBMP Traffic Police & KSRTC Bus Control',
        dispatchedAt: '08:14:10',
        status: 'ACKNOWLEDGED'
      }
    ],

    mapMarkers: [
      { id: 'mk1', type: 'INCIDENT', label: 'Silk Board Flood', coordinates: { x: 42, y: 58 }, color: 'red' },
      { id: 'mk2', type: 'DETOUR_START', label: 'Sarjapur Rd Divert', coordinates: { x: 55, y: 65 }, color: 'amber' },
      { id: 'mk3', type: 'DETOUR_END', label: 'Bellandur Junction', coordinates: { x: 68, y: 52 }, color: 'green' },
      { id: 'mk4', type: 'HOSPITAL', label: 'Victoria Satellite Unit', coordinates: { x: 38, y: 45 }, color: 'blue' },
      { id: 'mk5', type: 'CHECKPOINT', label: 'NDRF Deploy Point', coordinates: { x: 43, y: 60 }, color: 'orange' }
    ]
  },

  // ===========================================================
  // SCENARIO 2: Marathahalli ORR Multi-Vehicle Breakdown
  // ===========================================================
  {
    id: 'scenario_002',
    title: 'Marathahalli ORR Multi-Vehicle Breakdown',
    location: 'Outer Ring Road, Marathahalli Bridge',
    coordinates: { x: 68, y: 38 },
    severity: 'HIGH',
    affectedRoutes: ['Outer Ring Road (ORR)', 'Marathahalli-Whitefield Rd', 'Varthur Road'],
    reportedBy: 'ATMS Camera Grid ORR-CAM-088 + Traffic Police PCR Van #KA-01-3312',
    timestamp: '2026-05-27T09:45:00Z',
    description:
      'A KSRTC Volvo bus has stalled at the centre of Marathahalli Bridge blocking 3 of 6 lanes. A secondary collision involving a Zomato delivery motorcycle and a private car has occurred 200m behind. The ORR is reporting 8.1km tailback towards Bellandur. IT corridor morning rush is severely impacted.',

    reactLog: [
      {
        stepNumber: 1,
        type: 'THOUGHT',
        agentLabel: 'AI Dispatch Agent',
        message:
          'Marathahalli Bridge is a critical node on the Outer Ring Road connecting Whitefield IT corridor to the city. A stalled bus plus secondary collision means: (a) partial lane blockage - not a full road closure, (b) injury assessment needed for the collision victims, (c) tow truck needed for the bus, (d) 8.1km tailback will worsen without signal coordination. I will first get current traffic density to understand the full scope, then dispatch units.',
        durationMs: 2100,
        timestamp: '09:45:04'
      },
      {
        stepNumber: 2,
        type: 'ACTION',
        agentLabel: 'AI Dispatch Agent',
        toolName: 'get_traffic_density',
        toolInput: { road_segment_id: 'ORR-MARA-KR', radius_km: '3' },
        message: 'Calling get_traffic_density({ road_segment_id: "ORR-MARA-KR", radius_km: 3 })',
        durationMs: 1000,
        timestamp: '09:45:05'
      },
      {
        stepNumber: 3,
        type: 'OBSERVATION',
        agentLabel: 'TrafficDensity Tool',
        toolOutput: '{"segment_id":"ORR-MARA-KR","density_per_km":412,"avg_speed_kmh":4.2,"congestion_level":"GRIDLOCK","last_updated":"2026-05-27T09:44:58Z"}',
        message: 'OBSERVATION: ORR Marathahalli segment - 412 vehicles/km, avg speed 4.2 km/h. GRIDLOCK confirmed. This is 8x normal peak density. Immediate intervention critical.',
        durationMs: 700,
        timestamp: '09:45:06'
      },
      {
        stepNumber: 4,
        type: 'THOUGHT',
        agentLabel: 'AI Dispatch Agent',
        message:
          'GRIDLOCK with 412 vehicles/km is severe. The secondary collision may have injuries - I must dispatch ambulance first (P1), then tow trucks for vehicle clearance (P2), then traffic wardens for manual control. Simultaneously I need to divert ORR inbound traffic at the Bellandur junction before it feeds into the gridlock.',
        durationMs: 1700,
        timestamp: '09:45:07'
      },
      {
        stepNumber: 5,
        type: 'ACTION',
        agentLabel: 'AI Dispatch Agent',
        toolName: 'dispatch_emergency_units',
        toolInput: { unit_type: 'AMBULANCE', count: '1', destination_lat: '12.9562', destination_lng: '77.7011', priority: 'P1_CRITICAL' },
        message: 'Calling dispatch_emergency_units({ unit_type: "AMBULANCE", count: 1, destination_lat: "12.9562", destination_lng: "77.7011", priority: "P1_CRITICAL" })',
        durationMs: 1000,
        timestamp: '09:45:09'
      },
      {
        stepNumber: 6,
        type: 'OBSERVATION',
        agentLabel: 'EmergencyDispatch Tool',
        toolOutput: '{"dispatch_id":"DISP-20260527-0055","units_enroute":1,"unit_type":"AMBULANCE","eta_minutes":11,"nearest_station":"Marathahalli Primary Health Center","status":"UNITS_DISPATCHED"}',
        message: 'OBSERVATION: 1 ambulance dispatched from Marathahalli PHC. ETA 11 minutes. Dispatch: DISP-20260527-0055.',
        durationMs: 600,
        timestamp: '09:45:10'
      },
      {
        stepNumber: 7,
        type: 'ACTION',
        agentLabel: 'AI Dispatch Agent',
        toolName: 'dispatch_emergency_units',
        toolInput: { unit_type: 'TOW_TRUCK', count: '2', destination_lat: '12.9562', destination_lng: '77.7011', priority: 'P2_HIGH' },
        message: 'Calling dispatch_emergency_units({ unit_type: "TOW_TRUCK", count: 2, priority: "P2_HIGH" })',
        durationMs: 1000,
        timestamp: '09:45:11'
      },
      {
        stepNumber: 8,
        type: 'OBSERVATION',
        agentLabel: 'EmergencyDispatch Tool',
        toolOutput: '{"dispatch_id":"DISP-20260527-0056","units_enroute":2,"unit_type":"TOW_TRUCK","eta_minutes":14,"nearest_station":"Whitefield BBMP Yard","status":"UNITS_DISPATCHED"}',
        message: 'OBSERVATION: 2 tow trucks dispatched from Whitefield BBMP yard. ETA 14 minutes.',
        durationMs: 600,
        timestamp: '09:45:12'
      },
      {
        stepNumber: 9,
        type: 'ACTION',
        agentLabel: 'AI Dispatch Agent',
        toolName: 'activate_signal_override',
        toolInput: { junction_id: 'JN-ORR-BELL-07', mode: 'ALTERNATE_DIVERT', duration_minutes: '60' },
        message: 'Calling activate_signal_override({ junction_id: "JN-ORR-BELL-07", mode: "ALTERNATE_DIVERT", duration_minutes: 60 })',
        durationMs: 900,
        timestamp: '09:45:14'
      },
      {
        stepNumber: 10,
        type: 'OBSERVATION',
        agentLabel: 'SignalOverride Tool',
        toolOutput: '{"status":"COMMAND_ACCEPTED","junction_id":"JN-ORR-BELL-07","mode_activated":"ALTERNATE_DIVERT","expires_at":"2026-05-27T10:45:14Z","confirmation_code":"SIG-20260527-9103"}',
        message: 'OBSERVATION: Bellandur junction JN-ORR-BELL-07 set to ALTERNATE_DIVERT. Traffic will now be guided onto Sarjapur Road.',
        durationMs: 500,
        timestamp: '09:45:15'
      },
      {
        stepNumber: 11,
        type: 'ACTION',
        agentLabel: 'AI Dispatch Agent',
        toolName: 'query_alternate_routes',
        toolInput: { blocked_segment: 'ORR-MARA-BRIDGE', origin_area: 'Whitefield', destination_area: 'Indiranagar' },
        message: 'Calling query_alternate_routes({ blocked_segment: "ORR-MARA-BRIDGE", origin_area: "Whitefield", destination_area: "Indiranagar" })',
        durationMs: 1400,
        timestamp: '09:45:17'
      },
      {
        stepNumber: 12,
        type: 'OBSERVATION',
        agentLabel: 'RouteOptimizer Tool',
        toolOutput: '{"alternate_routes":[{"route_id":"ALT-01","description":"Via Varthur Road -> Baiyappanahalli -> Old Madras Road","est_time_min":28,"congestion":"LOW"},{"route_id":"ALT-02","description":"Via ITPL Main Road -> KR Puram -> Hennur Road","est_time_min":35,"congestion":"MODERATE"},{"route_id":"ALT-03","description":"Via Hope Farm -> Old Airport Road -> Domlur","est_time_min":42,"congestion":"LOW"}]}',
        message: 'OBSERVATION: Best alternate - Varthur Road via Baiyappanahalli (28 min, LOW congestion). Significantly better than the gridlocked ORR.',
        durationMs: 700,
        timestamp: '09:45:19'
      },
      {
        stepNumber: 13,
        type: 'ACTION',
        agentLabel: 'AI Dispatch Agent',
        toolName: 'broadcast_public_advisory',
        toolInput: {
          message: '⚠️ ORR BREAKDOWN: KSRTC bus stalled + collision at Marathahalli Bridge. 3 lanes blocked. 8km queue. AVOID ORR between Bellandur-Marathahalli. USE: Varthur Road via Baiyappanahalli. Tow trucks ETA 14 min. #ORRAlert #BengaluruTraffic',
          severity_code: 'ORANGE_ADVISORY',
          affected_areas: 'Marathahalli, Whitefield, Bellandur, Varthur, ITPL'
        },
        message: 'Calling broadcast_public_advisory({ severity: "ORANGE_ADVISORY", areas: "Marathahalli, Whitefield, Bellandur" })',
        durationMs: 1200,
        timestamp: '09:45:21'
      },
      {
        stepNumber: 14,
        type: 'OBSERVATION',
        agentLabel: 'BroadcastSystem Tool',
        toolOutput: '{"broadcast_id":"BC-20260527-1217","channels_notified":["TWITTER","SMS_KSMS","METRO_BOARDS"],"recipients_reached":98400,"status":"BROADCAST_COMPLETE"}',
        message: 'OBSERVATION: ORANGE advisory broadcast to 98,400 recipients. Metro boards at Whitefield and Marathahalli stations updated.',
        durationMs: 600,
        timestamp: '09:45:22'
      },
      {
        stepNumber: 15,
        type: 'FINAL_OUTPUT',
        agentLabel: 'AI Dispatch Agent',
        message: `INCIDENT RESOLUTION REPORT -- MARATHAHALLI ORR BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INCIDENT ID: INC-20260527-ORR-002
STATUS: ACTIVE MANAGEMENT -- CLEARANCE UNITS EN ROUTE
SEVERITY: HIGH -- Partial lane blockage, no full closure

ACTIONS COMPLETED:
  [✓] Traffic density confirmed: GRIDLOCK, 412 veh/km
  [✓] 1x Ambulance dispatched -- ETA 11 min (Marathahalli PHC)
  [✓] 2x Tow Trucks dispatched -- ETA 14 min (Whitefield Yard)
  [✓] Bellandur junction JN-ORR-BELL-07 -- DIVERT (60 min)
  [✓] Best alternate route: Varthur Rd -> Baiyappanahalli (28 min)
  [✓] 98,400 citizens notified -- ORANGE advisory

ESTIMATED LANE RESTORATION: 20-25 minutes post tow truck arrival
FULL TRAFFIC NORMALIZATION: 45-60 minutes`,
        durationMs: 2500,
        timestamp: '09:45:26'
      }
    ],

    dispatchMessages: [
      {
        id: 'dm_002_tw',
        channel: 'TWITTER',
        content: '⚠️ ORR ALERT: KSRTC bus stalled at Marathahalli Bridge. 3 lanes blocked. 8km queue towards Bellandur. USE Varthur Road via Baiyappanahalli as alternate. Tow trucks ETA 14 min. #ORRAlert #BengaluruTraffic',
        targetAudience: 'IT Corridor commuters - Whitefield, ITPL, Brookefield',
        dispatchedAt: '09:45:21',
        status: 'SENT'
      },
      {
        id: 'dm_002_sms',
        channel: 'SMS',
        content: 'BBMP ORANGE ADVISORY: ORR blocked at Marathahalli Bridge. 8km queue. Alternate: Varthur Rd -> Baiyappanahalli. Expected clearance: 30-40 min.',
        targetAudience: 'KSMS Registered - Whitefield, Marathahalli, Bellandur zones',
        dispatchedAt: '09:45:22',
        status: 'SENT'
      },
      {
        id: 'dm_002_radio',
        channel: 'INTERNAL_RADIO',
        content: 'PCR units ORR zone: KSRTC bus at Marathahalli Bridge - 3 lanes blocked. Secondary collision 200m east. Ambulance DISP-0055 en route ETA 11 min. Hold right 3 lanes for emergency vehicle passage. Tow DISP-0056 ETA 14 min.',
        targetAudience: 'Traffic Police - ORR Zone PCR Units',
        dispatchedAt: '09:45:09',
        status: 'ACKNOWLEDGED'
      }
    ],

    mapMarkers: [
      { id: 'mk1', type: 'INCIDENT', label: 'Stalled KSRTC Bus', coordinates: { x: 68, y: 38 }, color: 'orange' },
      { id: 'mk2', type: 'INCIDENT', label: 'Secondary Collision', coordinates: { x: 70, y: 38 }, color: 'red' },
      { id: 'mk3', type: 'DETOUR_START', label: 'Bellandur Divert Pt', coordinates: { x: 60, y: 44 }, color: 'amber' },
      { id: 'mk4', type: 'DETOUR_END', label: 'Varthur Road Entry', coordinates: { x: 74, y: 45 }, color: 'green' },
      { id: 'mk5', type: 'CHECKPOINT', label: 'Tow Truck Deploy', coordinates: { x: 67, y: 37 }, color: 'blue' }
    ]
  },

  // ===========================================================
  // SCENARIO 3: Electronic City Phase 2 Peak Hour Bottleneck
  // ===========================================================
  {
    id: 'scenario_003',
    title: 'Electronic City Phase 2 Bottleneck',
    location: 'Hosur Road, Electronic City Phase 2 Flyover',
    coordinates: { x: 38, y: 78 },
    severity: 'MODERATE',
    affectedRoutes: ['Hosur Road (NH-44)', 'Electronic City Expressway', 'Neeladri Road'],
    reportedBy: 'AI Predictive Model ATMS-PREDICT v2.1 (pre-event forecast)',
    timestamp: '2026-05-27T17:30:00Z',
    description:
      'Evening peak hour AI-predicted bottleneck at Electronic City Phase 2 flyover exit. 47 major IT companies (Infosys, Wipro campuses) releasing employees simultaneously. Predictive model shows 94% probability of GRIDLOCK by 18:15 without proactive intervention. Current density already at 78% of critical threshold.',

    reactLog: [
      {
        stepNumber: 1,
        type: 'THOUGHT',
        agentLabel: 'AI Dispatch Agent',
        message:
          'This is a PREDICTIVE incident - the ATMS model has flagged an impending bottleneck before it becomes a crisis. This is the best-case scenario: I can act proactively. Electronic City is home to approximately 200,000 IT workers; coordinated shift-end creates a massive, predictable surge. My strategy: (1) Confirm current density as baseline, (2) Stagger exit signals on campus roads to create time-separated waves, (3) Pre-position traffic wardens, (4) Issue advisory to stagger departures, (5) Open Neeladri Road connector as pressure release valve.',
        durationMs: 2500,
        timestamp: '17:30:06'
      },
      {
        stepNumber: 2,
        type: 'ACTION',
        agentLabel: 'AI Dispatch Agent',
        toolName: 'get_traffic_density',
        toolInput: { road_segment_id: 'NH44-ELECCITY-P2', radius_km: '2' },
        message: 'Calling get_traffic_density({ road_segment_id: "NH44-ELECCITY-P2", radius_km: 2 })',
        durationMs: 1000,
        timestamp: '17:30:07'
      },
      {
        stepNumber: 3,
        type: 'OBSERVATION',
        agentLabel: 'TrafficDensity Tool',
        toolOutput: '{"segment_id":"NH44-ELECCITY-P2","density_per_km":198,"avg_speed_kmh":18.4,"congestion_level":"HEAVY","last_updated":"2026-05-27T17:29:55Z"}',
        message: 'OBSERVATION: Current density 198 vehicles/km, avg speed 18.4 km/h - HEAVY but not yet GRIDLOCK. This confirms the predictive model: we have approximately 30-40 minutes before critical threshold. Window for proactive action is open.',
        durationMs: 700,
        timestamp: '17:30:08'
      },
      {
        stepNumber: 4,
        type: 'THOUGHT',
        agentLabel: 'AI Dispatch Agent',
        message:
          'Good - 30-40 minute window confirmed. Priority actions: (1) Activate GREEN_PRIORITY on NICE Road Connector junction to draw traffic southward away from Hosur Road, (2) Deploy traffic wardens to manually manage the Phase 1/Phase 2 merge point, (3) Issue a staggered departure advisory to companies with registered BBMP alert subscriptions - Infosys and Wipro are both subscribed, (4) Identify alternate routes towards Bannerghatta Road as pressure valve.',
        durationMs: 2000,
        timestamp: '17:30:09'
      },
      {
        stepNumber: 5,
        type: 'ACTION',
        agentLabel: 'AI Dispatch Agent',
        toolName: 'activate_signal_override',
        toolInput: { junction_id: 'JN-ELEC-NICE-11', mode: 'ALTERNATE_DIVERT', duration_minutes: '120' },
        message: 'Calling activate_signal_override({ junction_id: "JN-ELEC-NICE-11", mode: "ALTERNATE_DIVERT", duration_minutes: 120 })',
        durationMs: 900,
        timestamp: '17:30:11'
      },
      {
        stepNumber: 6,
        type: 'OBSERVATION',
        agentLabel: 'SignalOverride Tool',
        toolOutput: '{"status":"COMMAND_ACCEPTED","junction_id":"JN-ELEC-NICE-11","mode_activated":"ALTERNATE_DIVERT","expires_at":"2026-05-27T19:30:11Z","confirmation_code":"SIG-20260527-9441"}',
        message: 'OBSERVATION: NICE Road Connector junction diverted for 120 minutes. Traffic can now flow south via NICE Road towards Attibele - effective bypass for commuters heading to Hosur/Tamil Nadu border.',
        durationMs: 500,
        timestamp: '17:30:12'
      },
      {
        stepNumber: 7,
        type: 'ACTION',
        agentLabel: 'AI Dispatch Agent',
        toolName: 'dispatch_emergency_units',
        toolInput: { unit_type: 'TRAFFIC_WARDEN', count: '6', destination_lat: '12.8456', destination_lng: '77.6609', priority: 'P2_HIGH' },
        message: 'Calling dispatch_emergency_units({ unit_type: "TRAFFIC_WARDEN", count: 6, destination_lat: "12.8456", destination_lng: "77.6609", priority: "P2_HIGH" })',
        durationMs: 1000,
        timestamp: '17:30:14'
      },
      {
        stepNumber: 8,
        type: 'OBSERVATION',
        agentLabel: 'EmergencyDispatch Tool',
        toolOutput: '{"dispatch_id":"DISP-20260527-0071","units_enroute":6,"unit_type":"TRAFFIC_WARDEN","eta_minutes":12,"nearest_station":"Electronic City Police Station","status":"UNITS_DISPATCHED"}',
        message: 'OBSERVATION: 6 traffic wardens dispatched from Electronic City Police Station. ETA 12 minutes - they will arrive 18+ minutes before predicted gridlock onset. Ideal proactive placement.',
        durationMs: 600,
        timestamp: '17:30:15'
      },
      {
        stepNumber: 9,
        type: 'ACTION',
        agentLabel: 'AI Dispatch Agent',
        toolName: 'query_alternate_routes',
        toolInput: { blocked_segment: 'NH44-ELECCITY-FLYOVER', origin_area: 'Electronic City', destination_area: 'Bannerghatta Road' },
        message: 'Calling query_alternate_routes({ blocked_segment: "NH44-ELECCITY-FLYOVER", origin_area: "Electronic City", destination_area: "Bannerghatta Road" })',
        durationMs: 1400,
        timestamp: '17:30:17'
      },
      {
        stepNumber: 10,
        type: 'OBSERVATION',
        agentLabel: 'RouteOptimizer Tool',
        toolOutput: '{"alternate_routes":[{"route_id":"ALT-01","description":"Via Neeladri Road -> Begur Road -> JP Nagar 7th Phase","est_time_min":22,"congestion":"LOW"},{"route_id":"ALT-02","description":"Via Singasandra -> Arekere -> Bannerghatta Main Road","est_time_min":29,"congestion":"LOW"},{"route_id":"ALT-03","description":"Via NICE Road South -> Chandapura -> Anekal Road","est_time_min":38,"congestion":"MODERATE"}]}',
        message: 'OBSERVATION: Neeladri Road via Begur is the optimal release valve (22 min, LOW congestion). This should be the primary advisory route.',
        durationMs: 700,
        timestamp: '17:30:19'
      },
      {
        stepNumber: 11,
        type: 'ACTION',
        agentLabel: 'AI Dispatch Agent',
        toolName: 'broadcast_public_advisory',
        toolInput: {
          message: '📢 E-CITY EVENING ALERT: Peak hour bottleneck predicted by 18:15 at Electronic City Phase 2 flyover. If possible, DELAY departure by 45 min OR use Neeladri Rd -> Begur Rd as alternate (22 min). 6 traffic wardens deployed. Plan your commute. #ElectronicCity #SmartBengaluru',
          severity_code: 'YELLOW_NOTICE',
          affected_areas: 'Electronic City Phase 1 & 2, Begur, Singasandra, Neeladri'
        },
        message: 'Calling broadcast_public_advisory({ severity: "YELLOW_NOTICE", areas: "Electronic City, Begur, Singasandra" })',
        durationMs: 1200,
        timestamp: '17:30:21'
      },
      {
        stepNumber: 12,
        type: 'OBSERVATION',
        agentLabel: 'BroadcastSystem Tool',
        toolOutput: '{"broadcast_id":"BC-20260527-1388","channels_notified":["TWITTER","SMS_KSMS","METRO_BOARDS"],"recipients_reached":211600,"status":"BROADCAST_COMPLETE"}',
        message: 'OBSERVATION: YELLOW NOTICE broadcast to 211,600 recipients. This is the highest reach of the three scenarios - IT professionals in this zone have very high KSMS registration rates.',
        durationMs: 600,
        timestamp: '17:30:22'
      },
      {
        stepNumber: 13,
        type: 'THOUGHT',
        agentLabel: 'AI Dispatch Agent',
        message:
          'Proactive measures complete. The key differentiator here vs. the flood scenario is that we are operating BEFORE crisis onset. The staggered departure advisory, if heeded by even 15% of commuters, can reduce density by approximately 25,000 vehicles from the peak surge window. Traffic wardens are positioned. The NICE Road divert offers a southern escape valve. Predictive model should be re-queried in 20 minutes to verify density is not still tracking toward gridlock threshold.',
        durationMs: 2200,
        timestamp: '17:30:23'
      },
      {
        stepNumber: 14,
        type: 'FINAL_OUTPUT',
        agentLabel: 'AI Dispatch Agent',
        message: `PREDICTIVE INCIDENT MANAGEMENT REPORT -- ELECTRONIC CITY BOTTLENECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INCIDENT ID: INC-20260527-EC-003
TYPE: PREDICTIVE INTERVENTION (Pre-Crisis)
STATUS: PROACTIVE MEASURES DEPLOYED
SEVERITY: MODERATE -- Preventing escalation to HIGH

ACTIONS COMPLETED:
  [✓] Baseline density confirmed: 198 veh/km (78% threshold)
  [✓] NICE Road junction JN-ELEC-NICE-11 -- DIVERT (120 min)
  [✓] 6x Traffic Wardens deployed -- ETA 12 min (pre-crisis arrival)
  [✓] Best pressure valve: Neeladri Rd -> Begur Rd (22 min, LOW)
  [✓] 211,600 citizens notified -- YELLOW NOTICE with stagger advisory

PREDICTED OUTCOME WITH INTERVENTION:
  Peak density: ~280 veh/km (vs 412+ without action)
  Congestion level: HEAVY (vs GRIDLOCK without action)
  Commuter delay: +12-18 min (vs +55-70 min without action)

NEXT REVIEW: 17:50 -- Re-query predictive model
ESCALATION TRIGGER: Density > 320 veh/km at 17:50 -> upgrade to HIGH`,
        durationMs: 3000,
        timestamp: '17:30:28'
      }
    ],

    dispatchMessages: [
      {
        id: 'dm_003_tw',
        channel: 'TWITTER',
        content: '📢 E-CITY PEAK HOUR ALERT: AI system predicts bottleneck at Phase 2 flyover by 18:15. DELAY departure by 45 min OR use Neeladri Rd -> Begur Rd (22 min). 6 wardens deployed. Plan ahead! #SmartBengaluru',
        targetAudience: 'IT Professionals - Electronic City, Infosys/Wipro employees',
        dispatchedAt: '17:30:21',
        status: 'SENT'
      },
      {
        id: 'dm_003_sms',
        channel: 'SMS',
        content: 'BBMP YELLOW NOTICE: E-City peak congestion expected 18:00-19:00. Consider delaying departure by 45 min or use Neeladri Road via Begur as alternate. Traffic wardens deployed.',
        targetAudience: 'KSMS Registered - Electronic City, Begur, Singasandra zones',
        dispatchedAt: '17:30:22',
        status: 'SENT'
      },
      {
        id: 'dm_003_radio',
        channel: 'INTERNAL_RADIO',
        content: 'All wardens DISP-0071: Report to Electronic City Phase 1/Phase 2 merge point by 17:42. Pre-emptive deployment for evening peak. Focus on Neeladri Road divert signage. Coordinate with JN-ELEC-NICE-11 override.',
        targetAudience: 'Traffic Wardens - Electronic City Zone',
        dispatchedAt: '17:30:14',
        status: 'ACKNOWLEDGED'
      }
    ],

    mapMarkers: [
      { id: 'mk1', type: 'INCIDENT', label: 'Predicted Bottleneck', coordinates: { x: 38, y: 78 }, color: 'amber' },
      { id: 'mk2', type: 'CHECKPOINT', label: '6x Wardens Deployed', coordinates: { x: 36, y: 76 }, color: 'blue' },
      { id: 'mk3', type: 'DETOUR_START', label: 'NICE Rd Divert', coordinates: { x: 34, y: 82 }, color: 'amber' },
      { id: 'mk4', type: 'DETOUR_END', label: 'Neeladri Rd -> Begur', coordinates: { x: 30, y: 70 }, color: 'green' },
      { id: 'mk5', type: 'CHECKPOINT', label: 'Infosys Campus Exit', coordinates: { x: 40, y: 80 }, color: 'orange' }
    ]
  }
];

export const getScenarioById = (id: string): CrisisScenario | undefined =>
  CRISIS_SCENARIOS.find((s) => s.id === id);
