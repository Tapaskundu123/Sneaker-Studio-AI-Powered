// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import {connectDB} from '../../../../lib/dbConnect';
import { User } from "@/models/user.model";
import { hashPassword } from "@/lib/bcrypt";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already taken" },
        { status: 409 }
      );
    }

    const hashed = await hashPassword(password);
    const user = await User.create({ name, email, password: hashed });

    const token = await signToken({ userId: user._id.toString() });

    const res = NextResponse.json(
      { ok: true, userId: user._id.toString() },
      { status: 201 }
    );

    // HttpOnly, Secure, SameSite=Strict
    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    await user.save();
    
    return res;
  } catch (e: any) {
    console.error("[REGISTER]", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}