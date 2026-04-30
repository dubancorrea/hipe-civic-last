import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";

export async function POST(req: Request) {
  try {
    const { uid, token, password } = await req.json();
    if (!uid || !token || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await dbConnect();

    // 1. Cast PasswordResetToken to 'any' to fix the ".find is not callable" error
    const records = await (PasswordResetToken as any).find({
      userId: uid,
      usedAt: null,
      expiresAt: { $gt: new Date() },
    });

    let match: any = null;
    for (const r of records) {
      // Compare the raw token from the URL with the hashed token in the DB
      if (await bcrypt.compare(token, r.tokenHash)) {
        match = r;
        break;
      }
    }

    if (!match) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // 2. Hash the new password before saving
    const hash = await bcrypt.hash(password, 10);

    // 3. Cast User to 'any' to fix the ".findByIdAndUpdate is not callable" error
    await (User as any).findByIdAndUpdate(uid, { password: hash });

    // 4. Mark the token as used so it can't be used again
    match.usedAt = new Date();
    await match.save();

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}