import { NextResponse } from "next/server";

export async function POST(req) {
  const data = await req.json();
  if (data.username.trim() === "")
    return NextResponse.json(
      { message: "Username isn't defined" },
      { status: 400 }
    );
  if (data.password.trim() === "")
    return NextResponse.json(
      { message: "password isn't defined" },
      { status: 400 }
    );

  return NextResponse.json({ message: "Login successful" }, { status: 200 });
}
