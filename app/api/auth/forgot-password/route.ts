import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
    await dbConnect();
    const user = await User.findOne({ email: email.toLowerCase() });
    // Always respond ok to avoid email enumeration
    if (!user) return NextResponse.json({ ok: true });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = await bcrypt.hash(rawToken, 10);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 min

    await PasswordResetToken.create({
      userId: String(user._id),
      email: user.email,
      tokenHash,
      expiresAt,
    });

    const base = process.env.NEXTAUTH_URL || "";
    const resetUrl = `${base}/reset-password?token=${rawToken}&uid=${user._id}`;
    // In production: email this. For MVP we return it (dev convenience).
    return NextResponse.json({ ok: true, resetUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
