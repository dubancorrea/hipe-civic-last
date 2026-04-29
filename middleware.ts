import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login-registration" },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
