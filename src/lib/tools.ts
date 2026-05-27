// ============================================================
// FILE: src/lib/tools.ts
// PURPOSE: All 6 AI tool definitions with mocked return values
// ============================================================

import { ToolDefinition } from './types';

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'get_traffic_density',
    description:
      'Queries the BBMP Smart Traffic Management System for real-time vehicle density on a given road segment. Returns vehicles-per-km and average speed.',
    inputSchema: [
      { name: 'road_segment_id', type: 'string', description: 'Unique ID of the road segment (e.g. "ORR-MARA-KR")', required: true },
      { name: 'radius_km', type: 'number', description: 'Radius in km around segment to scan', required: false }
    ],
    mockedReturnValue:
      '{"segment_id":"ORR-MARA-KR","density_per_km":412,"avg_speed_kmh":4.2,"congestion_level":"GRIDLOCK","last_updated":"2026-05-27T08:32:11Z"}'
  },
  {
    name: 'activate_signal_override',
    description:
      'Sends a command to the centralized traffic signal controller to switch a junction to GREEN-PRIORITY for emergency vehicles or to ALTERNATE-DIVERT to push traffic onto secondary roads.',
    inputSchema: [
      { name: 'junction_id', type: 'string', description: 'Junction controller ID from the ATMS database', required: true },
      { name: 'mode', type: 'string', description: 'One of: GREEN_PRIORITY | ALTERNATE_DIVERT | FORCE_RED | RESET', required: true },
      { name: 'duration_minutes', type: 'number', description: 'How long the override should last', required: true }
    ],
    mockedReturnValue:
      '{"status":"COMMAND_ACCEPTED","junction_id":"JN-MARA-ORR-04","mode_activated":"ALTERNATE_DIVERT","expires_at":"2026-05-27T18:02:11Z","confirmation_code":"SIG-20260527-8821"}'
  },
  {
    name: 'dispatch_emergency_units',
    description:
      'Contacts BBMP Emergency Dispatch to route police, NDRF flood units, ambulances, or tow trucks to a GPS coordinate.',
    inputSchema: [
      { name: 'unit_type', type: 'string', description: 'One of: POLICE | AMBULANCE | FIRE | NDRF_FLOOD | TOW_TRUCK | TRAFFIC_WARDEN', required: true },
      { name: 'count', type: 'number', description: 'Number of units to dispatch', required: true },
      { name: 'destination_lat', type: 'string', description: 'Latitude of incident', required: true },
      { name: 'destination_lng', type: 'string', description: 'Longitude of incident', required: true },
      { name: 'priority', type: 'string', description: 'One of: P1_CRITICAL | P2_HIGH | P3_NORMAL', required: true }
    ],
    mockedReturnValue:
      '{"dispatch_id":"DISP-20260527-0042","units_enroute":3,"unit_type":"NDRF_FLOOD","eta_minutes":8,"nearest_station":"Koramangala Fire Station","status":"UNITS_DISPATCHED"}'
  },
  {
    name: 'broadcast_public_advisory',
    description:
      'Publishes a safety advisory to the BBMP citizen alert system, which automatically posts to Twitter/X @BBMPTraffic, sends SMS to KSMS registered numbers, and updates the Namma Metro info boards.',
    inputSchema: [
      { name: 'message', type: 'string', description: 'The advisory message text (max 280 chars for Twitter compatibility)', required: true },
      { name: 'severity_code', type: 'string', description: 'One of: RED_ALERT | ORANGE_ADVISORY | YELLOW_NOTICE', required: true },
      { name: 'affected_areas', type: 'string', description: 'Comma-separated list of affected word/area names', required: true }
    ],
    mockedReturnValue:
      '{"broadcast_id":"BC-20260527-1193","channels_notified":["TWITTER","SMS_KSMS","METRO_BOARDS"],"recipients_reached":142800,"status":"BROADCAST_COMPLETE"}'
  },
  {
    name: 'query_alternate_routes',
    description:
      'Queries the BMTC-BBMP Route Optimization Engine for viable detour paths given a blocked origin-destination pair. Returns up to 3 alternate routes with estimated travel times.',
    inputSchema: [
      { name: 'blocked_segment', type: 'string', description: 'Road segment ID that is blocked or severely congested', required: true },
      { name: 'origin_area', type: 'string', description: 'Origin neighborhood or zone name', required: true },
      { name: 'destination_area', type: 'string', description: 'Destination neighborhood or zone name', required: true }
    ],
    mockedReturnValue:
      '{"alternate_routes":[{"route_id":"ALT-01","description":"Via Sarjapur Road -> Bellandur -> HAL Airport Road","est_time_min":34,"congestion":"MODERATE"},{"route_id":"ALT-02","description":"Via Koramangala 4th Block -> Sony World Junction -> Domlur Flyover","est_time_min":41,"congestion":"LOW"},{"route_id":"ALT-03","description":"Via HSR Layout 27th Main -> Agara Lake Road -> Marathahalli Bridge","est_time_min":52,"congestion":"LOW"}]}'
  },
  {
    name: 'get_weather_flood_risk',
    description:
      'Fetches real-time weather data from IMD Bengaluru station and the KSNDMC flood risk model for a given GPS bounding box.',
    inputSchema: [
      { name: 'area_name', type: 'string', description: 'Name of the Bangalore area to check', required: true },
      { name: 'include_forecast_hours', type: 'number', description: 'Number of hours ahead to include in forecast', required: false }
    ],
    mockedReturnValue:
      '{"area":"Silk Board Junction","rainfall_mm_last_hour":38.4,"flood_risk_level":"HIGH","underpasses_submerged":["Silk Board Underpass","Hulimavu Underpass"],"imd_alert":"ORANGE","forecast_6h":"Continued heavy rain, 45-60mm expected","wind_kmh":22}'
  }
];

export const getToolByName = (name: string): ToolDefinition | undefined =>
  TOOL_DEFINITIONS.find((t) => t.name === name);
