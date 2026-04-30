import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db"; // Ensure this matches your lib structure
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await dbConnect();

    // 1. Cast User to 'any' to fix the "This expression is not callable" error
    // This allows TypeScript to recognize the .findOne method
    const existingUser = await (User as any).findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password for security before saving to your MongoDB collection
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 2. Cast User to 'any' here as well for the .create method
    const newUser = await (User as any).create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "student", // Defaults to student for your community platform
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: newUser._id }, 
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}