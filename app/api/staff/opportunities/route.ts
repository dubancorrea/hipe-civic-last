import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Opportunity from "@/models/Opportunity";

function requireStaff(session: any) {
  return session?.user && (session.user as any).role === "staff";
}

export async function GET() {
  const session: any = await getServerSession(authOptions);
  if (!requireStaff(session))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await dbConnect();
  const opps = await Opportunity.find({ createdBy: session.user.id }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({
    opportunities: opps.map((o: any) => ({
      id: String(o._id),
      title: o.title,
      org: o.org,
      category: o.category,
      major: o.major,
      hours: o.hours,
      location: o.location,
      description: o.description,
      date: o.date,
    })),
  });
}

export async function POST(req: Request) {
  const session: any = await getServerSession(authOptions);
  if (!requireStaff(session))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const { title, org, category, major, hours, location, description, date } = body;
  if (!title || !org || !category)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  await dbConnect();
  const opp = await Opportunity.create({
    title,
    org,
    category,
    major: Array.isArray(major) ? major : String(major || "").split(",").map((x) => x.trim()).filter(Boolean),
    hours: Number(hours) || 1,
    location: location || "",
    description: description || "",
    date: date || "",
    createdBy: session.user.id,
  });
  return NextResponse.json({ ok: true, id: String(opp._id) });
}
