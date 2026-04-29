"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setResetUrl("");
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.resetUrl) setResetUrl(data.resetUrl);
    setMsg("If that email exists in HIPE Civic, a reset link has been issued.");
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white border-4 border-black rounded-[32px] p-10 brutal-shadow">
        <h1 className="text-4xl font-black italic text-[#0055FF]">FORGOT<br />PASSWORD</h1>
        <p className="text-neutral-600 mt-2">Enter your email and we'll generate a reset link.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@cuny.edu"
            className="w-full border-4 border-black rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-[#0055FF]"
          />
          <button
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-full font-extrabold border-4 border-black hover:bg-[#0055FF] transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "SEND RESET LINK"}
          </button>
        </form>

        {msg && <p className="mt-4 text-sm text-neutral-700">{msg}</p>}
        {resetUrl && (
          <div className="mt-4 p-3 border-2 border-dashed border-black rounded-lg break-all text-xs">
            <strong>Dev reset URL:</strong>{" "}
            <a href={resetUrl} className="text-[#0055FF] underline">{resetUrl}</a>
          </div>
        )}

        <Link href="/login-registration" className="block mt-6 text-sm font-bold text-[#0055FF] hover:underline">
          ← Back to login
        </Link>
      </div>
    </div>
  );
}
