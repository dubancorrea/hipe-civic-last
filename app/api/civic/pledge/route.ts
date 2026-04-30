import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Pledge from "@/models/Pledge";

export async function GET() {
  // 1. Authenticate the session
  const session: any = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  // 2. Cast Pledge to 'any' to fix the ".find is not callable" error
  const pledges = await (Pledge as any)
    .find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    pledges: pledges.map((p: any) => ({
      id: String(p._id),
      type: p.type,
      campaign: p.campaign,
      note: p.note,
      createdAt: p.createdAt,
    })),
  });
}

export async function POST(req: Request) {
  // 1. Authenticate the session
  const session: any = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type, campaign, note } = await req.json();

  // 2. Validate input for civic engagement types
  if (!type || !["vote", "campaign"].includes(type))
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  await dbConnect();

  // 3. Cast Pledge to 'any' to fix the ".create is not callable" error
  const p = await (Pledge as any).create({
    userId: session.user.id,
    userEmail: session.user.email,
    type,
    campaign: campaign || "",
    note: note || "",
  });

  return NextResponse.json({ ok: true, pledgeId: String(p._id) });
}