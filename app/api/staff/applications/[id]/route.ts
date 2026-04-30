import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Application from "@/models/Application";

/**
 * PATCH handler for updating student applications.
 * Next.js 16 requires 'params' to be treated as a Promise.
 */
export async function PATCH(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Await the params to extract the ID (Required for Next.js 16)
  const { id } = await params;

  // 2. Check authentication and staff role
  const session: any = await getServerSession(authOptions);
  
  if (!session?.user || (session.user as any).role !== "staff") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { status } = await req.json();
    
    // 3. Validate the status update
    const validStatuses = ["accepted", "declined", "completed", "pending"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await dbConnect();

    // 4. Update the application in MongoDB
    // Using 'any' casting to bypass Mongoose model initialization issues
    const updated = await (Application as any).findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}