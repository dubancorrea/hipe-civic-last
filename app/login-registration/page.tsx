"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginRegistrationPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    school: "",
    major: "",
    role: "student",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Signup failed");
      }
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (result?.error) throw new Error("Invalid credentials");

      // Wait for session cookie to be set before redirecting
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.refresh();
      router.push("/dashboard");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12 bg-gradient-to-br from-white via-blue-50/40 to-white">
      <div className="w-full max-w-md bg-white border-4 border-black rounded-[32px] p-10 brutal-shadow">
        <h1 className="text-5xl font-black italic text-center text-[#0055FF] leading-none">
          HIPE<br />CIVIC
        </h1>
        <p className="text-center text-sm font-bold tracking-widest mt-3 text-neutral-500">
          {mode === "login" ? "WELCOME BACK" : "JOIN THE MOVEMENT"}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2 bg-black rounded-full p-1">
          {["login", "signup"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as any)}
              className={`py-2 rounded-full font-extrabold text-sm transition-all ${
                mode === m ? "bg-[#0055FF] text-white" : "text-white/60"
              }`}
            >
              {m === "login" ? "LOG IN" : "SIGN UP"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <>
              <Input value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Full Name" />
              <div className="grid grid-cols-2 gap-3">
                <Input value={form.school} onChange={(v) => setForm({ ...form, school: v })} placeholder="CUNY School" />
                <Input value={form.major} onChange={(v) => setForm({ ...form, major: v })} placeholder="Major" />
              </div>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full border-4 border-black rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-0 focus:border-[#0055FF]"
              >
                <option value="student">I'm a Student</option>
                <option value="staff">I'm Staff / Advisor</option>
              </select>
            </>
          )}
          <Input type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="Email" />
          <Input type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} placeholder="Password" />

          {err && <p className="text-red-600 text-sm font-bold">{err}</p>}

          <button
            disabled={loading}
            className="w-full bg-[#0055FF] text-white py-4 rounded-full font-extrabold border-4 border-black brutal-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
          >
            {loading ? "..." : mode === "login" ? "LOG IN" : "CREATE ACCOUNT"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-xs font-bold">
          <Link href="/forgot-password" className="text-[#0055FF] hover:underline">
            Forgot password?
          </Link>
          <Link href="/" className="text-neutral-500 hover:text-black">
            ← Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required
      className="w-full border-4 border-black rounded-xl px-4 py-3 font-bold placeholder:text-neutral-400 focus:outline-none focus:border-[#0055FF]"
    />
  );
}