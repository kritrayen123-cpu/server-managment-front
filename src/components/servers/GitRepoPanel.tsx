"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  getRepos,
  deployRepo,
  deleteRepo,
  type GitRepo,
  type RepoStatus,
} from "@/lib/servers/repos";

const statusStyle: Record<RepoStatus, string> = {
  DEPLOYED: "bg-cyan/10 text-cyan border-cyan/30",
  DEPLOYING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  IDLE: "bg-white/5 text-muted border-border",
  FAILED: "bg-red-500/10 text-red-400 border-red-500/30",
};

export default function GitRepoPanel({ serverId }: { serverId: string }) {
  const [repos, setRepos] = useState<GitRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [branch, setBranch] = useState("");
  const [path, setPath] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function load() {
    getRepos(serverId)
      .then(setRepos)
      .finally(() => setLoading(false));
  }

  useEffect(load, [serverId]);

  async function handleDeploy() {
    if (!url || !path) return;
    setSubmitting(true);
    try {
      await deployRepo(serverId, {
        repo_url: url,
        branch: branch || "main",
        local_path: path,
      });
      setUrl("");
      setBranch("");
      setPath("");
      load();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(repoId: string) {
    await deleteRepo(serverId, repoId);
    load();
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="font-semibold mb-4">Git Repositories</h2>

      <div className="space-y-2 mb-3">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/..."
          className="w-full bg-[#0b0f17] border border-border rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan"
        />
        <div className="flex gap-2">
          <input
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="Branch (main)"
            className="flex-1 bg-[#0b0f17] border border-border rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan"
          />
          <input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/var/www/html"
            className="flex-1 bg-[#0b0f17] border border-border rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan"
          />
        </div>
        <button
          onClick={handleDeploy}
          disabled={submitting}
          className="w-full rounded-lg bg-cyan hover:bg-cyan-bright text-[#04121a] text-sm font-semibold py-2.5 transition disabled:opacity-50"
        >
          {submitting ? "Deploying..." : "Add & Deploy Repository"}
        </button>
      </div>

      {loading && <p className="text-xs text-muted font-mono py-2">Loading...</p>}
      {!loading && repos.length === 0 && (
        <p className="text-xs text-muted font-mono py-2">No repositories yet</p>
      )}

      <div className="space-y-2 mt-3">
        {repos.map((repo) => {
          const name = repo.repo_url.split("/").pop()?.replace(".git", "");
          return (
            <div
              key={repo.id}
              className="flex items-center justify-between rounded-lg border border-border bg-[#0b0f17] px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium">{name}</p>
                <p className="text-[11px] text-muted font-mono">
                  {repo.local_path} · {repo.branch}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono px-2 py-1 rounded-full border ${statusStyle[repo.status]}`}
                >
                  {repo.status}
                </span>
                <button
                  onClick={() => handleDelete(repo.id)}
                  className="text-muted hover:text-red-400 transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}