// ============================================================
// FILE: src/components/MapVisualizer.tsx
// PURPOSE: Pure CSS/Tailwind mock interactive Bangalore map.
//   - No external map library required (zero dependency)
//   - Shows labeled road lines as colored divs
//   - Renders MapMarker dots with animated ping rings
//   - Shows a "scanning" sweep line animation across the map
//   - Markers appear progressively as simulation progresses
// ============================================================

import { MapPin } from 'lucide-react';
import { CrisisScenario, MapMarker } from '../lib/types';
import { cn } from '../lib/utils';

interface MapVisualizerProps {
  scenario: CrisisScenario | null;
  visibleMarkerCount: number; // How many markers to show (driven by simulation progress)
}

// Map the color string from MapMarker to actual Tailwind classes
const MARKER_COLORS: Record<string, { bg: string; ring: string; text: string }> = {
  red: { bg: 'bg-red-500', ring: 'bg-red-400', text: 'text-red-300' },
  amber: { bg: 'bg-amber-500', ring: 'bg-amber-400', text: 'text-amber-300' },
  orange: { bg: 'bg-orange-500', ring: 'bg-orange-400', text: 'text-orange-300' },
  green: { bg: 'bg-green-500', ring: 'bg-green-400', text: 'text-green-300' },
  blue: { bg: 'bg-blue-500', ring: 'bg-blue-400', text: 'text-blue-300' },
};

// Static decorative road lines for the Bangalore map background
const ROAD_LINES = [
  // Horizontal lines (representing ORR, Hosur Rd, etc.)
  { x1: 0, y1: 38, x2: 100, y2: 40, color: 'bg-gray-700', thickness: 2, label: 'ORR' },
  { x1: 0, y1: 58, x2: 100, y2: 56, color: 'bg-gray-700', thickness: 1, label: 'Hosur Rd' },
  { x1: 0, y1: 75, x2: 100, y2: 78, color: 'bg-gray-700', thickness: 1, label: 'NICE Road' },
  // Vertical lines
  { x1: 38, y1: 0, x2: 42, y2: 100, color: 'bg-gray-700', thickness: 1, label: 'NH-44' },
  { x1: 65, y1: 0, x2: 68, y2: 100, color: 'bg-gray-700', thickness: 1, label: 'Varthur Rd' },
  { x1: 20, y1: 20, x2: 80, y2: 80, color: 'bg-gray-800', thickness: 1, label: 'Sarjapur Rd' },
];

export function MapVisualizer({ scenario, visibleMarkerCount }: MapVisualizerProps) {
  const isCustomScenario = scenario?.id === 'custom_scenario';

  // For a custom scenario, we create a dynamic single central pin representing the incident!
  const visibleMarkers: MapMarker[] = isCustomScenario
    ? [
        {
          id: 'custom_pin_1',
          type: 'INCIDENT',
          label: 'Custom Incident Node',
          coordinates: { x: 50, y: 50 },
          color: 'red',
        },
      ]
    : scenario
    ? scenario.mapMarkers.slice(0, visibleMarkerCount)
    : [];

  return (
    <div className="relative w-full h-full bg-gray-950 rounded overflow-hidden border border-green-900/30">
      {/* Grid background */}
      <div className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(34,197,94,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.05) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      />

      {/* Moving scan line */}
      <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-500/20 to-transparent scan-sweep" />

      {/* Road Lines - static decorative elements */}
      {ROAD_LINES.map((road, i) => (
        <div
          key={i}
          className="absolute opacity-50"
          style={{
            // Draw approximate road lines using tilted thin divs
            left: `${road.x1}%`,
            top: `${road.y1}%`,
            width: `${road.x1 === 0 ? 100 : 2}px`,
            height: `${road.x1 === 0 ? road.thickness : 100}%`,
            backgroundColor: 'rgb(75,85,99)',
          }}
        />
      ))}

      {/* Area Labels */}
      <div className="absolute text-[7px] text-gray-750 tracking-widest font-bold font-mono text-gray-700" style={{ left: '5%', top: '15%' }}>WHITEFIELD</div>
      <div className="absolute text-[7px] text-gray-750 tracking-widest font-bold font-mono text-gray-700" style={{ left: '60%', top: '25%' }}>IT CORRIDOR</div>
      <div className="absolute text-[7px] text-gray-750 tracking-widest font-bold font-mono text-gray-700" style={{ left: '10%', top: '50%' }}>KORAMANGALA</div>
      <div className="absolute text-[7px] text-gray-750 tracking-widest font-bold font-mono text-gray-700" style={{ left: '30%', top: '85%' }}>ELECTRONIC CITY</div>
      <div className="absolute text-[7px] text-gray-750 tracking-widest font-bold font-mono text-gray-700" style={{ left: '55%', top: '60%' }}>BTM LAYOUT</div>

      {/* Compass rose */}
      <div className="absolute top-2 right-2 text-[8px] text-green-900 font-bold tracking-widest font-mono">N^</div>

      {/* Map Markers */}
      {visibleMarkers.map((marker) => {
        const colors = MARKER_COLORS[marker.color] ?? MARKER_COLORS['green'];
        return (
          <div
            key={marker.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${marker.coordinates.x}%`, top: `${marker.coordinates.y}%` }}
          >
            {/* Ping ring */}
            <div className={cn('absolute inset-0 w-4 h-4 rounded-full opacity-50 map-ping -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2', colors.ring)} />

            {/* Marker dot */}
            <div className={cn('w-3 h-3 rounded-full border-2 border-gray-950 z-10 relative', colors.bg)} />

            {/* Label */}
            <div className={cn('absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-bold px-1 rounded bg-black/50', colors.text)}>
              {marker.label}
            </div>
          </div>
        );
      })}

      {/* Empty state overlay */}
      {!scenario && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-6 h-6 text-green-905 mx-auto mb-2 text-green-800" />
            <p className="text-green-800 text-[9px] tracking-widest uppercase">
              Awaiting Incident
            </p>
          </div>
        </div>
      )}

      {/* Scale indicator */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1">
        <div className="w-8 h-0.5 bg-green-900" />
        <span className="text-[7px] text-green-905 text-green-800">5km</span>
      </div>
    </div>
  );
}
