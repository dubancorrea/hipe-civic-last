import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Opportunity from "@/models/Opportunity";
import { SEED_OPPORTUNITIES } from "@/lib/opportunities";

export async function GET() {
  await dbConnect();
  const dbOpps = await Opportunity.find({}).lean();
  const dbList = dbOpps.map((o: any) => ({
    id: String(o._id),
    title: o.title,
    org: o.org,
    category: o.category,
    major: o.major,
    hours: o.hours,
    location: o.location,
    description: o.description,
    date: o.date,
    source: "db",
  }));
  const seedList = SEED_OPPORTUNITIES.map((s) => ({ ...s, source: "seed" }));
  return NextResponse.json({ opportunities: [...dbList, ...seedList] });
}
