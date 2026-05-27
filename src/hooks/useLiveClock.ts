// ============================================================
// FILE: src/hooks/useLiveClock.ts
// PURPOSE: Returns live IST time strings, updating every second
// ============================================================

import { useState, useEffect } from 'react';
import { formatTime, formatDate } from '../lib/utils';

export interface LiveClockReturn {
  timeString: string;   // e.g. "08:14:32"
  dateString: string;   // e.g. "15/07/2024"
  date: Date;
}

export function useLiveClock(): LiveClockReturn {
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    timeString: formatTime(date),
    dateString: formatDate(date),
    date,
  };
}
