"use client";
import Link from "next/link";
import { Heart, Globe, Megaphone, ArrowUpRight, Volume2 } from "lucide-react";

export default function Home() {
  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pt-12 pb-8">
          <h1 className="text-[18vw] md:text-[14rem] leading-[0.85] font-black italic tracking-tighter text-[#0055FF] select-none">
            VOLUNTEERISM
          </h1>
        </div>
      </section>

      {/* TWO BIG CARDS */}
      <section className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-8 -mt-8">
        <div className="bg-white border-4 border-black rounded-[40px] p-10 brutal-shadow relative overflow-hidden">
          <Heart className="h-16 w-16 text-[#0055FF] mb-16" strokeWidth={2.5} />
          <h2 className="text-5xl md:text-6xl font-black italic leading-none mb-6">COMMUNITY<br />SUPPORT</h2>
          <p className="text-neutral-600 text-lg max-w-md">
            Direct action through the Bowery Mission, Habitat for Humanity, and NYC food banks. Real hours, real impact — logged automatically.
          </p>
        </div>

        <div className="bg-[#0055FF] border-4 border-black rounded-[40px] p-10 brutal-shadow text-white relative overflow-hidden">
          <Globe className="h-16 w-16 text-white/90 mb-16" strokeWidth={2.5} />
          <h2 className="text-5xl md:text-6xl font-black italic leading-none mb-6">SERVICE<br />LEARNING</h2>
          <p className="text-white/90 text-lg max-w-md">
            Experiential learning paths connecting your classroom theory to real-world Bronx, Brooklyn, and Queens communities.
          </p>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="mx-auto max-w-7xl px-6 my-20 grid md:grid-cols-3 gap-6">
        {[
          { href: "/volunteer-opportunities", title: "FIND AN OPPORTUNITY", body: "Filter by major, browse 14+ live placements." },
          { href: "/civic-engagement", title: "PLEDGE TO VOTE", body: "Pledges + RSVPs to civic events, persisted to your profile." },
          { href: "/campus-advocacy", title: "CAMPUS ADVOCACY", body: "Tenant rights, climate, and tuition justice campaigns." },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group bg-white border-4 border-black rounded-3xl p-8 brutal-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <Megaphone className="h-10 w-10 text-[#0055FF]" />
              <ArrowUpRight className="h-7 w-7 group-hover:rotate-12 transition-transform" />
            </div>
            <h3 className="font-black italic text-2xl mb-2">{c.title}</h3>
            <p className="text-neutral-600">{c.body}</p>
          </Link>
        ))}
      </section>

      {/* GET INVOLVED */}
      <section className="mx-auto max-w-7xl px-6 mb-24">
        <div className="bg-black text-white rounded-[40px] p-12 md:p-20 border-4 border-black flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="flex-1">
            <h2 className="text-5xl md:text-7xl font-black italic leading-[0.9]">
              READY TO<br />
              <span className="text-[#0055FF]">GET INVOLVED?</span>
            </h2>
            <p className="text-white/70 mt-6 max-w-xl text-lg">
              Join HIPE Civic — the CUNY-wide hub for service hours, civic pledges, and student advocacy.
            </p>
          </div>
          <Link
            href="/login-registration"
            className="inline-flex items-center gap-3 rounded-full bg-[#0055FF] text-white px-8 py-5 font-extrabold text-lg border-4 border-white hover:bg-white hover:text-black transition-colors"
          >
            <Volume2 className="h-5 w-5" />
            GET INVOLVED
          </Link>
        </div>
      </section>
    </div>
  );
}
