import { Activity, Clock } from "lucide-react";
import type { RawServerMetrics, ConnectionStatus } from "@/lib/servers/monitoring/types";
import { formatLastUpdated } from "@/lib/servers/monitoring/utils";

interface SystemInformationProps {
  metrics: RawServerMetrics | null;
  status: ConnectionStatus;
  lastUpdated: string | null;
  error: string | null;
}

const statusMeta: Record<
  ConnectionStatus,
  { label: string; dotClass: string; badgeClass: string }
> = {
  connecting: {
    label: "Connecting",
    dotClass: "bg-yellow-400",
    badgeClass: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  },
  live: {
    label: "Connected (2s)",
    dotClass: "bg-cyan",
    badgeClass: "bg-cyan/10 text-cyan border-cyan/30",
  },
  reconnecting: {
    label: "Reconnecting",
    dotClass: "bg-yellow-400",
    badgeClass: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  },
  error: {
    label: "Polling Paused",
    dotClass: "bg-red-400",
    badgeClass: "bg-red-500/10 text-red-400 border-red-500/30",
  },
};

export default function SystemInformation({
  metrics,
  status,
  lastUpdated,
  error,
}: SystemInformationProps) {
  const meta = statusMeta[status] || statusMeta.connecting;
  const load = metrics?.loadAverage;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-cyan" />
          <h3 className="text-sm font-semibold text-white">System Diagnostics</h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Connection status badge */}
          <div
            className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[11px] font-mono ${meta.badgeClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${meta.dotClass}`} />
            <span>{meta.label}</span>
          </div>

          {/* Last updated indicator */}
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-muted">
            <Clock size={13} />
            <span>Updated {formatLastUpdated(lastUpdated)}</span>
          </div>
        </div>
      </div>

      {/* Load Averages Grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-border/70 bg-[#080b12] p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono tracking-wider text-muted uppercase">
            Load (1 min)
          </span>
          <span className="text-lg font-mono font-bold text-white mt-1">
            {load?.oneMinute !== undefined ? load.oneMinute.toFixed(2) : "—"}
          </span>
        </div>

        <div className="rounded-xl border border-border/70 bg-[#080b12] p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono tracking-wider text-muted uppercase">
            Load (5 min)
          </span>
          <span className="text-lg font-mono font-bold text-white mt-1">
            {load?.fiveMinutes !== undefined ? load.fiveMinutes.toFixed(2) : "—"}
          </span>
        </div>

        <div className="rounded-xl border border-border/70 bg-[#080b12] p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono tracking-wider text-muted uppercase">
            Load (15 min)
          </span>
          <span className="text-lg font-mono font-bold text-white mt-1">
            {load?.fifteenMinutes !== undefined ? load.fifteenMinutes.toFixed(2) : "—"}
          </span>
        </div>
      </div>

      {/* Error banner if in error state */}
      {error && (
        <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-mono text-red-300">
          Telemetry notice: {error}
        </div>
      )}
    </div>
  );
}
