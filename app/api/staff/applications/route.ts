import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Application from "@/models/Application";

export async function GET() {
  const session: any = await getServerSession(authOptions);
  
  // 1. Verify user is authenticated and has the "staff" role
  if (!session?.user || (session.user as any).role !== "staff")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await dbConnect();

  // 2. Cast Application to 'any' to fix the ".find is not callable" error
  // This allows staff to see all submissions for civic engagement opportunities
  const apps = await (Application as any)
    .find({})
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    applications: apps.map((a: any) => ({
      id: String(a._id),
      userId: a.userId,
      userEmail: a.userEmail,
      userName: a.userName,
      opportunityId: a.opportunityId,
      opportunityTitle: a.opportunityTitle,
      motivation: a.motivation,
      status: a.status,
      hoursLogged: a.hoursLogged,
      createdAt: a.createdAt,
    })),
  });
}