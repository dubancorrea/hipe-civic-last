"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ApplicantsPage() {
  const { data: session, status } = useSession();
  const [apps, setApps] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  async function load() {
    const r = await fetch("/api/staff/applications");
    if (r.status === 403) return;
    const d = await r.json();
    setApps(d.applications || []);
  }
  useEffect(() => { if (status === "authenticated") load(); }, [status]);

  async function setStatus(id: string, s: string) {
    const r = await fetch(`/api/staff/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: s }),
    });
    if (r.ok) { setMsg(`✓ Marked ${s}`); load(); }
  }

  if (status === "authenticated" && (session?.user as any)?.role !== "staff") {
    return (
      <div className="max-w-xl mx-auto p-12">
        <h1 className="text-3xl font-black italic">Staff only</h1>
        <Link href="/dashboard" className="text-[#0055FF] font-bold mt-4 inline-block">← Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-black italic text-[#0055FF]">APPLICANTS</h1>
      <p className="text-neutral-600 mt-2">Review and decide on submitted applications.</p>
      {msg && <p className="mt-4 text-[#0055FF] font-bold">{msg}</p>}

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        {apps.length === 0 && <p className="text-neutral-500">No applications yet.</p>}
        {apps.map((a) => (
          <div key={a.id} className="bg-white border-4 border-black rounded-2xl p-5 brutal-shadow-sm">
            <div className="flex justify-between">
              <div>
                <h3 className="font-black italic text-lg leading-tight">{a.opportunityTitle}</h3>
                <p className="text-sm text-neutral-600 font-bold">{a.userName} · {a.userEmail}</p>
              </div>
              <span className={`text-[10px] font-extrabold tracking-widest px-2 py-1 rounded-full border-2 border-black self-start ${
                a.status === "accepted" ? "bg-[#0055FF] text-white" :
                a.status === "completed" ? "bg-black text-white" :
                a.status === "declined" ? "bg-red-500 text-white" : "bg-white"
              }`}>{a.status.toUpperCase()}</span>
            </div>
            {a.motivation && <p className="mt-3 text-sm text-neutral-700 italic">“{a.motivation}”</p>}
            <p className="text-xs text-neutral-500 mt-1 font-bold">Hours: {a.hoursLogged || 0}h</p>
            <div className="mt-3 flex gap-2 flex-wrap">
              <button onClick={() => setStatus(a.id, "accepted")} className="bg-[#0055FF] text-white px-3 py-1 rounded-full font-extrabold text-xs border-2 border-black">ACCEPT</button>
              <button onClick={() => setStatus(a.id, "declined")} className="bg-white px-3 py-1 rounded-full font-extrabold text-xs border-2 border-black">DECLINE</button>
              <button onClick={() => setStatus(a.id, "completed")} className="bg-black text-white px-3 py-1 rounded-full font-extrabold text-xs border-2 border-black">COMPLETE</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
