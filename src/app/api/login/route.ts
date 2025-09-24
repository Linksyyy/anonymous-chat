import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByUsername } from "../../../db/queries";
import { SignJWT } from "jose";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const username = data.username.trim().toLowerCase();
  const preHashedpassword = data.preHashedpassword.trim();

  if (username === "" || preHashedpassword === "")
    return NextResponse.json(
      { message: "Username and password must be defined" },
      { status: 422 }
    );

  const user = await findUserByUsername(username);

  if (!user)
    return NextResponse.json(
      { message: "This user doesn't exist" },
      { status: 401 }
    );

  if (!(await bcrypt.compare(preHashedpassword, user.password_hash)))
    return NextResponse.json({ message: "Invalid password" }, { status: 401 });

  const response = NextResponse.json(
    {
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        ee_salt: user.ee_salt,
        public_key: user.public_key,
        encrypted_private_key: user.encrypted_private_key,
      },
    },
    { status: 200 }
  );
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const JWTtoken = await new SignJWT({ userId: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30s")
    .sign(secret);

  response.cookies.set("auth-token", JWTtoken, {
    httpOnly: true,
    secure: true,
  });

  return response;
}
