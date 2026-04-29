import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Application from "@/models/Application";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session: any = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "staff")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { status } = await req.json();
  if (!["accepted", "declined", "completed", "pending"].includes(status))
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  await dbConnect();
  const updated = await Application.findByIdAndUpdate(params.id, { status }, { new: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
