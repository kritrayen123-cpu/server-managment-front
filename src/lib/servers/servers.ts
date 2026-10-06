import { apiFetch } from "@/lib/api";

export type ServerStatus = "ONLINE" | "OFFLINE" | "UNKNOWN";

export interface Server {
  id: string;
  hostname: string;
  ssh_port: number;
  ssh_username: string;
  description: string;
  status: ServerStatus;
  created_at: string;
}

export interface CommandResult {
  output?: string;
  stdout?: string;
  message?: string;
  status?: string;
  [key: string]: unknown;
}

export interface CreateServerInput {
  hostname: string;
  ssh_port: number;
  ssh_username: string;
  ssh_password: string;
  description: string;
}

export interface UpdateServerInput {
  description?: string;
  ssh_port?: number;
  ssh_username?: string;
  ssh_password?: string;
}

export function getServers() {
  return apiFetch<Server[]>("/servers");
}

export function getServer(serverId: string) {
  return apiFetch<Server>(`/servers/${serverId}`);
}

export function createServer(data: CreateServerInput) {
  return apiFetch<Server>("/servers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateServer(serverId: string, data: UpdateServerInput) {
  return apiFetch<Server>(`/servers/${serverId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteServer(serverId: string) {
  return apiFetch<void>(`/servers/${serverId}`, { method: "DELETE" });
}

export function runCommand(serverId: string, command: string) {
  return apiFetch<CommandResult>(`/servers/${serverId}/command`, {
    method: "POST",
    body: JSON.stringify({ command }),
  });
}