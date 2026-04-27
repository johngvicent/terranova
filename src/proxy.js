import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isPublicLeadCreate = pathname === "/api/leads" && req.method === "POST";

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!req.auth) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /api/leads GET, PATCH, DELETE (admin-only API routes)
  // POST /api/leads is public (contact form)
  if (
    pathname.startsWith("/api/leads") &&
    !pathname.startsWith("/api/webhooks") &&
    !isPublicLeadCreate
  ) {
    if (!req.auth) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/leads/:path*"],
};