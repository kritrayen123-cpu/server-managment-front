"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { login, setToken } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
const res = await login(email, password);

console.log("LOGIN RESPONSE:", res);
console.log("ACCESS TOKEN:", res.accessToken);

setToken(res.accessToken);

console.log(
  "SAVED TOKEN:",
  localStorage.getItem("sp_token")
);

router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 rounded-xl bg-[#0b1420] border border-cyan/30 shadow-glow flex items-center justify-center mb-5">
              <Image src="/logo.png" alt="ServerPilot" width={56} height={56} />
            </div>
            <h1 className="text-2xl font-bold">ServerPilot</h1>
            <p className="mt-1 text-xs tracking-[0.2em] text-cyan font-mono uppercase">
              Infrastructure Control
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold tracking-wide mb-2">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@server.local"
                className="w-full rounded-lg border border-border bg-[#0b0f17] px-4 py-3 font-mono text-sm text-white placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-cyan focus:border-cyan transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold tracking-wide">
                  PASSWORD
                </label>
                <Link href="#" className="text-xs text-cyan hover:text-cyan-bright">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-border bg-[#0b0f17] px-4 py-3 font-mono text-sm text-white placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-cyan focus:border-cyan transition"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 font-mono bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-cyan hover:bg-cyan-bright text-[#04121a] font-semibold py-3 flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <span aria-hidden>→</span>}
            </button>
          </form>
        </div>

        <div className="flex items-center justify-between mt-6 px-1 text-xs text-muted font-mono">
          <Link href="/register" className="hover:text-cyan transition">
            + Request Access
          </Link>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            System Status: All Systems Operational
          </span>
        </div>
      </div>
    </main>
  );
}