import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = "supersecuresecret";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("authToken")?.value;

    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return NextResponse.json({ message: "Authenticated", user: decoded });
    } catch {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
}
