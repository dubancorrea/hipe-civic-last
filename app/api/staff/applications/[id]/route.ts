import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Application from "@/models/Application";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session: any = await getServerSession(authOptions);
  
  // 1. Verify user is authenticated and has the "staff" role
  if (!session?.user || (session.user as any).role !== "staff")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { status } = await req.json();
  
  // 2. Validate the status update
  if (!["accepted", "declined", "completed", "pending"].includes(status))
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  await dbConnect();

  // 3. Cast Application to 'any' to fix the ".findByIdAndUpdate is not callable" error
  const updated = await (Application as any).findByIdAndUpdate(
    params.id, 
    { status }, 
    { new: true }
  );

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  
  return NextResponse.json({ ok: true });
}