"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const token = sp.get("token") || "";
  const uid = sp.get("uid") || "";
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, uid, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setErr(data.error || "Failed");
      return;
    }
    setMsg("Password updated. Redirecting to login...");
    setTimeout(() => router.push("/login-registration"), 1500);
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white border-4 border-black rounded-[32px] p-10 brutal-shadow">
        <h1 className="text-4xl font-black italic text-[#0055FF]">RESET<br />PASSWORD</h1>
        {!token || !uid ? (
          <p className="mt-4 text-red-600 font-bold">Invalid reset link.</p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="New password"
              className="w-full border-4 border-black rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-[#0055FF]"
            />
            <button
              disabled={loading}
              className="w-full bg-[#0055FF] text-white py-4 rounded-full font-extrabold border-4 border-black brutal-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
            >
              {loading ? "..." : "UPDATE PASSWORD"}
            </button>
            {err && <p className="text-red-600 text-sm font-bold">{err}</p>}
            {msg && <p className="text-green-700 text-sm font-bold">{msg}</p>}
          </form>
        )}
        <Link href="/login-registration" className="block mt-6 text-sm font-bold text-[#0055FF] hover:underline">
          ← Back to login
        </Link>
      </div>
    </div>
  );
}
