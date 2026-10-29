"use client";

import { useEffect, useRef, useState } from "react";
import type {
  RawServerMetrics,
  CpuCounters,
  ChartSample,
  ConnectionStatus,
} from "@/lib/servers/monitoring/types";
import { getMonitoringMetrics } from "@/lib/servers/monitoring/api";
import {
  calculateCpuUsage,
  formatTimeLabel,
} from "@/lib/servers/monitoring/utils";
import MetricsOverview from "./MetricsOverview";
import SystemInformation from "./SystemInformation";
import CpuChart from "./charts/CpuChart";
import MemoryChart from "./charts/MemoryChart";

const MAX_SAMPLES = 60;
const POLL_INTERVAL_MS = 2000;

interface MonitoringSectionProps {
  serverId: string;
}

export default function MonitoringSection({ serverId }: MonitoringSectionProps) {
  const [metrics, setMetrics] = useState<RawServerMetrics | null>(null);
  const [calculatedCpu, setCalculatedCpu] = useState<number | null>(null);
  const [samples, setSamples] = useState<ChartSample[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use ref to track previous CPU counters across polls without causing render thrashing
  const previousCountersRef = useRef<CpuCounters | null>(null);

  useEffect(() => {
    let isMounted = true;
    let timerId: NodeJS.Timeout | null = null;
    let activeController: AbortController | null = null;
    previousCountersRef.current = null;

    async function poll() {
      if (!isMounted) return;

      activeController = new AbortController();

      try {
        const response = await getMonitoringMetrics(serverId, {
          signal: activeController.signal,
        });

        if (!isMounted) return;

        const currentMetrics = response.metrics;
        const currentCounters = response.cpuCounters;

        // Calculate CPU usage comparing consecutive samples
        const cpuUsage = calculateCpuUsage(
          currentCounters,
          previousCountersRef.current
        );

        // Update baseline reference for next poll
        previousCountersRef.current = currentCounters;

        // Update state
        setMetrics(currentMetrics);
        if (cpuUsage !== null) {
          setCalculatedCpu(cpuUsage);
        }

        const newSample: ChartSample = {
          timestamp: currentMetrics.timestamp,
          timeLabel: formatTimeLabel(currentMetrics.timestamp),
          cpu: cpuUsage,
          memory: currentMetrics.memory?.usage ?? 0,
        };

        setSamples((prev) => {
          const next = [...prev, newSample];
          return next.length > MAX_SAMPLES ? next.slice(-MAX_SAMPLES) : next;
        });

        setStatus("live");
        setError(null);
        setLastUpdated(currentMetrics.timestamp);
      } catch (err: unknown) {
        if (!isMounted) return;

        // Ignore aborted requests
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        const message =
          err instanceof Error ? err.message : "Failed to retrieve metrics";

        // Keep last successful metrics visible on temporary failure
        setStatus((prev) => (prev === "live" ? "reconnecting" : "error"));
        setError(message);
      } finally {
        if (isMounted) {
          // Schedule next poll sequentially to prevent overlapping requests
          timerId = setTimeout(poll, POLL_INTERVAL_MS);
        }
      }
    }

    // Begin initial polling
    poll();

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
      if (activeController) activeController.abort();
    };
  }, [serverId]);

  return (
    <div className="space-y-4">
      {/* Overview Cards: CPU, RAM, Disk */}
      <MetricsOverview
        metrics={metrics}
        calculatedCpu={calculatedCpu}
        loading={status === "connecting" && !metrics}
      />

      {/* Real-time Charts: CPU & Memory Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CpuChart
          samples={samples}
          currentUsage={calculatedCpu}
          loading={status === "connecting" && !metrics}
        />
        <MemoryChart
          samples={samples}
          currentUsage={metrics?.memory?.usage ?? null}
          loading={status === "connecting" && !metrics}
        />
      </div>

      {/* System Diagnostics & Load Averages */}
      <SystemInformation
        metrics={metrics}
        status={status}
        lastUpdated={lastUpdated}
        error={error}
      />
    </div>
  );
}
