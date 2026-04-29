import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import RSVP from "@/models/RSVP";

export async function GET() {
  const session: any = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await dbConnect();
  const items = await RSVP.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({
    rsvps: items.map((r: any) => ({
      id: String(r._id),
      eventId: r.eventId,
      eventTitle: r.eventTitle,
      eventDate: r.eventDate,
      createdAt: r.createdAt,
    })),
  });
}

export async function POST(req: Request) {
  const session: any = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { eventId, eventTitle, eventDate } = await req.json();
  if (!eventId || !eventTitle)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  await dbConnect();
  try {
    const r = await RSVP.create({
      userId: session.user.id,
      userEmail: session.user.email,
      eventId,
      eventTitle,
      eventDate: eventDate || "",
    });
    return NextResponse.json({ ok: true, rsvpId: String(r._id) });
  } catch (e: any) {
    if (e.code === 11000) return NextResponse.json({ error: "Already RSVP'd" }, { status: 409 });
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
