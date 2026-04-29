"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateOpportunityPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", org: "", category: "Community", major: "Any Major",
    hours: 4, location: "", description: "", date: "",
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  if (status === "authenticated" && (session?.user as any)?.role !== "staff") {
    return (
      <div className="max-w-xl mx-auto p-12">
        <h1 className="text-3xl font-black italic">Staff only</h1>
        <p className="text-neutral-600 mt-2">Only staff accounts can post opportunities.</p>
        <Link href="/dashboard" className="text-[#0055FF] font-bold mt-4 inline-block">← Dashboard</Link>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(""); setErr("");
    const res = await fetch("/api/staff/opportunities", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, major: form.major.split(",").map((m) => m.trim()) }),
    });
    const data = await res.json();
    if (!res.ok) setErr(data.error || "Failed");
    else { setMsg("✓ Opportunity published!"); setTimeout(() => router.push("/dashboard"), 1200); }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-black italic text-[#0055FF]">NEW OPPORTUNITY</h1>
      <form onSubmit={submit} className="mt-8 space-y-4 bg-white border-4 border-black rounded-3xl p-8 brutal-shadow">
        <Field label="Title" v={form.title} on={(v) => setForm({ ...form, title: v })} />
        <Field label="Organization" v={form.org} on={(v) => setForm({ ...form, org: v })} />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-sm">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border-4 border-black rounded-xl px-3 py-3 font-bold mt-1">
              {["Arts","Medicine","STEM","Community","Education","Advocacy"].map((c)=> <option key={c}>{c}</option>)}
            </select>
          </div>
          <Field label="Hours" type="number" v={String(form.hours)} on={(v) => setForm({ ...form, hours: Number(v) })} />
        </div>
        <Field label="Majors (comma-separated)" v={form.major} on={(v) => setForm({ ...form, major: v })} />
        <Field label="Location" v={form.location} on={(v) => setForm({ ...form, location: v })} />
        <Field label="Date (YYYY-MM-DD)" v={form.date} on={(v) => setForm({ ...form, date: v })} />
        <div>
          <label className="font-bold text-sm">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4} className="w-full border-4 border-black rounded-xl px-3 py-2 font-medium mt-1" />
        </div>
        {err && <p className="text-red-600 font-bold text-sm">{err}</p>}
        {msg && <p className="text-green-700 font-bold text-sm">{msg}</p>}
        <button className="w-full bg-[#0055FF] text-white py-3 rounded-full font-extrabold border-4 border-black brutal-shadow-sm">PUBLISH</button>
      </form>
    </div>
  );
}

function Field({ label, v, on, type="text" }: { label: string; v: string; on: (s: string) => void; type?: string }) {
  return (
    <div>
      <label className="font-bold text-sm">{label}</label>
      <input type={type} value={v} onChange={(e) => on(e.target.value)} required
        className="w-full border-4 border-black rounded-xl px-3 py-3 font-bold mt-1" />
    </div>
  );
}
