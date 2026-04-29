import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Application from "@/models/Application";
import Opportunity from "@/models/Opportunity";
import { SEED_OPPORTUNITIES } from "@/lib/opportunities";

export async function POST(req: Request) {
  const session: any = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { opportunityId, motivation } = await req.json();
  if (!opportunityId)
    return NextResponse.json({ error: "opportunityId required" }, { status: 400 });

  await dbConnect();

  // Find title from seed first, then DB
  let title = SEED_OPPORTUNITIES.find((s) => s.id === opportunityId)?.title;
  if (!title) {
    const opp = await Opportunity.findById(opportunityId).lean();
    if (opp) title = (opp as any).title;
  }
  if (!title) return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });

  const existing = await Application.findOne({ userId: session.user.id, opportunityId });
  if (existing)
    return NextResponse.json({ error: "Already applied" }, { status: 409 });

  const app = await Application.create({
    userId: session.user.id,
    userEmail: session.user.email,
    userName: session.user.name,
    opportunityId,
    opportunityTitle: title,
    motivation: motivation || "",
  });
  return NextResponse.json({ ok: true, applicationId: String(app._id) });
}
