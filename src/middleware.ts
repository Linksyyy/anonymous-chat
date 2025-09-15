import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";

const publicRoutes = ["/", "/login", "/register", "/api/login"];

async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth-token")?.value;
  console.log(pathname);

  // --- API Route Protection ---
  if (!publicRoutes.includes(pathname)) {
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // --- Page Route Protection ---
  const isAuth = token ? (await verifyToken(token)) !== null : false;

  if (isAuth) {
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL("/lounge", req.url));
    }
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.includes(pathname);
  if (!isPublicRoute) {
    const loginUrl = new URL("/login", req.url);
    if (token) {
      // If there was a token but it was invalid
      loginUrl.searchParams.set("error", "token_expired");
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude only static assets, run on all pages and API routes
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
