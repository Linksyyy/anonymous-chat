import { NextRequest, NextResponse } from "next/server";
import { findUser } from "../../../db/queries";

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
  
    if (user.length !== 0)
      return NextResponse.json(
        { message: "This user already exist" },
        { status: 401 }
      );
}
