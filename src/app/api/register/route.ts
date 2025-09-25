import { NextRequest, NextResponse } from "next/server";
import { findUserByUsername, registerUser } from "../../../db/queries";
import bcrypt from "bcryptjs";

const saltRounds = 10;

export async function POST(req: NextRequest) {
  const data = await req.json();
  const username = data.username.trim().toLowerCase();
  const preHashedpassword = data.preHashedpassword.trim();
  const ee_salt = data.ee_salt;
  const pubKey = data.pubKey;
  const privKey = data.privKey;

  if (username === "" || preHashedpassword === "")
    return NextResponse.json(
      { message: "Username and password must be defined" },
      { status: 422 }
    );

  const user = await findUserByUsername(username);

  if (user)
    return NextResponse.json(
      { message: "This user already exist" },
      { status: 401 }
    );

  if (preHashedpassword.length < 8) {
    return NextResponse.json(
      { message: "Minimun password length is 8" },
      { status: 401 }
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(preHashedpassword, saltRounds);

    await registerUser(username, hashedPassword, ee_salt, pubKey, privKey);
    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } catch (e) {
    console.error(e);
  }
}
