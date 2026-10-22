import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/auth";
import { getDb, hasDatabase } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  if (!rateLimit(`contact:${clientIp(req)}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  // Honeypot field filled → almost certainly a bot. Pretend it worked.
  if (clean(body.company, 200)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const type = clean(body.type, 50);
  const message = clean(body.message, 2000);

  if (!name || !message) return NextResponse.json({ error: "Please add your name and a message." }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });

  if (!hasDatabase()) {
    return NextResponse.json({ error: "The contact form isn't connected yet." }, { status: 503 });
  }

  const db = await getDb();
  await db.collection("messages").insertOne({
    name,
    email,
    type,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json({ ok: true });
}
