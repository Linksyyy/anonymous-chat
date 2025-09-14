import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const publicRoutes = ["/", "/login", "/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth-token")?.value;

  let isAuth = false;
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      isAuth = true;
    } catch (error) {
      isAuth = false;
    }
  }

  if (isAuth) {
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/lounge", req.url));
    }
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.includes(pathname);
  if (!isPublicRoute) {
    const loginUrl = new URL("/login", req.url);
    if (token) {
      loginUrl.searchParams.set("error", "token_expired");
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}