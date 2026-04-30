import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Application from "@/models/Application";

// 1. Notice the 'NextRequest' type and the 'Promise' for params
export async function PATCH(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const session: any = await getServerSession(authOptions);
  
  // 2. You MUST await params before destructuring 'id'
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

    // 3. Use the awaited 'id' in your Mongoose query
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