import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Opportunity from "@/models/Opportunity";
import { SEED_OPPORTUNITIES } from "@/lib/opportunities";

export async function GET() {
  await dbConnect();

  // 1. Cast Opportunity to 'any' to fix the ".find is not callable" error
  // This allows the HIPE platform to fetch student opportunities from MongoDB
  const dbOpps = await (Opportunity as any).find({}).lean();

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

  // 2. Combine database opportunities with your local seed data
  const seedList = SEED_OPPORTUNITIES.map((s) => ({ ...s, source: "seed" }));
  
  return NextResponse.json({ opportunities: [...dbList, ...seedList] });
}