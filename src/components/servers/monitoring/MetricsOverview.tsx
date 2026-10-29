import { Cpu, HardDrive, Layers } from "lucide-react";
import type { RawServerMetrics } from "@/lib/servers/monitoring/types";
import { formatPercent, formatMemoryMb } from "@/lib/servers/monitoring/utils";

interface MetricsOverviewProps {
  metrics: RawServerMetrics | null;
  calculatedCpu: number | null;
  loading: boolean;
}

export default function MetricsOverview({
  metrics,
  calculatedCpu,
  loading,
}: MetricsOverviewProps) {
  const cpuVal = calculatedCpu;
  const memUsedMb = metrics?.memory?.used ?? 0;
  const memTotalMb = metrics?.memory?.total ?? 0;
  const memUsagePercent = metrics?.memory?.usage ?? null;
  const diskUsagePercent = metrics?.disk?.usage ?? null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* CPU Card */}
      <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono tracking-wide text-muted uppercase">
            CPU Usage
          </span>
          <div className="w-9 h-9 rounded-xl bg-[#0b1420] border border-border flex items-center justify-center text-cyan">
            <Cpu size={18} />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-2xl font-bold font-mono text-white">
            {loading && !metrics ? "..." : formatPercent(cpuVal)}
          </div>
          <div className="mt-2 w-full bg-border rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-cyan h-full transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, cpuVal ?? 0))}%` }}
            />
          </div>
          <p className="text-[11px] font-mono text-muted mt-2">
            {cpuVal === null ? "Calibrating baseline..." : "Live sample delta"}
          </p>
        </div>
      </div>

      {/* Memory Card */}
      <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono tracking-wide text-muted uppercase">
            Memory (RAM)
          </span>
          <div className="w-9 h-9 rounded-xl bg-[#0b1420] border border-border flex items-center justify-center text-[#818cf8]">
            <Layers size={18} />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-2xl font-bold font-mono text-white">
            {loading && !metrics ? "..." : formatPercent(memUsagePercent)}
          </div>
          <div className="mt-2 w-full bg-border rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#818cf8] h-full transition-all duration-500 rounded-full"
              style={{
                width: `${Math.min(100, Math.max(0, memUsagePercent ?? 0))}%`,
              }}
            />
          </div>
          <p className="text-[11px] font-mono text-muted mt-2">
            {memTotalMb > 0
              ? `${formatMemoryMb(memUsedMb)} of ${formatMemoryMb(memTotalMb)} used`
              : "Telemetry pending"}
          </p>
        </div>
      </div>

      {/* Disk Card */}
      <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono tracking-wide text-muted uppercase">
            Disk Usage
          </span>
          <div className="w-9 h-9 rounded-xl bg-[#0b1420] border border-border flex items-center justify-center text-cyan-bright">
            <HardDrive size={18} />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-2xl font-bold font-mono text-white">
            {loading && !metrics ? "..." : formatPercent(diskUsagePercent)}
          </div>
          <div className="mt-2 w-full bg-border rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-cyan-bright h-full transition-all duration-500 rounded-full"
              style={{
                width: `${Math.min(100, Math.max(0, diskUsagePercent ?? 0))}%`,
              }}
            />
          </div>
          <p className="text-[11px] font-mono text-muted mt-2">
            Root partition filesystem (/)
          </p>
        </div>
      </div>
    </div>
  );
}

