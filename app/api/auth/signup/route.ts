import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role, school, major } = body;

    // 1. Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." }, 
        { status: 400 }
      );
    }

    // 2. Database Connection
    await dbConnect();

    // 3. Check if user already exists (normalized email)
    const normalizedEmail = email.toLowerCase();
    const exists = await User.findOne({ email: normalizedEmail });
    
    if (exists) {
      return NextResponse.json(
        { error: "This email is already registered. Please log in instead." }, 
        { status: 409 }
      );
    }

    // 4. Hash password (Security step)
    // Using 12 salt rounds is the current industry standard for better security
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Create User
    // We explicitly map the fields to match your HIPE student/staff requirements
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: role === "staff" ? "staff" : "student",
      school: school || "CUNY Brooklyn College", // Defaulting to your campus
      major: major || "Undeclared",
      createdAt: new Date(),
    });

    // 6. Response
    // Do NOT return the password hash in the response
    return NextResponse.json({
      message: "Account created successfully!",
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error("SIGNUP_ERROR:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." }, 
      { status: 500 }
    );
  }
}