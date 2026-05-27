// ============================================================
// FILE: src/components/ReActLogEntry.tsx
// PURPOSE: Renders a single ReAct log step in the terminal.
//   - Each step type (THOUGHT/ACTION/OBSERVATION/FINAL_OUTPUT)
//     has distinct colors, icons, and layout
//   - Animated entry via motion/react
//   - ACTION steps also display toolInput JSON
// ============================================================

import React from 'react';
import { motion } from 'motion/react';
import { Brain, Zap, Eye, FileCheck } from 'lucide-react';
import { ReActLogStep } from '../lib/types';
import { cn, getStepTypeStyle } from '../lib/utils';

interface ReActLogEntryProps {
  step: ReActLogStep;
  isLatest: boolean;
  key?: string;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  THOUGHT: <Brain className="w-3.5 h-3.5" />,
  ACTION: <Zap className="w-3.5 h-3.5" />,
  OBSERVATION: <Eye className="w-3.5 h-3.5" />,
  FINAL_OUTPUT: <FileCheck className="w-3.5 h-3.5" />,
};

export function ReActLogEntry({ step, isLatest }: ReActLogEntryProps) {
  const style = getStepTypeStyle(step.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, x: -4 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'rounded border px-3 py-2.5 text-xs leading-relaxed',
        style.bgColor,
        'relative'
      )}
    >
      {/* ---- Step Header Row ---- */}
      <div className="flex items-center gap-2 mb-1.5">
        {/* Step Number */}
        <span className="text-gray-600 text-[9px] font-bold tabular-nums">
          {String(step.stepNumber).padStart(2, '0')}
        </span>

        {/* Type Badge */}
        <div className={cn('flex items-center gap-1 font-bold text-[10px] tracking-widest', style.color)}>
          {TYPE_ICONS[step.type]}
          <span>{style.label}</span>
        </div>

        {/* Agent Label */}
        <span className="text-gray-600 text-[9px]">
          {step.agentLabel}
        </span>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Timestamp */}
        <span className="text-gray-700 text-[9px] tabular-nums">
          {step.timestamp}
        </span>
      </div>

      {/* ---- Tool Name (for ACTION steps) ---- */}
      {step.type === 'ACTION' && step.toolName && (
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-gray-600 text-[9px]">tool:</span>
          <code className="text-yellow-300 text-[10px] bg-yellow-950/40 px-1.5 py-0.5 rounded font-bold">
            {step.toolName}()
          </code>
        </div>
      )}

      {/* ---- Tool Input JSON (for ACTION steps) ---- */}
      {step.type === 'ACTION' && step.toolInput && (
        <div className="mb-1.5">
          <pre className="text-[9px] text-gray-500 bg-black/30 rounded p-1.5 overflow-x-auto">
            {JSON.stringify(step.toolInput, null, 2)}
          </pre>
        </div>
      )}

      {/* ---- Main Message Content ---- */}
      <div className={cn(
        'text-[11px] leading-relaxed whitespace-pre-wrap',
        step.type === 'THOUGHT' && 'text-cyan-300/90',
        step.type === 'ACTION' && 'text-yellow-300/80',
        step.type === 'OBSERVATION' && 'text-purple-300/90',
        step.type === 'FINAL_OUTPUT' && 'text-green-300 font-mono text-[10px]',
      )}>
        {step.message}
        {/* Blinking cursor only on the latest step */}
        {isLatest && <span className="cursor-blink" />}
      </div>
    </motion.div>
  );
}
