import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getContent, saveSection } from "@/lib/content";
import { hasDatabase } from "@/lib/db";
import { EDITABLE_SECTIONS, type EditableSection } from "@/lib/types";

// Middleware already checks the session for every /api/admin/* request.

export async function GET() {
  const content = await getContent();
  return NextResponse.json({
    content,
    database: hasDatabase(),
    uploads: Boolean(
      process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET,
    ),
  });
}

export async function PUT(req: Request) {
  if (!hasDatabase()) {
    return NextResponse.json(
      { error: "No database connected. Add MONGODB_URI to your environment variables to save changes." },
      { status: 503 },
    );
  }

  const body = (await req.json().catch(() => null)) as { section?: string; value?: unknown } | null;
  const section = body?.section as EditableSection | undefined;
  if (!section || !EDITABLE_SECTIONS.includes(section)) {
    return NextResponse.json({ error: "Unknown section." }, { status: 400 });
  }

  const error = validate(section, body?.value);
  if (error) return NextResponse.json({ error }, { status: 400 });

  if (JSON.stringify(body?.value).length > 200_000) {
    return NextResponse.json({ error: "That's too much content to save at once." }, { status: 413 });
  }

  await saveSection(section, body!.value);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}

function validate(section: EditableSection, value: unknown): string | null {
  if (section === "profile") {
    if (!value || typeof value !== "object" || Array.isArray(value)) return "Profile must be an object.";
    const p = value as Record<string, unknown>;
    if (typeof p.name !== "string" || !p.name.trim()) return "Name is required.";
    if (typeof p.photo === "string" && p.photo && !isSafeUrl(p.photo)) return "Photo must be an https:// link or a /brand/... path.";
    const socials = (p.socials ?? {}) as Record<string, unknown>;
    for (const [k, v] of Object.entries(socials)) {
      if (typeof v === "string" && v && !/^https:\/\//i.test(v)) return `The ${k} link must start with https://`;
    }
    return null;
  }
  if (!Array.isArray(value)) return "Expected a list.";
  for (const item of value) {
    if (!item || typeof item !== "object") return "Every item must be an object.";
    const it = item as Record<string, unknown>;
    if (typeof it.title !== "string" || !it.title.trim()) return "Every item needs a title.";
    for (const key of ["image", "url"] as const) {
      if (key in it && typeof it[key] === "string" && it[key] && !isSafeUrl(it[key] as string)) {
        return `"${it.title}" has an invalid ${key}. Use https:// links or /work/... paths.`;
      }
    }
    if (Array.isArray(it.images) && it.images.some((u) => typeof u !== "string" || !isSafeUrl(u))) {
      return `"${it.title}" has an invalid image link.`;
    }
  }
  return null;
}

/** Only allow https links and local paths (blocks javascript: and data: URLs). */
function isSafeUrl(u: string): boolean {
  return u.startsWith("/") ? !u.startsWith("//") : /^https:\/\//i.test(u);
}
