import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Application from "@/models/Application";

// Update: Ensure the first argument is 'NextRequest' and 'params' is a Promise
export async function PATCH(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const session: any = await getServerSession(authOptions);
  
  // Update: Await the params before using the 'id'
  const { id } = await params;

  if (!session?.user || (session.user as any).role !== "staff") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { status } = await req.json();
    
    if (!["accepted", "declined", "completed", "pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await dbConnect();

    // Use the awaited 'id' here
    const updated = await (Application as any).findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}