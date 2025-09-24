import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const response = NextResponse.json(
    { message: "logout sucessful" },
    { status: 200 }
  );
  response.cookies.set("auth-token", "", {
    expires: new Date(0),
    path: "/",
  });
  return response;
}
