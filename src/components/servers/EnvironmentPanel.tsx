"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import {
  getTechInstalls,
  installTech,
  deleteTech,
  type TechInstall,
  type TechStatus,
} from "@/lib/servers/tech";

const statusStyle: Record<TechStatus, string> = {
  INSTALLED: "bg-cyan/10 text-cyan border-cyan/30",
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  INSTALLING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  FAILED: "bg-red-500/10 text-red-400 border-red-500/30",
};

export default function EnvironmentPanel({ serverId }: { serverId: string }) {
  const [items, setItems] = useState<TechInstall[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function load() {
    getTechInstalls(serverId)
      .then(setItems)
      .finally(() => setLoading(false));
  }

  useEffect(load, [serverId]);

  async function handleAdd() {
    if (!name || !version) return;
    setSubmitting(true);
    try {
      await installTech(serverId, { tech_name: name, version });
      setName("");
      setVersion("");
      load();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(techId: string) {
    await deleteTech(serverId, techId);
    load();
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Environment</h2>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Package name"
            className="bg-[#0b0f17] border border-border rounded-lg px-3 py-2 text-xs font-mono w-32 focus:outline-none focus:ring-1 focus:ring-cyan"
          />
          <input
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="v1.0"
            className="bg-[#0b0f17] border border-border rounded-lg px-3 py-2 text-xs font-mono w-20 focus:outline-none focus:ring-1 focus:ring-cyan"
          />
          <button
            onClick={handleAdd}
            disabled={submitting}
            className="w-9 h-9 rounded-lg bg-cyan hover:bg-cyan-bright text-[#04121a] flex items-center justify-center transition disabled:opacity-50"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="text-[10px] font-mono tracking-wide text-muted grid grid-cols-3 px-1 pb-2 border-b border-border">
        <span>TECHNOLOGY</span>
        <span>VERSION</span>
        <span>STATUS</span>
      </div>

      {loading && <p className="text-xs text-muted font-mono py-4">Loading...</p>}
      {!loading && items.length === 0 && (
        <p className="text-xs text-muted font-mono py-4">No technologies installed</p>
      )}

      {items.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-3 items-center px-1 py-3 border-b border-border/50 text-sm group"
        >
          <span className="font-medium">{item.tech_name}</span>
          <span className="text-muted font-mono text-xs">{item.version}</span>
          <div className="flex items-center justify-between">
            <span
              className={`text-[10px] font-mono px-2 py-1 rounded-full border ${statusStyle[item.status]}`}
            >
              {item.status}
            </span>
            <button
              onClick={() => handleDelete(item.id)}
              className="opacity-0 group-hover:opacity-100 text-muted hover:text-red-400 text-xs transition"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}