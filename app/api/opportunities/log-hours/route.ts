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
  const app = await Application.findOne({ _id: applicationId, userId: session.user.id });
  if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });
  if (app.status !== "accepted" && app.status !== "completed")
    return NextResponse.json({ error: "Application not accepted yet" }, { status: 400 });

  app.hoursLogged += h;
  await app.save();
  await User.findByIdAndUpdate(session.user.id, { $inc: { hoursLogged: h } });
  return NextResponse.json({ ok: true, hoursLogged: app.hoursLogged });
}
