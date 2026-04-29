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
    const records = await PasswordResetToken.find({
      userId: uid,
      usedAt: null,
      expiresAt: { $gt: new Date() },
    });
    let match: any = null;
    for (const r of records) {
      if (await bcrypt.compare(token, r.tokenHash)) {
        match = r;
        break;
      }
    }
    if (!match) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

    const hash = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(uid, { password: hash });
    match.usedAt = new Date();
    await match.save();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
