// ============================================================
// FILE: src/components/StatusBadge.tsx
// PURPOSE: Reusable pill badge for displaying status labels
//          with optional pulsing dot indicator
// ============================================================

import { cn } from '../lib/utils';

interface StatusBadgeProps {
  label: string;
  variant: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  pulse?: boolean;
  className?: string;
}

const VARIANT_STYLES = {
  success: 'bg-green-500/15 text-green-400 border border-green-500/40',
  warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/40',
  error: 'bg-red-500/15 text-red-400 border border-red-500/40',
  info: 'bg-blue-500/15 text-blue-400 border border-blue-500/40',
  neutral: 'bg-gray-700/50 text-gray-400 border border-gray-600/40',
};

const DOT_STYLES = {
  success: 'bg-green-400 status-pulse',
  warning: 'bg-amber-400 critical-pulse',
  error: 'bg-red-400 critical-pulse',
  info: 'bg-blue-400 status-pulse',
  neutral: 'bg-gray-400',
};

export function StatusBadge({ label, variant, pulse = false, className }: StatusBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase border',
      VARIANT_STYLES[variant],
      className
    )}>
      {pulse && (
        <span className={cn('w-1.5 h-1.5 rounded-full', DOT_STYLES[variant])} />
      )}
      {label}
    </span>
  );
}
