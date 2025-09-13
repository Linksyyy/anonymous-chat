import { NextRequest, NextResponse } from "next/server";
import { findUser } from "../../../../db/queries";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const username = params.username.trim();
  const user = await findUser(username);
  return NextResponse.json(
    { id: user.id, username: user.username },
    { status: 200 }
  );
}
