import { NextRequest, NextResponse } from "next/server";
import { uploadToBackblaze } from "@/lib/backblaze";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `uploads/${uuidv4()}.${ext}`;

    // Try Backblaze B2 upload first
    try {
      const url = await uploadToBackblaze(buffer, fileName, file.type);
      return NextResponse.json({ url, fileName, storage: "b2" });
    } catch (b2Err) {
      console.warn("B2 upload unavailable, falling back to database storage:", (b2Err as Error).message);
      const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
      return NextResponse.json({ url: dataUri, fileName, storage: "db" });
    }
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

