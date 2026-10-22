import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

// Public on purpose (see middleware.ts): answers "am I signed in?" without a 401,
// so the embedded admin panel knows whether to show the login form or the dashboard.
export async function GET(req: NextRequest) {
  let loggedIn = false;
  try {
    loggedIn = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  } catch {
    loggedIn = false; // e.g. SESSION_SECRET missing
  }
  return NextResponse.json({ loggedIn }, { headers: { "Cache-Control": "no-store" } });
}
