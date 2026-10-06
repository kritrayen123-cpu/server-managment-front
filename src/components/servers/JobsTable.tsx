import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Job, JobStatus, JobType } from "@/lib/servers/jobs";

const statusStyle: Record<JobStatus, string> = {
  SUCCESS: "bg-cyan/10 text-cyan border-cyan/30",
  RUNNING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  PENDING: "bg-white/5 text-muted border-border",
  FAILED: "bg-red-500/10 text-red-400 border-red-500/30",
};

const typeLabel: Record<JobType, string> = {
  COMMAND: "Command",
  INSTALL: "Install",
  GIT_DEPLOY: "Git Deploy",
  FILE_EDIT: "File Edit",
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function JobsTable({ jobs }: { jobs: Job[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center">
        <p className="text-sm text-muted font-mono">No jobs yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="grid grid-cols-[100px_1fr_110px_140px_32px] gap-4 px-5 py-3 border-b border-border text-[10px] font-mono tracking-wide text-muted">
        <span>TYPE</span>
        <span>OUTPUT</span>
        <span>STATUS</span>
        <span>CREATED</span>
        <span />
      </div>

      {jobs.map((job) => {
        const isOpen = expanded === job.id;
        return (
          <div key={job.id} className="border-b border-border/50 last:border-0">
            <button
              onClick={() => setExpanded(isOpen ? null : job.id)}
              className="w-full grid grid-cols-[100px_1fr_110px_140px_32px] gap-4 px-5 py-3 items-center text-left hover:bg-white/5 transition"
            >
              <span className="text-xs font-mono text-white/80">{typeLabel[job.type]}</span>
              <span className="text-xs font-mono text-muted truncate">
                {job.output || "—"}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-1 rounded-full border w-fit ${statusStyle[job.status]}`}
              >
                {job.status}
              </span>
              <span className="text-xs font-mono text-muted">
                {formatDate(job.created_at)}
              </span>
              {isOpen ? (
                <ChevronUp size={14} className="text-muted" />
              ) : (
                <ChevronDown size={14} className="text-muted" />
              )}
            </button>

            {isOpen && (
              <div className="px-5 pb-4">
                <div className="rounded-lg bg-black border border-border p-4 font-mono text-xs text-white/80 whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {job.output || "No output recorded."}
                </div>
                <p className="text-[10px] text-muted font-mono mt-2">
                  Finished: {formatDate(job.finished_at)}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}