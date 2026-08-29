import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

function verifyAdmin(req: NextRequest): boolean {
  const token = req.headers.get("x-admin-key");
  return token === (process.env.ADMIN_TOKEN || "cs-admin-token-2024");
}

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ orders });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
