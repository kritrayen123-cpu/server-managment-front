"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Server as ServerIcon, Plus, X } from "lucide-react";
import {
  getServers,
  createServer,
  type Server,
  type CreateServerInput,
} from "@/lib/servers/servers";

const statusDot: Record<Server["status"], string> = {
  ONLINE: "bg-cyan",
  OFFLINE: "bg-red-500",
  UNKNOWN: "bg-muted",
};

export default function ServersListPage() {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CreateServerInput>({
    hostname: "",
    ssh_port: 22,
    ssh_username: "",
    ssh_password: "",
    description: "",
  });

  function load() {
    getServers()
      .then(setServers)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createServer(form);
      setForm({ hostname: "", ssh_port: 22, ssh_username: "", ssh_password: "", description: "" });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create server");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Servers</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-lg bg-cyan hover:bg-cyan-bright text-[#04121a] text-sm font-semibold px-4 py-2 transition"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Add Server"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-surface p-5 mb-6 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold tracking-wide mb-2">HOSTNAME / IP</label>
              <input
                required
                value={form.hostname}
                onChange={(e) => setForm({ ...form, hostname: e.target.value })}
                placeholder="192.168.1.100"
                className="w-full rounded-lg border border-border bg-[#0b0f17] px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-cyan"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-wide mb-2">DESCRIPTION</label>
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Production Web Server"
                className="w-full rounded-lg border border-border bg-[#0b0f17] px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-cyan"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-wide mb-2">SSH USERNAME</label>
              <input
                required
                value={form.ssh_username}
                onChange={(e) => setForm({ ...form, ssh_username: e.target.value })}
                placeholder="ubuntu"
                className="w-full rounded-lg border border-border bg-[#0b0f17] px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-cyan"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-wide mb-2">SSH PORT</label>
              <input
                type="number"
                required
                value={form.ssh_port}
                onChange={(e) => setForm({ ...form, ssh_port: Number(e.target.value) })}
                className="w-full rounded-lg border border-border bg-[#0b0f17] px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-cyan"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold tracking-wide mb-2">SSH PASSWORD</label>
              <input
                type="password"
                required
                value={form.ssh_password}
                onChange={(e) => setForm({ ...form, ssh_password: e.target.value })}
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-border bg-[#0b0f17] px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-cyan"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 font-mono bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-cyan hover:bg-cyan-bright text-[#04121a] text-sm font-semibold px-5 py-2.5 transition disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Server"}
          </button>
        </form>
      )}

      {loading && <p className="text-sm text-muted font-mono">Loading servers...</p>}

      {!loading && servers.length === 0 && (
        <div className="rounded-2xl border border-border bg-surface p-10 text-center">
          <p className="text-sm text-muted font-mono">No servers yet — add your first one.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servers.map((server) => (
          <Link
            key={server.id}
            href={`/dashboard/servers/${server.id}`}
            className="rounded-2xl border border-border bg-surface p-5 hover:border-cyan/40 transition group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#0b1420] border border-border flex items-center justify-center group-hover:border-cyan/40 transition">
                <ServerIcon size={18} className="text-cyan" />
              </div>
              <span className={`w-2 h-2 rounded-full ${statusDot[server.status]}`} />
            </div>
            <p className="font-semibold text-sm">{server.hostname}</p>
            <p className="text-xs text-muted font-mono mt-1">{server.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}