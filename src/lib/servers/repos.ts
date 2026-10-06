import { apiFetch } from "@/lib/api";

export type RepoStatus = "IDLE" | "DEPLOYING" | "DEPLOYED" | "FAILED";

export interface GitRepo {
  id: string;
  server_id: string;
  repo_url: string;
  branch: string;
  local_path: string;
  status: RepoStatus;
  last_deployed: string | null;
}

export interface DeployRepoInput {
  repo_url: string;
  branch: string;
  local_path: string;
}

export function getRepos(serverId: string) {
  return apiFetch<GitRepo[]>(`/servers/${serverId}/repos`);
}

export function getRepo(serverId: string, repoId: string) {
  return apiFetch<GitRepo>(`/servers/${serverId}/repos/${repoId}`);
}

export function deployRepo(serverId: string, data: DeployRepoInput) {
  return apiFetch<GitRepo>(`/servers/${serverId}/repos`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteRepo(serverId: string, repoId: string) {
  return apiFetch<void>(`/servers/${serverId}/repos/${repoId}`, {
    method: "DELETE",
  });
}