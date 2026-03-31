/**
 * Auth.js config that is safe for Edge Runtime (no Prisma, no Node APIs).
 * Used by middleware.js for session checking.
 * The full auth.js re-exports this and adds the CredentialsProvider with Prisma.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // Protect /admin routes (except /admin/login)
      if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        return isLoggedIn;
      }

      return true;
    },
  },
  providers: [], // Populated in auth.js with CredentialsProvider
};
