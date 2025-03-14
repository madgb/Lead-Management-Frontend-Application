import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const SECRET_KEY = "supersecuresecret";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== "admin123") {
    return NextResponse.json({ message: "Invalid password" }, { status: 401 });
  }

  const token = jwt.sign({ role: "admin" }, SECRET_KEY, { expiresIn: "1h" });

  const response = NextResponse.json({ message: "Login successful" });
  response.headers.set("Set-Cookie", serialize("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  }));

  return response;
}
