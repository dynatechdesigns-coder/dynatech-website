import { getDb, hasDatabase } from "./db";
import { seed } from "./seed";
import type { EditableSection, SiteContent } from "./types";

const DOC_ID = "site";

type ContentDoc = Partial<SiteContent> & { _id: string; updatedAt?: Date };

/** Content for the public site. Falls back to the starter content if the DB is missing or unreachable. */
export async function getContent(): Promise<SiteContent> {
  if (!hasDatabase()) return seed;
  try {
    const db = await getDb();
    const doc = await db.collection<ContentDoc>("content").findOne({ _id: DOC_ID });
    if (!doc) return seed;
    return {
      profile: { ...seed.profile, ...(doc.profile ?? {}) },
      projects: doc.projects ?? seed.projects,
      designs: doc.designs ?? seed.designs,
      photos: doc.photos ?? seed.photos,
      services: doc.services ?? seed.services,
    };
  } catch (err) {
    console.error("getContent: falling back to seed content", err);
    return seed;
  }
}

export async function saveSection(section: EditableSection, value: unknown): Promise<void> {
  const db = await getDb();
  await db
    .collection<ContentDoc>("content")
    .updateOne({ _id: DOC_ID }, { $set: { [section]: value, updatedAt: new Date() } }, { upsert: true });
}
