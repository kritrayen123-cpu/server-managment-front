"use client";

import MetricChart from "./MetricChart";
import type { ChartSample } from "@/lib/servers/monitoring/types";

interface CpuChartProps {
  samples: ChartSample[];
  currentUsage: number | null;
  loading?: boolean;
}

export default function CpuChart({
  samples,
  currentUsage,
  loading = false,
}: CpuChartProps) {
  const points = samples
    .filter((s) => s.cpu !== null)
    .map((s) => ({
      timeLabel: s.timeLabel,
      value: s.cpu as number,
    }));

  return (
    <MetricChart
      title="CPU Utilization"
      unit="%"
      colorHex="#22d3ee"
      gradientId="cpuUsageGradient"
      points={points}
      currentValue={currentUsage}
      loading={loading}
      emptyMessage="Calibrating baseline CPU counters..."
    />
  );
}

