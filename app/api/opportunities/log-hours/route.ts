import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Application from "@/models/Application";
import User from "@/models/User";

export async function POST(req: Request) {
  const session: any = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { applicationId, hours } = await req.json();
  const h = Number(hours);
  if (!applicationId || !h || h <= 0)
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  await dbConnect();

  // 1. Cast Application to 'any' to fix the ".findOne is not callable" error
  const app = await (Application as any).findOne({ _id: applicationId, userId: session.user.id });
  
  if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });
  
  // Ensure the volunteer opportunity is in a valid state for logging hours
  if (app.status !== "accepted" && app.status !== "completed")
    return NextResponse.json({ error: "Application not accepted yet" }, { status: 400 });

  // Update the individual application record
  app.hoursLogged += h;
  await app.save();

  // 2. Cast User to 'any' to fix the ".findByIdAndUpdate is not callable" error
  // This updates the total hours logged for the student profile
  await (User as any).findByIdAndUpdate(session.user.id, { $inc: { hoursLogged: h } });

  return NextResponse.json({ ok: true, hoursLogged: app.hoursLogged });
}