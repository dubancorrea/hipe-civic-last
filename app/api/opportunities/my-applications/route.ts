import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Application from "@/models/Application";

export async function GET() {
  const session: any = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await dbConnect();
  const apps = await Application.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({
    applications: apps.map((a: any) => ({
      id: String(a._id),
      opportunityId: a.opportunityId,
      opportunityTitle: a.opportunityTitle,
      status: a.status,
      hoursLogged: a.hoursLogged,
      motivation: a.motivation,
      createdAt: a.createdAt,
    })),
  });
}
