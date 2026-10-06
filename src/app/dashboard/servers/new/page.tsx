"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createServer, type CreateServerInput } from "@/lib/servers/servers";

export default function NewServerPage() {
  const router = useRouter();

  const [form, setForm] = useState<CreateServerInput>({
    hostname: "",
    ssh_port: 22,
    ssh_username: "",
    ssh_password: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await createServer(form);

      router.push("/dashboard/servers");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create server"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Add Server</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-surface p-5 space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold tracking-wide mb-2">
              HOSTNAME / IP
            </label>

            <input
              required
              value={form.hostname}
              onChange={(e) =>
                setForm({ ...form, hostname: e.target.value })
              }
              placeholder="192.168.1.100"
              className="w-full rounded-lg border border-border bg-[#0b0f17] px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide mb-2">
              DESCRIPTION
            </label>

            <input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Production Web Server"
              className="w-full rounded-lg border border-border bg-[#0b0f17] px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide mb-2">
              SSH USERNAME
            </label>

            <input
              required
              value={form.ssh_username}
              onChange={(e) =>
                setForm({ ...form, ssh_username: e.target.value })
              }
              placeholder="ubuntu"
              className="w-full rounded-lg border border-border bg-[#0b0f17] px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide mb-2">
              SSH PORT
            </label>

            <input
              type="number"
              required
              value={form.ssh_port}
              onChange={(e) =>
                setForm({
                  ...form,
                  ssh_port: Number(e.target.value),
                })
              }
              className="w-full rounded-lg border border-border bg-[#0b0f17] px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-cyan"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-semibold tracking-wide mb-2">
              SSH PASSWORD
            </label>

            <input
              type="password"
              required
              value={form.ssh_password}
              onChange={(e) =>
                setForm({
                  ...form,
                  ssh_password: e.target.value,
                })
              }
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
    </div>
  );
}

