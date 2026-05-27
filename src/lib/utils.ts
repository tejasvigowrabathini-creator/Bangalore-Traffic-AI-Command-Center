// ============================================================
// FILE: src/lib/utils.ts
// PURPOSE: Shared utility functions used across all components
// ============================================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SeverityLevel } from './types';

/** Safely merge Tailwind class names, resolving conflicts */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Returns a promise that resolves after `ms` milliseconds */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Formats a Date object as HH:MM:SS */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  });
}

/** Formats a Date object as DD/MM/YYYY */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
}

/** Maps SeverityLevel to Tailwind color classes (text, border, bg) */
export function getSeverityColors(severity: SeverityLevel): {
  text: string;
  border: string;
  bg: string;
  badge: string;
} {
  switch (severity) {
    case 'CRITICAL':
      return {
        text: 'text-red-400',
        border: 'border-red-500',
        bg: 'bg-red-950',
        badge: 'bg-red-500/20 text-red-400 border border-red-500/50',
      };
    case 'HIGH':
      return {
        text: 'text-orange-400',
        border: 'border-orange-500',
        bg: 'bg-orange-950',
        badge: 'bg-orange-500/20 text-orange-400 border border-orange-500/50',
      };
    case 'MODERATE':
      return {
        text: 'text-amber-400',
        border: 'border-amber-500',
        bg: 'bg-amber-950',
        badge: 'bg-amber-500/20 text-amber-400 border border-amber-500/50',
      };
    case 'LOW':
      return {
        text: 'text-green-400',
        border: 'border-green-500',
        bg: 'bg-green-950',
        badge: 'bg-green-500/20 text-green-400 border border-green-500/50',
      };
  }
}

/** Maps ReActStepType to display label + color */
export function getStepTypeStyle(type: string): { label: string; color: string; bgColor: string } {
  switch (type) {
    case 'THOUGHT':
      return { label: 'THOUGHT', color: 'text-cyan-400', bgColor: 'bg-cyan-950/50 border-cyan-800' };
    case 'ACTION':
      return { label: 'ACTION', color: 'text-yellow-400', bgColor: 'bg-yellow-950/50 border-yellow-800' };
    case 'OBSERVATION':
      return { label: 'OBSERVATION', color: 'text-purple-400', bgColor: 'bg-purple-950/50 border-purple-800' };
    case 'FINAL_OUTPUT':
      return { label: 'FINAL REPORT', color: 'text-green-400', bgColor: 'bg-green-950/50 border-green-700' };
    default:
      return { label: type, color: 'text-gray-400', bgColor: 'bg-gray-900 border-gray-700' };
  }
}

/** Truncate a string to maxLen characters with ellipsis */
export function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? `${str.slice(0, maxLen)}...` : str;
}
