export interface CpuCounters {
  idle: number;
  total: number;
}

export interface RawServerMetrics {
  serverId: string;
  timestamp: string;
  cpu: {
    usage: number;
  };
  memory: {
    total: number; // in MB
    used: number;  // in MB
    usage: number; // percentage
  };
  disk: {
    usage: number; // percentage
  };
  loadAverage: {
    oneMinute: number;
    fiveMinutes: number;
    fifteenMinutes: number;
  };
}

export interface MonitoringResponse {
  metrics: RawServerMetrics;
  cpuCounters: CpuCounters;
}

export interface ChartSample {
  timestamp: string;
  timeLabel: string;
  cpu: number | null; // null for first baseline sample
  memory: number;     // 0 - 100
}

export type ConnectionStatus = "connecting" | "live" | "reconnecting" | "error";

