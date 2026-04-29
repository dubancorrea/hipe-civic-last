"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Volume2 } from "lucide-react";

const NAV = [
  { href: "/volunteer", label: "VOLUNTEERISM" },
  { href: "/volunteer-opportunities", label: "OPPORTUNITIES" },
  { href: "/civic-engagement", label: "CIVIC ENGAGEMENT" },
  { href: "/campus-advocacy", label: "ADVOCACY" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const loggedIn = status === "authenticated";

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b-4 border-black">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center gap-8">
        <Link href="/" className="shrink-0">
          <div className="text-[#0055FF] font-black italic leading-none text-2xl tracking-tight">
            HIPE<br />CIVIC
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wider text-neutral-500">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-[#0055FF] transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {loggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-2 rounded-full bg-black text-white px-5 py-3 font-extrabold text-sm border-4 border-black hover:bg-[#0055FF] transition-colors"
              >
                DASHBOARD
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full bg-white text-black px-5 py-3 font-extrabold text-sm border-4 border-black hover:bg-black hover:text-white transition-colors"
              >
                LOG OUT
              </button>
            </>
          ) : (
            <Link
              href="/login-registration"
              className="inline-flex items-center gap-2 rounded-full bg-[#0055FF] text-white px-5 py-3 font-extrabold text-sm border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              <Volume2 className="h-4 w-4" />
              GET INVOLVED
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
