import { apiFetch } from "@/lib/api";

export type TechStatus = "PENDING" | "INSTALLING" | "INSTALLED" | "FAILED";

export interface TechInstall {
  id: string;
  server_id: string;
  tech_name: string;
  version: string;
  status: TechStatus;
  installed_at: string | null;
}

export interface InstallTechInput {
  tech_name: string;
  version: string;
}

export function getTechInstalls(serverId: string) {
  return apiFetch<TechInstall[]>(`/servers/${serverId}/tech`);
}

export function getTechInstall(serverId: string, techId: string) {
  return apiFetch<TechInstall>(`/servers/${serverId}/tech/${techId}`);
}

export function installTech(serverId: string, data: InstallTechInput) {
  return apiFetch<TechInstall>(`/servers/${serverId}/tech`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteTech(serverId: string, techId: string) {
  return apiFetch<void>(`/servers/${serverId}/tech/${techId}`, {
    method: "DELETE",
  });
}