import { apiFetch } from "@/lib/api";

export type JobType = "COMMAND" | "INSTALL" | "GIT_DEPLOY" | "FILE_EDIT";
export type JobStatus = "PENDING" | "RUNNING" | "SUCCESS" | "FAILED";

export interface Job {
  id: string;
  server_id: string;
  type: JobType;
  status: JobStatus;
  output: string;
  created_at: string;
  finished_at: string | null;
}

export function getServerJobs(serverId: string) {
  return apiFetch<Job[]>(`/jobs/server/${serverId}`);
}

export function getJob(jobId: string) {
  return apiFetch<Job>(`/jobs/${jobId}`);
}