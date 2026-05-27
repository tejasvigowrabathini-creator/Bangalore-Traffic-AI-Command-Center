// ============================================================
// FILE: src/components/Header.tsx
// PURPOSE: Top bar with:
//   - Left: Logo/branding "BANGALORE TRAFFIC AI"
//   - Center: Live IST clock + date
//   - Right: System status indicator + portfolio credit
// Tailwind: h-14, bg-gray-900, border-b border-green-905/40
// ============================================================

import { Activity, Radio, Shield } from 'lucide-react';
import { useLiveClock } from '../hooks/useLiveClock';
import { SimulationStatus } from '../lib/types';
import { cn } from '../lib/utils';

interface HeaderProps {
  simulationStatus: SimulationStatus;
}

export function Header({ simulationStatus }: HeaderProps) {
  const { timeString, dateString } = useLiveClock();

  const isRunning = simulationStatus === 'RUNNING';
  const isComplete = simulationStatus === 'COMPLETE';

  return (
    <header className="h-14 bg-gray-900/80 backdrop-blur border-b border-green-900/40 flex items-center justify-between px-4 shrink-0 z-10">

      {/* ---- LEFT: Branding ---- */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Shield className="w-7 h-7 text-green-400" style={{ filter: 'drop-shadow(0 0 6px rgba(34,197,94,0.6))' }} />
        </div>
        <div>
          <div className="text-green-400 text-xs font-bold tracking-[0.25em] uppercase leading-none">
            Bangalore Traffic AI
          </div>
          <div className="text-gray-500 text-[10px] tracking-widest mt-0.5">
            Autonomous Command Center v2.1
          </div>
        </div>
        {/* Vertical divider */}
        <div className="w-px h-8 bg-green-900/50 mx-2" />
        <div className="flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-green-500" />
          <span className="text-green-500 text-[10px] tracking-widest uppercase">
            ReAct Agent Online
          </span>
        </div>
      </div>

      {/* ---- CENTER: Live Clock ---- */}
      <div className="absolute left-1/2 -translate-x-1/2 text-center">
        <div className="text-green-400 text-xl font-bold tracking-widest tabular-nums font-mono"
          style={{ textShadow: '0 0 10px rgba(34,197,94,0.5)' }}>
          {timeString}
        </div>
        <div className="text-gray-500 text-[10px] tracking-widest text-center">
          IST {dateString}
        </div>
      </div>

      {/* ---- RIGHT: Status + Credit ---- */}
      <div className="flex items-center gap-4">
        {/* System Status Badge */}
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-2 h-2 rounded-full',
            isRunning && 'bg-amber-400 critical-pulse',
            isComplete && 'bg-green-400 status-pulse',
            !isRunning && !isComplete && 'bg-green-400 status-pulse'
          )} />
          <span className={cn(
            'text-[10px] tracking-widest uppercase font-bold',
            isRunning && 'text-amber-400',
            isComplete && 'text-green-400',
            !isRunning && !isComplete && 'text-green-500'
          )}>
            {isRunning ? 'SIMULATION ACTIVE' : isComplete ? 'MISSION COMPLETE' : 'SYSTEMS NOMINAL'}
          </span>
        </div>

        {/* Vertical divider */}
        <div className="w-px h-8 bg-green-900/50" />

        {/* Activity indicator */}
        <Activity className={cn(
          'w-4 h-4',
          isRunning ? 'text-amber-400' : 'text-green-600'
        )} />

        {/* Portfolio Credit */}
        <div className="text-right hidden lg:block">
          <div className="text-gray-400 text-[10px] tracking-widest">PORTFOLIO PROJECT</div>
          <div className="text-green-500 text-[10px] tracking-widest">Class XII &bull; US Applications</div>
        </div>
      </div>
    </header>
  );
}
