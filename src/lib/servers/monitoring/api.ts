import { apiFetch } from "@/lib/api";
import type { MonitoringResponse } from "./types";

export function getMonitoringMetrics(
  serverId: string,
  options: RequestInit = {}
): Promise<MonitoringResponse> {
  return apiFetch<MonitoringResponse>(`/monitoring/${serverId}`, options);
}

