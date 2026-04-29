import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { name, email, password, role, school, major } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    await dbConnect();
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hash,
      role: role === "staff" ? "staff" : "student",
      school: school || "",
      major: major || "",
    });
    return NextResponse.json({
      ok: true,
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
