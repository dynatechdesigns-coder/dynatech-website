import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb, hasDatabase } from "@/lib/db";

export async function GET() {
  if (!hasDatabase()) return NextResponse.json({ messages: [] });
  const db = await getDb();
  const docs = await db.collection("messages").find().sort({ createdAt: -1 }).limit(200).toArray();
  return NextResponse.json({
    messages: docs.map((d) => ({ ...d, _id: String(d._id) })),
  });
}

export async function PATCH(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { id?: string; read?: boolean };
  if (!hasDatabase() || !body.id || !ObjectId.isValid(body.id)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const db = await getDb();
  await db.collection("messages").updateOne({ _id: new ObjectId(body.id) }, { $set: { read: Boolean(body.read) } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!hasDatabase() || !id || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const db = await getDb();
  await db.collection("messages").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}
