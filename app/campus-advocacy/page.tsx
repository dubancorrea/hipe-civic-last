export default function CampusAdvocacyPage() {
  const campaigns = [
    { t: "TUITION JUSTICE", d: "Push CUNY's BOT to halt the proposed 5% tuition hike.", c: "#0055FF" },
    { t: "GOOD CAUSE EVICTION", d: "Educate CUNY tenants on NY's new Good Cause protections.", c: "#000" },
    { t: "CLIMATE CUNY", d: "100% renewable campuses by 2030 — sign the open letter.", c: "#0055FF" },
    { t: "MENTAL HEALTH FUNDING", d: "Restore counselor-to-student ratios across the system.", c: "#000" },
  ];
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="text-7xl md:text-9xl font-black italic text-[#0055FF] tracking-tighter leading-[0.9]">
        ADVOCACY
      </h1>
      <p className="mt-8 max-w-2xl text-xl text-neutral-700">
        Active campus campaigns you can pledge to from your dashboard.
      </p>
      <div className="mt-10 grid md:grid-cols-2 gap-6">
        {campaigns.map((c) => (
          <div
            key={c.t}
            style={{ background: c.c === "#0055FF" ? "#0055FF" : "#fff" }}
            className={`rounded-[32px] border-4 border-black p-10 brutal-shadow ${
              c.c === "#0055FF" ? "text-white" : "text-black"
            }`}
          >
            <h3 className="font-black italic text-4xl mb-3">{c.t}</h3>
            <p className={c.c === "#0055FF" ? "text-white/90" : "text-neutral-600"}>{c.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
