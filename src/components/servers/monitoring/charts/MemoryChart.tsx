"use client";

import MetricChart from "./MetricChart";
import type { ChartSample } from "@/lib/servers/monitoring/types";

interface MemoryChartProps {
  samples: ChartSample[];
  currentUsage: number | null;
  loading?: boolean;
}

export default function MemoryChart({
  samples,
  currentUsage,
  loading = false,
}: MemoryChartProps) {
  const points = samples.map((s) => ({
    timeLabel: s.timeLabel,
    value: s.memory,
  }));

  return (
    <MetricChart
      title="Memory Utilization"
      unit="%"
      colorHex="#818cf8"
      gradientId="memoryUsageGradient"
      points={points}
      currentValue={currentUsage}
      loading={loading}
      emptyMessage="Awaiting memory telemetry..."
    />
  );
}

