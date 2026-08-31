import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { generateOrderId } from "@/lib/utils";
import { uploadToBackblaze } from "@/lib/backblaze";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

// GET /api/orders?userId=xxx
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }
    const orders = await Order.find({ userId })
      .select("orderId totalAmount status createdAt items")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ orders });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Helper to upload a base64 dataURL to B2, or return null if failed
async function uploadBase64ToB2(dataUrl: string, key: string): Promise<string | null> {
  try {
    const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!matches) return null;
    const contentType = matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    return await uploadToBackblaze(buffer, key, contentType);
  } catch (err) {
    console.warn(`B2 upload failed for ${key}, preserving in database:`, (err as Error).message);
    return null;
  }
}

// POST /api/orders
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId, userEmail, userName, items, totalAmount, shippingAddress } = body;

    if (!userId || !userEmail || !items?.length || !totalAmount || !shippingAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const orderId = generateOrderId();

    // Process both custom photo and final canvas design for all items
    const processedItems = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items.map(async (item: any, idx: number) => {
        let customImageUrl = item.customImageUrl || "";
        let finalImageUrl = item.finalImageUrl || "";

        // 1. Process Customer's Original Photo
        if (customImageUrl.startsWith("data:")) {
          const ext = customImageUrl.includes("image/png") ? "png" : "jpg";
          const key = `customer-uploads/${orderId}-item${idx + 1}-photo-${uuidv4()}.${ext}`;
          const b2Url = await uploadBase64ToB2(customImageUrl, key);
          if (b2Url) {
            customImageUrl = b2Url;
          }
          // If B2 fails, customImageUrl remains the base64 string, safely stored in MongoDB!
        }

        // 2. Process Sublimation Final Composite Design
        if (finalImageUrl.startsWith("data:")) {
          const key = `final-designs/${orderId}-item${idx + 1}-canvas-${uuidv4()}.png`;
          const b2Url = await uploadBase64ToB2(finalImageUrl, key);
          if (b2Url) {
            finalImageUrl = b2Url;
          }
          // If B2 fails, finalImageUrl remains the base64 string, safely stored in MongoDB!
        }

        return {
          ...item,
          customImageUrl,
          finalImageUrl,
        };
      })
    );

    const order = await Order.create({
      orderId,
      userId,
      userEmail,
      userName,
      items: processedItems,
      totalAmount,
      shippingAddress,
      status: "pending",
      paymentStatus: "pending",
    });

    return NextResponse.json({ orderId: order.orderId, order }, { status: 201 });
  } catch (err) {
    console.error("Order creation failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
