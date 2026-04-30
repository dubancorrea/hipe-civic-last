import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";
import { Model } from "mongoose";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    await dbConnect();

    // 1. Cast User to any or Model to fix the "not callable" error
    const user = await (User as any).findOne({ email: email.toLowerCase() });

    // Always respond ok to avoid email enumeration (security best practice)
    if (!user) return NextResponse.json({ ok: true });

    // 2. Generate a secure random token
    const rawToken = crypto.randomBytes(32).toString("hex");
    
    // 3. Hash it before saving (like a password) for security
    const tokenHash = await bcrypt.hash(rawToken, 10);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 min expiry

    // 4. Cast PasswordResetToken to any to fix the "not callable" error
    await (PasswordResetToken as any).create({
      userId: String(user._id),
      email: user.email,
      tokenHash,
      expiresAt,
    });

    // 5. Construct the reset URL
    const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${base}/reset-password?token=${rawToken}&uid=${user._id}`;

    // Note: For your MVP, we return the URL so you can test it in the console/network tab.
    // In production, you'd use a service like Resend or SendGrid to email this link.
    return NextResponse.json({ ok: true, resetUrl });
    
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}