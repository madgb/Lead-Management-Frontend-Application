import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
    const response = NextResponse.json({ message: "Logged out successfully" });

    response.headers.set(
        "Set-Cookie",
        serialize("authToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            expires: new Date(0),
        })
    );

    return response;
}
