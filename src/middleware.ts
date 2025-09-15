import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";

async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/api/login",
  "/api/register",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth-token")?.value;

  const payload = token ? await verifyToken(token) : null;
  const isAuth = !!payload;

  if (isAuth) {
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL("/lounge", req.url));
    }
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.includes(pathname);

  if (!isPublicRoute) {
    const isApiRoute = pathname.startsWith("/api");
    if (isApiRoute) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    } else {
      const loginUrl = new URL("/login", req.url);
      if (token) {
        loginUrl.searchParams.set("error", "token_expired");
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude only static assets, run on all pages and API routes.
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
