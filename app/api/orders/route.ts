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

// Upload a base64 dataURL to B2 and return the stored URL
async function uploadBase64ToB2(dataUrl: string, key: string): Promise<string> {
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid base64 dataURL");
  const contentType = matches[1];
  const buffer = Buffer.from(matches[2], "base64");
  return uploadToBackblaze(buffer, key, contentType);
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

    // Upload any base64 finalImageUrls to B2 so admin can download them
    const processedItems = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items.map(async (item: any, idx: number) => {
        let finalImageUrl = item.finalImageUrl || "";

        // If it's a base64 dataURL — upload to B2
        if (finalImageUrl.startsWith("data:")) {
          try {
            const key = `final-designs/${orderId}-item${idx}-${uuidv4()}.png`;
            finalImageUrl = await uploadBase64ToB2(finalImageUrl, key);
          } catch (err) {
            console.error("Failed to upload final design to B2:", err);
            finalImageUrl = ""; // fallback — don't block the order
          }
        }

        return { ...item, finalImageUrl };
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
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
