import { NextResponse } from "next/server";
import { createHash } from "crypto";

export const runtime = "nodejs";

// Returns a short-lived signature so the browser can upload one image straight to Cloudinary.
// The API secret never leaves the server.
export async function POST() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Image uploads aren't set up. Add the CLOUDINARY_* environment variables." },
      { status: 503 },
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "dynatech-labs";
  // Cloudinary signature: sha1 of the sorted params + secret
  const toSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = createHash("sha1").update(toSign + apiSecret).digest("hex");

  return NextResponse.json({ cloudName, apiKey, timestamp, folder, signature });
}
