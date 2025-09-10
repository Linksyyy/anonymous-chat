import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUser } from "../../../db/queries";

//const tokenKey = "auth-token";

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

  if (!user || user.length === 0)
    return NextResponse.json(
      { message: "This user doesn't exist" },
      { status: 401 }
    );

  if (await bcrypt.compare(password, user[0].password_hash)) {
    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );
    //response.cookies.set(tokenKey, "a", { httpOnly: true });

    return response;
  } else {
    return NextResponse.json({ message: "Invalid password" }, { status: 401 });
  }
}
