import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@clusterstudio.in";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "clusteradmin00studio";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "cs-admin-token-2024";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ token: ADMIN_TOKEN, message: "Login successful" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
