import { NextRequest, NextResponse } from "next/server";
import { findUser, registerUser } from "../../../db/queries";
import bcrypt from "bcryptjs";

const saltRounds = 10;

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

  if (user)
    return NextResponse.json(
      { message: "This user already exist" },
      { status: 401 }
    );

  if (password.length < 8) {
    return NextResponse.json(
      { message: "Minimun password length is 8" },
      { status: 401 }
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(username, hashedPassword)
    await registerUser(username, hashedPassword);
    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } catch (e) {
    console.error(e);
  }
}
