"use client";

import { useState } from "react";
import { Terminal } from "lucide-react";
import { runCommand } from "@/lib/servers/servers";

export default function ExecuteCommandPanel({ serverId }: { serverId: string }) {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRun() {
    if (!command.trim()) return;
    setRunning(true);
    setError(null);
    const ranCommand = command;
    setOutput((prev) => [...prev, `$ ${ranCommand}`]);
    setCommand("");

    try {
      const result = await runCommand(serverId, ranCommand);
      const text =
        result.output ?? result.stdout ?? result.message ?? JSON.stringify(result);
      setOutput((prev) => [...prev, text]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Command failed";
      setError(msg);
      setOutput((prev) => [...prev, `error: ${msg}`]);
    } finally {
      setRunning(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleRun();
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Terminal size={16} className="text-cyan" />
          Execute Command
        </div>
        <button
          onClick={handleRun}
          disabled={running || !command.trim()}
          className="text-xs font-mono bg-cyan hover:bg-cyan-bright text-[#04121a] px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {running ? "RUNNING..." : "RUN JOB"}
        </button>
      </div>

      <textarea
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter remote command here..."
        disabled={running}
        className="w-full h-20 rounded-lg border border-border bg-[#0b0f17] px-4 py-3 font-mono text-sm text-white placeholder:text-muted resize-none focus:outline-none focus:ring-1 focus:ring-cyan focus:border-cyan transition disabled:opacity-60"
      />

      <div className="mt-3 rounded-lg bg-black border border-border p-4 font-mono text-xs h-48 overflow-y-auto">
        {output.length === 0 && (
          <p className="text-muted">Output will appear here after running a command.</p>
        )}
        {output.map((line, i) => (
          <p
            key={i}
            className={
              line.startsWith("$")
                ? "text-cyan mb-1"
                : line.startsWith("error:")
                ? "text-red-400 mb-1"
                : "text-white/80 mb-1 whitespace-pre-wrap"
            }
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}