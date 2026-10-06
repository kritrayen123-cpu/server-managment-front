import { apiFetch } from "@/lib/api";

export interface ConfigFile {
  id: string;
  server_id: string;
  file_name: string;
  remote_path: string;
  content?: string; // only present on create/detail responses, not list
  updated_at: string;
}

export interface CreateConfigFileInput {
  file_name: string;
  remote_path: string;
  content: string;
}

export interface UpdateConfigFileInput {
  content: string;
}

export function getConfigFiles(serverId: string) {
  return apiFetch<ConfigFile[]>(`/servers/${serverId}/config`);
}

export function getConfigFile(serverId: string, fileId: string) {
  return apiFetch<ConfigFile>(`/servers/${serverId}/config/${fileId}`);
}

export function createConfigFile(serverId: string, data: CreateConfigFileInput) {
  return apiFetch<ConfigFile>(`/servers/${serverId}/config`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateConfigFile(
  serverId: string,
  fileId: string,
  data: UpdateConfigFileInput
) {
  return apiFetch<ConfigFile>(`/servers/${serverId}/config/${fileId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteConfigFile(serverId: string, fileId: string) {
  return apiFetch<void>(`/servers/${serverId}/config/${fileId}`, {
    method: "DELETE",
  });
}