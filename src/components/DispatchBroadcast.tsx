// ============================================================
// FILE: src/components/DispatchBroadcast.tsx
// PURPOSE: Displays the auto-generated dispatch messages.
//   - Shows one card per DispatchMessage
//   - Channel badge: TWITTER (blue), SMS (green), INTERNAL_RADIO (amber)
//   - Cards animate in as simulation progresses
//   - Shows status pill: PENDING / SENT / ACKNOWLEDGED
// ============================================================

import { motion } from 'motion/react';
import { Twitter, MessageSquare, Radio } from 'lucide-react';
import { DispatchMessage } from '../lib/types';
import { cn } from '../lib/utils';

interface DispatchBroadcastProps {
  messages: DispatchMessage[];
  showCount: number; // How many messages to show (driven by simulation progress)
}

const CHANNEL_CONFIG = {
  TWITTER: {
    icon: <Twitter className="w-3 h-3" />,
    label: 'Twitter / X',
    color: 'text-sky-400',
    badge: 'bg-sky-500/20 text-sky-400 border border-sky-500/40',
    border: 'border-sky-900/40',
  },
  SMS: {
    icon: <MessageSquare className="w-3 h-3" />,
    label: 'SMS / KSMS',
    color: 'text-green-400',
    badge: 'bg-green-500/20 text-green-400 border border-green-500/40',
    border: 'border-green-900/40',
  },
  INTERNAL_RADIO: {
    icon: <Radio className="w-3 h-3" />,
    label: 'Police Radio',
    color: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
    border: 'border-amber-900/40',
  },
};

const STATUS_STYLES = {
  PENDING: 'text-gray-500',
  SENT: 'text-green-400',
  ACKNOWLEDGED: 'text-amber-400',
};

export function DispatchBroadcast({ messages, showCount }: DispatchBroadcastProps) {
  const visibleMessages = messages.slice(0, showCount);

  if (visibleMessages.length === 0) {
    return (
      <div className="flex items-center justify-center h-20 text-gray-700 text-[10px] tracking-widest uppercase">
        No broadcasts yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {visibleMessages.map((message, index) => {
        const config = CHANNEL_CONFIG[message.channel];
        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={cn(
              'rounded border bg-gray-905/60 bg-gray-900/40 p-2.5 border-green-905/20',
              config.border
            )}
          >
            {/* Header Row */}
            <div className="flex items-center gap-2 mb-1.5">
              <div className={cn('flex items-center gap-1 text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded border', config.badge)}>
                {config.icon}
                <span>{config.label}</span>
              </div>
              <span className="text-gray-650 text-[9px] ml-auto text-gray-500">{message.dispatchedAt}</span>
              <span className={cn('text-[9px] font-bold tracking-widest uppercase', STATUS_STYLES[message.status])}>
                {message.status}
              </span>
            </div>

            {/* Message Content */}
            <p className="text-gray-300 text-[10px] leading-relaxed">{message.content}</p>

            {/* Target Audience */}
            <p className="text-gray-500 text-[9px] mt-1.5 italic">
              -&gt; {message.targetAudience}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
