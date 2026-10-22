import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

// Everything under /admin and /api/admin needs a valid session,
// except the login page, the login endpoint, and the session check (which
// answers {loggedIn:false} itself instead of 401).
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login" || pathname === "/api/admin/login" || pathname === "/api/admin/session") {
    return NextResponse.next();
  }

  let ok = false;
  try {
    ok = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  } catch {
    ok = false; // e.g. SESSION_SECRET missing — treat as logged out
  }
  if (ok) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
