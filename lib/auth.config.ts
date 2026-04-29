// Edge-safe NextAuth config used by middleware (no DB / bcrypt imports).
import type { NextAuthOptions } from "next-auth";

export const authConfig: Partial<NextAuthOptions> = {
  pages: { signIn: "/login-registration" },
  session: { strategy: "jwt" },
};
