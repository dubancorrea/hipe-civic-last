"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ALL_MAJORS } from "@/lib/opportunities";

type Opp = {
  id: string;
  title: string;
  org: string;
  category: string;
  major: string[];
  hours: number;
  location: string;
  description: string;
  date: string;
  source?: string;
};

export default function VolunteerOpportunitiesPage() {
  const { status } = useSession();
  const [opps, setOpps] = useState<Opp[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [cat, setCat] = useState<string>("All");
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [motivation, setMotivation] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/opportunities/list")
      .then((r) => r.json())
      .then((d) => setOpps(d.opportunities || []));
  }, []);

  const cats = ["All", "Arts", "Medicine", "STEM", "Community", "Education", "Advocacy"];
  const filtered = opps.filter(
    (o) =>
      (cat === "All" || o.category === cat) &&
      (filter === "All" || o.major.includes(filter) || o.major.includes("Any Major"))
  );

  async function apply(id: string) {
    setMsg("");
    const res = await fetch("/api/opportunities/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId: id, motivation }),
    });
    const data = await res.json();
    if (!res.ok) setMsg(data.error || "Failed");
    else setMsg("✓ Application submitted! View it on your dashboard.");
    setApplyingId(null);
    setMotivation("");
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-6xl md:text-8xl font-black italic text-[#0055FF] tracking-tighter leading-[0.9]">
        OPPORTUNITIES
      </h1>
      <p className="mt-4 text-neutral-600 max-w-2xl">
        {opps.length} live placements — filter by your major or pick a category.
      </p>

      {/* Filters */}
      <div className="mt-8 space-y-3">
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full font-extrabold text-sm border-4 border-black transition-all ${
                cat === c ? "bg-[#0055FF] text-white" : "bg-white text-black hover:bg-black hover:text-white"
              }`}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <label className="font-bold text-sm tracking-wider">MAJOR:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border-4 border-black rounded-xl px-3 py-2 font-bold"
          >
            <option value="All">All Majors</option>
            {ALL_MAJORS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {msg && <p className="mt-4 text-sm font-bold text-[#0055FF]">{msg}</p>}

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((o, idx) => (
          <div
            key={o.id}
            className={`rounded-3xl border-4 border-black p-6 brutal-shadow-sm flex flex-col ${
              idx % 4 === 1 ? "bg-[#0055FF] text-white" : idx % 4 === 3 ? "bg-black text-white" : "bg-white"
            }`}
          >
            <span className={`text-xs font-extrabold tracking-widest mb-2 ${idx % 4 === 1 || idx % 4 === 3 ? "text-white/70" : "text-[#0055FF]"}`}>
              {o.category.toUpperCase()} · {o.hours}H
            </span>
            <h3 className="font-black italic text-2xl leading-tight">{o.title}</h3>
            <p className={`mt-1 text-sm font-bold ${idx % 4 === 1 || idx % 4 === 3 ? "text-white/80" : "text-neutral-600"}`}>
              {o.org} · {o.location}
            </p>
            <p className={`mt-3 text-sm flex-1 ${idx % 4 === 1 || idx % 4 === 3 ? "text-white/90" : "text-neutral-700"}`}>
              {o.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1">
              {o.major.slice(0, 3).map((m) => (
                <span
                  key={m}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border-2 ${
                    idx % 4 === 1 || idx % 4 === 3
                      ? "border-white/50 text-white/90"
                      : "border-black text-black"
                  }`}
                >
                  {m}
                </span>
              ))}
            </div>

            {applyingId === o.id ? (
              <div className="mt-4 space-y-2">
                <textarea
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="Why are you interested? (optional)"
                  rows={2}
                  className="w-full text-black border-4 border-black rounded-lg p-2 text-sm font-medium"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => apply(o.id)}
                    className="flex-1 bg-white text-black border-4 border-black px-3 py-2 rounded-full font-extrabold text-xs hover:bg-[#0055FF] hover:text-white"
                  >
                    SUBMIT
                  </button>
                  <button
                    onClick={() => setApplyingId(null)}
                    className="flex-1 border-4 border-black px-3 py-2 rounded-full font-extrabold text-xs"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            ) : status === "authenticated" ? (
              <button
                onClick={() => setApplyingId(o.id)}
                className={`mt-4 px-4 py-2 rounded-full font-extrabold text-sm border-4 border-black ${
                  idx % 4 === 1 || idx % 4 === 3
                    ? "bg-white text-black hover:bg-[#0055FF] hover:text-white"
                    : "bg-[#0055FF] text-white hover:bg-black"
                } transition-colors`}
              >
                APPLY →
              </button>
            ) : (
              <Link
                href="/login-registration"
                className="mt-4 px-4 py-2 rounded-full font-extrabold text-sm border-4 border-black text-center bg-white text-black hover:bg-black hover:text-white"
              >
                LOG IN TO APPLY
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
