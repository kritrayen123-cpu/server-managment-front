"use client";

import { Search, Bell, Terminal, HelpCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Topbar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean).slice(1); // drop "dashboard"

  return (
    <header className="h-16 border-b border-border bg-surface/60 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-2 text-sm font-mono">
        <span className="text-cyan uppercase tracking-wide">
          {segments[0] || "Dashboard"}
        </span>
        {segments.slice(1).map((seg, i) => (
          <span key={i} className="text-muted flex items-center gap-2">
            <span>/</span>
            <span>{seg}</span>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            placeholder="Search commands..."
            className="bg-[#0b0f17] border border-border rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-cyan focus:border-cyan w-56 transition"
          />
        </div>
        <button className="text-muted hover:text-cyan transition">
          <Bell size={18} />
        </button>
        <button className="text-muted hover:text-cyan transition">
          <Terminal size={18} />
        </button>
        <button className="text-muted hover:text-cyan transition">
          <HelpCircle size={18} />
        </button>
      </div>
    </header>
  );
}