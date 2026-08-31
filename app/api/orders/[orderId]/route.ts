import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDB();
    const { orderId } = await params;
    const order = await Order.findOne({ orderId }).lean();
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ order });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// User can only cancel their own pending/confirmed orders
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDB();
    const { orderId } = await params;
    const body = await req.json();
    const { status } = body;

    // Users can only cancel
    if (status !== "cancelled") {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    const order = await Order.findOne({ orderId });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Only allow cancel if pending or confirmed
    if (!["pending", "confirmed"].includes(order.status)) {
      return NextResponse.json(
        { error: `Cannot cancel order with status: ${order.status}` },
        { status: 400 }
      );
    }

    order.status = "cancelled";
    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
