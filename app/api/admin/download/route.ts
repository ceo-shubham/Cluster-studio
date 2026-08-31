import { NextRequest, NextResponse } from "next/server";
import { s3, BUCKET } from "@/lib/backblaze";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function verifyAdmin(req: NextRequest): boolean {
  const token = req.headers.get("x-admin-key") || req.nextUrl.searchParams.get("token");
  return token === (process.env.ADMIN_TOKEN || "cs-admin-token-2024");
}

// Extract B2 key from full URL: https://<bucket>.<endpoint>/<key>
function extractB2Key(url: string): string | null {
  try {
    const parsed = new URL(url);
    const bucketName = process.env.B2_BUCKET_NAME || "";
    if (bucketName && parsed.hostname.startsWith(bucketName)) {
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

  const orderId = req.nextUrl.searchParams.get("orderId");
  const itemIndex = parseInt(req.nextUrl.searchParams.get("itemIndex") || "0", 10);
  const type = req.nextUrl.searchParams.get("type"); // "original" or "final"
  let url = req.nextUrl.searchParams.get("url") || "";
  let filename = req.nextUrl.searchParams.get("filename") || "";

  try {
    // If orderId is provided, look up the image directly from the database
    if (orderId && type) {
      await connectDB();
      const order = await Order.findOne({ orderId }).lean();
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      const item = order.items?.[itemIndex] || order.items?.[0];
      if (!item) {
        return NextResponse.json({ error: "Order item not found" }, { status: 404 });
      }

      if (type === "original") {
        url = item.customImageUrl || "";
        if (!filename) filename = `${orderId}-original-photo.jpg`;
      } else {
        url = item.finalImageUrl || "";
        if (!filename) filename = `${orderId}-final-design.png`;
      }
    }

    if (!url) {
      return NextResponse.json({ error: "No image found for this item" }, { status: 404 });
    }

    if (!filename) {
      filename = "cluster-studio-asset.png";
    }

    // Case 1: base64 dataURL (Stored directly in MongoDB or fallback)
    if (url.startsWith("data:")) {
      const matches = url.match(/^data:(.+);base64,(.+)$/);
      if (!matches) throw new Error("Invalid base64 data");
      const contentType = matches[1];
      const buffer = Buffer.from(matches[2], "base64");
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "no-cache",
        },
      });
    }

    // Case 2: B2 URL — fetch via S3 SDK
    const b2Key = extractB2Key(url);
    if (b2Key) {
      try {
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
            "Cache-Control": "no-cache",
          },
        });
      } catch (s3Err) {
        console.warn("S3 GetObject failed, falling back to direct fetch:", (s3Err as Error).message);
      }
    }

    // Case 3: Public web URL
    const imageRes = await fetch(url);
    if (!imageRes.ok) throw new Error(`HTTP ${imageRes.status}`);
    const buffer = await imageRes.arrayBuffer();
    return new NextResponse(Buffer.from(buffer), {
      headers: {
        "Content-Type": imageRes.headers.get("content-type") || "image/jpeg",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache",
      },
    });

  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}

