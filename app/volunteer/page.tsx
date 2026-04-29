import Link from "next/link";

export default function VolunteerPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="text-7xl md:text-9xl font-black italic text-[#0055FF] tracking-tighter leading-[0.9]">
        VOLUNTEERISM
      </h1>
      <p className="mt-8 max-w-2xl text-xl text-neutral-700">
        HIPE Civic connects CUNY students to direct-service, service-learning, and civic-engagement opportunities across the five boroughs.
      </p>
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        {[
          { t: "DIRECT SERVICE", d: "Soup kitchens, build days, ER support, gallery work." },
          { t: "SERVICE LEARNING", d: "Course-linked placements with reflection journals." },
          { t: "CIVIC ACTION", d: "Voter drives, phone banks, tenant outreach." },
        ].map((c, i) => (
          <div
            key={i}
            className={`rounded-[32px] border-4 border-black p-8 brutal-shadow-sm ${
              i === 1 ? "bg-[#0055FF] text-white" : "bg-white"
            }`}
          >
            <h3 className="font-black italic text-3xl mb-3">{c.t}</h3>
            <p className={i === 1 ? "text-white/90" : "text-neutral-600"}>{c.d}</p>
          </div>
        ))}
      </div>
      <Link
        href="/volunteer-opportunities"
        className="inline-block mt-12 bg-black text-white px-8 py-4 rounded-full font-extrabold border-4 border-black brutal-shadow-sm hover:bg-[#0055FF] transition-colors"
      >
        BROWSE OPPORTUNITIES →
      </Link>
    </div>
  );
}
