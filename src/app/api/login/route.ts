import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUser } from "../../../db/queries";
import { SignJWT, generateKeyPair, exportSPKI } from "jose";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const username = data.username.trim();
  const password = data.password.trim();

  if (username === "" || password === "")
    return NextResponse.json(
      { message: "Username and password must be defined" },
      { status: 422 }
    );

  const user = await findUser(username);

  if (user === undefined)
    return NextResponse.json(
      { message: "This user doesn't exist" },
      { status: 401 }
    );

  if (!(await bcrypt.compare(password, user.password_hash)))
    return NextResponse.json({ message: "Invalid password" }, { status: 401 });

  const response = NextResponse.json(
    { message: "Login successful" },
    { status: 200 }
  );

  const { privateKey, publicKey } = await generateKeyPair("RS256");
  const JWTtoken = await new SignJWT({ userId: user.id })
    .setProtectedHeader({ alg: "RS256" })
    .setExpirationTime("7d")
    .sign(privateKey);

  response.cookies.set("auth-token", JWTtoken, {
    httpOnly: true,
    sameSite: true,
    secure: true,
  });

  const publicKeyPem = await exportSPKI(publicKey);

  response.cookies.set("public-key", publicKeyPem);

  return response;
}
