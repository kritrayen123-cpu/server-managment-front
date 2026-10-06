import { Server as ServerIcon, Pencil, Trash2 } from "lucide-react";
import type { Server } from "@/lib/servers/servers";

const statusStyle: Record<Server["status"], string> = {
  ONLINE: "bg-cyan/10 text-cyan border-cyan/30",
  OFFLINE: "bg-red-500/10 text-red-400 border-red-500/30",
  UNKNOWN: "bg-white/5 text-muted border-border",
};

export default function ServerHeader({
  server,
  onEdit,
  onDelete,
}: {
  server: Server;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-[#0b1420] border border-border flex items-center justify-center">
          <ServerIcon size={22} className="text-cyan" />
        </div>
        <div>
          <h1 className="text-lg font-bold">{server.hostname}</h1>
          <p className="text-xs text-muted font-mono mt-1">
            {server.description} · {server.ssh_username} · Port {server.ssh_port}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`text-xs font-mono px-3 py-1 rounded-full border ${statusStyle[server.status]}`}
        >
          {server.status}
        </span>
        <button
          onClick={onEdit}
          className="w-9 h-9 rounded-lg border border-border hover:border-cyan/50 hover:text-cyan flex items-center justify-center transition"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onDelete}
          className="w-9 h-9 rounded-lg border border-border hover:border-red-500/50 hover:text-red-400 flex items-center justify-center transition"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}