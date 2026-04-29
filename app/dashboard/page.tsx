"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [apps, setApps] = useState<any[]>([]);
  const [pledges, setPledges] = useState<any[]>([]);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [hoursInput, setHoursInput] = useState<{ [k: string]: string }>({});
  const [msg, setMsg] = useState("");

  async function refresh() {
    const [a, p, r] = await Promise.all([
      fetch("/api/opportunities/my-applications").then((r) => r.json()),
      fetch("/api/civic/pledge").then((r) => r.json()),
      fetch("/api/civic/rsvp").then((r) => r.json()),
    ]);
    setApps(a.applications || []);
    setPledges(p.pledges || []);
    setRsvps(r.rsvps || []);
  }
  useEffect(() => { refresh(); }, []);

  async function logHours(applicationId: string) {
    const hours = Number(hoursInput[applicationId] || 0);
    if (!hours) return;
    const res = await fetch("/api/opportunities/log-hours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, hours }),
    });
    const data = await res.json();
    if (!res.ok) setMsg(data.error || "Failed");
    else { setMsg(`✓ Logged ${hours}h!`); setHoursInput({ ...hoursInput, [applicationId]: "" }); refresh(); }
  }

  const totalHours = apps.reduce((s, a) => s + (a.hoursLogged || 0), 0);
  const isStaff = (session?.user as any)?.role === "staff";

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-5xl md:text-7xl font-black italic text-[#0055FF] leading-none">
            DASHBOARD
          </h1>
          <p className="mt-3 text-neutral-600">Welcome back, <strong>{session?.user?.name}</strong> · <span className="text-[#0055FF] font-bold uppercase">{(session?.user as any)?.role}</span></p>
        </div>
        {isStaff && (
          <div className="flex gap-2">
            <Link href="/dashboard/create-opportunity" className="bg-[#0055FF] text-white px-5 py-3 rounded-full font-extrabold text-sm border-4 border-black brutal-shadow-sm">+ NEW OPPORTUNITY</Link>
            <Link href="/dashboard/applicants" className="bg-black text-white px-5 py-3 rounded-full font-extrabold text-sm border-4 border-black">REVIEW APPLICANTS</Link>
          </div>
        )}
      </div>

      {msg && <p className="mt-4 text-sm font-bold text-[#0055FF]">{msg}</p>}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="HOURS LOGGED" value={totalHours} highlight />
        <Stat label="APPLICATIONS" value={apps.length} />
        <Stat label="PLEDGES" value={pledges.length} />
        <Stat label="RSVPS" value={rsvps.length} />
      </div>

      {/* My Applications */}
      <h2 className="mt-12 text-3xl font-black italic">MY APPLICATIONS</h2>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        {apps.length === 0 && <p className="text-neutral-500">No applications yet — <Link href="/volunteer-opportunities" className="text-[#0055FF] font-bold underline">browse opportunities</Link>.</p>}
        {apps.map((a) => (
          <div key={a.id} className="bg-white border-4 border-black rounded-2xl p-5 brutal-shadow-sm">
            <div className="flex justify-between gap-3">
              <h3 className="font-black italic text-lg leading-tight">{a.opportunityTitle}</h3>
              <span className={`text-[10px] font-extrabold tracking-widest px-2 py-1 rounded-full border-2 border-black self-start ${
                a.status === "accepted" ? "bg-[#0055FF] text-white" :
                a.status === "completed" ? "bg-black text-white" :
                a.status === "declined" ? "bg-red-500 text-white" : "bg-white"
              }`}>{a.status.toUpperCase()}</span>
            </div>
            <p className="text-xs text-neutral-500 mt-1 font-bold">Logged: {a.hoursLogged || 0}h</p>
            {(a.status === "accepted" || a.status === "completed") && (
              <div className="mt-3 flex gap-2">
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  placeholder="+ hrs"
                  value={hoursInput[a.id] || ""}
                  onChange={(e) => setHoursInput({ ...hoursInput, [a.id]: e.target.value })}
                  className="w-20 border-4 border-black rounded-lg px-2 py-1 font-bold text-sm"
                />
                <button onClick={() => logHours(a.id)} className="bg-black text-white px-4 py-1 rounded-full font-extrabold text-xs border-2 border-black hover:bg-[#0055FF]">LOG</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Civic */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-3xl font-black italic">PLEDGES</h2>
          <ul className="mt-4 space-y-2">
            {pledges.length === 0 && <li className="text-neutral-500">No pledges yet.</li>}
            {pledges.map((p) => (
              <li key={p.id} className="bg-white border-4 border-black rounded-xl p-3 flex justify-between">
                <span className="font-bold">{p.type === "vote" ? "🗳️ Vote pledge" : `📣 ${p.campaign}`}</span>
                <span className="text-xs text-neutral-500">{new Date(p.createdAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-3xl font-black italic">EVENT RSVPS</h2>
          <ul className="mt-4 space-y-2">
            {rsvps.length === 0 && <li className="text-neutral-500">No RSVPs yet.</li>}
            {rsvps.map((r) => (
              <li key={r.id} className="bg-[#0055FF] text-white border-4 border-black rounded-xl p-3 flex justify-between">
                <span className="font-bold">{r.eventTitle}</span>
                <span className="text-xs text-white/80">{r.eventDate}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`border-4 border-black rounded-2xl p-5 brutal-shadow-sm ${highlight ? "bg-[#0055FF] text-white" : "bg-white"}`}>
      <p className={`text-xs font-extrabold tracking-widest ${highlight ? "text-white/80" : "text-neutral-500"}`}>{label}</p>
      <p className="text-4xl font-black italic mt-1">{value}</p>
    </div>
  );
}
