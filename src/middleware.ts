import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, importSPKI } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  const publicKeyPem = req.cookies.get("public-key")?.value;

  if (!token || !publicKeyPem) {
    return NextResponse.json(
      { message: "Missing token or public key" },
      { status: 401 }
    );
  }

  try {
    const publicKey = await importSPKI(publicKeyPem, "RS256");
    await jwtVerify(token, publicKey); //if expired this fuction will throw an error
    return NextResponse.next();
  } catch (err) {
    console.error("Token verification failed", err);
    return NextResponse.json(
      { message: "Token verification failed" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/lounge/:path*"],
};
