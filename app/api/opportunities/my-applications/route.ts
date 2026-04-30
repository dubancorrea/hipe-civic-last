import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Application from "@/models/Application";

export async function GET() {
  const session: any = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  // 1. Cast Application to 'any' to fix the ".find is not callable" error
  const apps = await (Application as any)
    .find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

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