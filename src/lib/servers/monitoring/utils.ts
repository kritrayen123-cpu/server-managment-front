import type { CpuCounters } from "./types";

/**
 * Calculates CPU utilization between two consecutive samples.
 * Formula: 100 * (1 - deltaIdle / deltaTotal)
 * Returns null if previous counters are absent (baseline), or if counters reset.
 */
export function calculateCpuUsage(
  current: CpuCounters,
  previous: CpuCounters | null
): number | null {
  if (!previous) return null;

  const deltaTotal = current.total - previous.total;
  const deltaIdle = current.idle - previous.idle;

  // Counter reset or invalid delta check
  if (deltaTotal <= 0 || deltaIdle < 0) {
    return null;
  }

  const usage = 100 * (1 - deltaIdle / deltaTotal);
  const clamped = Math.max(0, Math.min(100, usage));
  return Number(clamped.toFixed(1));
}

/**
 * Formats a percentage value or returns placeholder if null
 */
export function formatPercent(value: number | null): string {
  if (value === null || Number.isNaN(value)) return "—";
  return `${value.toFixed(1)}%`;
}

/**
 * Formats MB into human-readable MB or GB
 */
export function formatMemoryMb(mb: number): string {
  if (!Number.isFinite(mb) || mb <= 0) return "0 MB";
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(1)} GB`;
  }
  return `${Math.round(mb)} MB`;
}

/**
 * Formats an ISO string to a concise HH:MM:SS label for charts
 */
export function formatTimeLabel(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return "";
  }
}

/**
 * Formats last updated time
 */
export function formatLastUpdated(isoString: string | null): string {
  if (!isoString) return "Never";
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return "Unknown";
  }
}

