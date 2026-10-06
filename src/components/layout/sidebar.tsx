"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, LogOut, Plus } from "lucide-react";
import { logout } from "@/lib/auth";
import { getServers, type Server, type ServerStatus } from "@/lib/servers/servers";

const statusColor: Record<ServerStatus, string> = {
  ONLINE: "bg-cyan shadow-[0_0_6px_rgba(34,211,238,0.8)]",
  OFFLINE: "bg-red-500",
  UNKNOWN: "bg-muted",
};

const navItems = [
  { label: "Servers", href: "/dashboard/servers", icon: LayoutGrid },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getServers()
      .then(setServers)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load servers"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 border-r border-border bg-surface flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <Image src="/logo.png" alt="ServerPilot" width={32} height={32} />
        <div>
          <p className="text-sm font-bold leading-none">ServerPilot</p>
          <p className="text-[10px] text-muted font-mono tracking-wide mt-1">
            Infrastructure Control
          </p>
        </div>
      </div>

      {/* Live servers */}
      <div className="px-4 pt-5">
        <p className="text-[10px] font-mono tracking-[0.15em] text-muted mb-2 px-1">
          LIVE SERVERS
        </p>
        <div className="space-y-1">
          {loading && (
            <p className="text-xs text-muted font-mono px-3 py-2">Loading...</p>
          )}
          {error && (
            <p className="text-xs text-red-400 font-mono px-3 py-2">{error}</p>
          )}
          {!loading && !error && servers.length === 0 && (
            <p className="text-xs text-muted font-mono px-3 py-2">No servers yet</p>
          )}
          {servers.map((server) => (
            <Link
              key={server.id}
              href={`/dashboard/servers/${server.id}`}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-mono transition ${
                pathname === `/dashboard/servers/${server.id}`
                  ? "bg-cyan/10 text-cyan border-l-2 border-cyan"
                  : "text-white/80 hover:bg-white/5"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${statusColor[server.status]}`} />
              {server.hostname}
            </Link>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="px-4 pt-6 space-y-1 flex-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                active ? "bg-cyan/10 text-cyan" : "text-white/80 hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Add server + logout */}
      <div className="p-4 border-t border-border space-y-3">
        <Link
          href="/dashboard/servers/new"
          className="flex items-center justify-center gap-2 w-full rounded-lg bg-cyan hover:bg-cyan-bright text-[#04121a] text-sm font-semibold py-2.5 transition"
        >
          <Plus size={16} />
          Add Server
        </Link>
        <button
          onClick={() => logout(router)}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-muted hover:text-white hover:bg-white/5 transition"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}