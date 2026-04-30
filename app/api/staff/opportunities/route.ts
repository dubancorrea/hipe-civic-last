import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Opportunity from "@/models/Opportunity";

// GET all opportunities for the HIPE platform
export async function GET() {
  await dbConnect();
  // 1. Cast Opportunity to 'any' to fix the ".find is not callable" error
  const opps = await (Opportunity as any).find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ opportunities: opps });
}

// POST a new opportunity (Staff only)
export async function POST(req: Request) {
  const session: any = await getServerSession(authOptions);
  
  // Verify staff role before allowing creation
  if (!session?.user || (session.user as any).role !== "staff") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data = await req.json();
  await dbConnect();

  try {
    // 2. Cast Opportunity to 'any' to fix the ".create is not callable" error
    const newOpp = await (Opportunity as any).create(data);
    return NextResponse.json({ ok: true, opportunity: newOpp });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}