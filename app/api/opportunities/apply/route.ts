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

  // 1. Find title from seed first, then DB
  let title = SEED_OPPORTUNITIES.find((s) => s.id === opportunityId)?.title;
  
  if (!title) {
    // Cast Opportunity to 'any' to fix the ".findById is not callable" error
    const opp = await (Opportunity as any).findById(opportunityId).lean();
    if (opp) title = (opp as any).title;
  }
  
  if (!title) return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });

  // 2. Cast Application to 'any' to fix the ".findOne is not callable" error
  const existing = await (Application as any).findOne({ 
    userId: session.user.id, 
    opportunityId 
  });

  if (existing)
    return NextResponse.json({ error: "Already applied" }, { status: 409 });

  // 3. Cast Application to 'any' to fix the ".create is not callable" error
  const app = await (Application as any).create({
    userId: session.user.id,
    userEmail: session.user.email,
    userName: session.user.name,
    opportunityId,
    opportunityTitle: title,
    motivation: motivation || "",
  });

  return NextResponse.json({ ok: true, applicationId: String(app._id) });
}