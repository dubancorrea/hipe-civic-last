"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const EVENTS = [
  { id: "evt-vote-2025", title: "NYC Primary Election Day", date: "2025-06-24" },
  { id: "evt-tenant-tt", title: "Tenant Town Hall — Bronx", date: "2025-07-09" },
  { id: "evt-climate-march", title: "NYC Climate Strike", date: "2025-09-19" },
  { id: "evt-cuny-rally", title: "Tuition Justice Rally @ City Hall", date: "2025-08-14" },
];

const CAMPAIGNS = ["Tuition Justice", "Good Cause Eviction", "Climate CUNY", "Mental Health Funding"];

export default function CivicEngagementPage() {
  const { status } = useSession();
  const [pledges, setPledges] = useState<any[]>([]);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [campaign, setCampaign] = useState(CAMPAIGNS[0]);
  const [msg, setMsg] = useState("");

  async function refresh() {
    if (status !== "authenticated") return;
    const [p, r] = await Promise.all([
      fetch("/api/civic/pledge").then((r) => r.json()),
      fetch("/api/civic/rsvp").then((r) => r.json()),
    ]);
    setPledges(p.pledges || []);
    setRsvps(r.rsvps || []);
  }
  useEffect(() => {
    refresh();
  }, [status]);

  async function pledgeVote() {
    setMsg("");
    const res = await fetch("/api/civic/pledge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "vote", note: "I pledge to vote in the next election." }),
    });
    if (res.ok) { setMsg("✓ Vote pledge saved!"); refresh(); }
  }

  async function pledgeCampaign() {
    const res = await fetch("/api/civic/pledge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "campaign", campaign }),
    });
    if (res.ok) { setMsg(`✓ Joined ${campaign}!`); refresh(); }
  }

  async function rsvp(evt: typeof EVENTS[0]) {
    const res = await fetch("/api/civic/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: evt.id, eventTitle: evt.title, eventDate: evt.date }),
    });
    const data = await res.json();
    if (res.ok) { setMsg(`✓ RSVP'd to ${evt.title}!`); refresh(); }
    else setMsg(data.error || "Failed");
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-6xl md:text-8xl font-black italic text-[#0055FF] tracking-tighter leading-[0.9]">
        CIVIC ENGAGEMENT
      </h1>
      <p className="mt-4 text-neutral-600 max-w-2xl">
        Pledge to vote, join a campaign, RSVP to civic events. Everything persists to your profile.
      </p>
      {msg && <p className="mt-4 text-sm font-bold text-[#0055FF]">{msg}</p>}

      {status !== "authenticated" && (
        <Link
          href="/login-registration"
          className="inline-block mt-6 bg-[#0055FF] text-white px-6 py-3 rounded-full font-extrabold border-4 border-black brutal-shadow-sm"
        >
          LOG IN TO PARTICIPATE
        </Link>
      )}

      <div className="mt-10 grid md:grid-cols-2 gap-6">
        {/* Vote pledge */}
        <div className="bg-[#0055FF] text-white border-4 border-black rounded-[32px] p-8 brutal-shadow">
          <h2 className="text-4xl font-black italic">PLEDGE TO VOTE</h2>
          <p className="mt-2 text-white/90">Add your name to the CUNY voter pledge wall.</p>
          <button
            disabled={status !== "authenticated"}
            onClick={pledgeVote}
            className="mt-6 bg-white text-black px-6 py-3 rounded-full font-extrabold border-4 border-black hover:bg-black hover:text-white transition-colors disabled:opacity-50"
          >
            I PLEDGE TO VOTE
          </button>
        </div>

        {/* Campaign pledge */}
        <div className="bg-white border-4 border-black rounded-[32px] p-8 brutal-shadow">
          <h2 className="text-4xl font-black italic">JOIN A CAMPAIGN</h2>
          <select
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            className="mt-4 w-full border-4 border-black rounded-xl px-3 py-2 font-bold"
          >
            {CAMPAIGNS.map((c) => <option key={c}>{c}</option>)}
          </select>
          <button
            disabled={status !== "authenticated"}
            onClick={pledgeCampaign}
            className="mt-4 bg-black text-white px-6 py-3 rounded-full font-extrabold border-4 border-black hover:bg-[#0055FF] transition-colors disabled:opacity-50"
          >
            COUNT ME IN
          </button>
        </div>
      </div>

      {/* Events */}
      <h2 className="mt-16 text-4xl font-black italic">UPCOMING EVENTS</h2>
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {EVENTS.map((e) => {
          const already = rsvps.some((r) => r.eventId === e.id);
          return (
            <div key={e.id} className="bg-white border-4 border-black rounded-2xl p-6 brutal-shadow-sm flex justify-between items-center gap-4">
              <div>
                <p className="font-black italic text-xl leading-tight">{e.title}</p>
                <p className="text-sm text-neutral-500 font-bold">{e.date}</p>
              </div>
              <button
                disabled={status !== "authenticated" || already}
                onClick={() => rsvp(e)}
                className={`px-4 py-2 rounded-full font-extrabold text-sm border-4 border-black transition-colors disabled:opacity-50 ${
                  already ? "bg-black text-white" : "bg-[#0055FF] text-white hover:bg-black"
                }`}
              >
                {already ? "RSVP'D" : "RSVP"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      {status === "authenticated" && (
        <div className="mt-16 grid md:grid-cols-3 gap-4">
          <Stat label="VOTE PLEDGES" value={pledges.filter((p) => p.type === "vote").length} />
          <Stat label="CAMPAIGNS JOINED" value={pledges.filter((p) => p.type === "campaign").length} />
          <Stat label="EVENT RSVPS" value={rsvps.length} />
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-black text-white border-4 border-black rounded-2xl p-6">
      <p className="text-xs font-extrabold tracking-widest text-white/60">{label}</p>
      <p className="text-5xl font-black italic mt-2">{value}</p>
    </div>
  );
}
