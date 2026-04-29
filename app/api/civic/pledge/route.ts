import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Pledge from "@/models/Pledge";

export async function GET() {
  const session: any = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await dbConnect();
  const pledges = await Pledge.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();
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
  const session: any = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { type, campaign, note } = await req.json();
  if (!type || !["vote", "campaign"].includes(type))
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  await dbConnect();
  const p = await Pledge.create({
    userId: session.user.id,
    userEmail: session.user.email,
    type,
    campaign: campaign || "",
    note: note || "",
  });
  return NextResponse.json({ ok: true, pledgeId: String(p._id) });
}
