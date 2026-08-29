import { NextRequest, NextResponse } from "next/server";
import { s3, BUCKET } from "@/lib/backblaze";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export const runtime = "nodejs";

function verifyAdmin(req: NextRequest): boolean {
  const token = req.headers.get("x-admin-key");
  return token === (process.env.ADMIN_TOKEN || "cs-admin-token-2024");
}

// Extract B2 key from full URL: https://<bucket>.<endpoint>/<key>
function extractB2Key(url: string): string | null {
  try {
    const parsed = new URL(url);
    const bucketName = process.env.B2_BUCKET_NAME || "";
    // Check if this URL belongs to our B2 bucket
    if (parsed.hostname.startsWith(bucketName)) {
      return parsed.pathname.replace(/^\//, "");
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.searchParams.get("url");
  const filename = req.nextUrl.searchParams.get("filename") || "cluster-studio-design.png";

  if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 });

  try {
    // Case 1: base64 dataURL (old orders where final design wasn't uploaded to B2)
    if (url.startsWith("data:")) {
      const matches = url.match(/^data:(.+);base64,(.+)$/);
      if (!matches) throw new Error("Invalid base64 data");
      const contentType = matches[1];
      const buffer = Buffer.from(matches[2], "base64");
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    // Case 2: B2 URL — fetch via S3 SDK (works for private buckets)
    const b2Key = extractB2Key(url);
    if (b2Key) {
      const command = new GetObjectCommand({ Bucket: BUCKET, Key: b2Key });
      const s3Res = await s3.send(command);
      const chunks: Uint8Array[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for await (const chunk of s3Res.Body as any) chunks.push(chunk);
      const buffer = Buffer.concat(chunks);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": s3Res.ContentType || "image/jpeg",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    // Case 3: fallback direct fetch (public URLs)
    const imageRes = await fetch(url);
    if (!imageRes.ok) throw new Error(`HTTP ${imageRes.status}`);
    const buffer = await imageRes.arrayBuffer();
    return new NextResponse(Buffer.from(buffer), {
      headers: {
        "Content-Type": imageRes.headers.get("content-type") || "image/jpeg",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });

  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
