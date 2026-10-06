"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { register } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
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
            <h1 className="text-2xl font-bold">Request Access</h1>
            <p className="mt-1 text-xs tracking-[0.2em] text-cyan font-mono uppercase">
              New Operator Account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold tracking-wide mb-2">USERNAME</label>
              <input
                required
                value={name}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="john_doe"
                className="w-full rounded-lg border border-border bg-[#0b0f17] px-4 py-3 font-mono text-sm text-white placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-cyan focus:border-cyan transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wide mb-2">EMAIL ADDRESS</label>
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
              <label className="block text-xs font-semibold tracking-wide mb-2">PASSWORD</label>
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
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <span aria-hidden>→</span>}
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center mt-6 text-xs text-muted font-mono">
          Already have access?{" "}
          <Link href="/login" className="text-cyan hover:text-cyan-bright ml-1">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}