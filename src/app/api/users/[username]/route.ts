import { NextRequest, NextResponse } from "next/server";
import { findUser } from "../../../../db/queries";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const username = (await params).username.trim();
  const user = await findUser(username);
  if (!user) {
    return NextResponse.json(
      { message: "This user doesn't exist" },
      { status: 401 }
    );
  }
  return NextResponse.json(
    { id: user.id, username: user.username },
    { status: 200 }
  );
}
