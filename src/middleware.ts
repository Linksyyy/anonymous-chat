import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Missing token" },
      { status: 401 }
    );
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    await jwtVerify(token, secret)//if expired this fuction will throw an error
    return NextResponse.next();
  } catch (err) {
    return NextResponse.json(
      { message: "Token verification failed" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/lounge/:path*"],
};
