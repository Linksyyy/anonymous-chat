import { NextRequest, NextResponse } from "next/server";
import { findUser } from "../../../../db/queries";

export async function GET(req: NextRequest, { params }) {
  const user_id = (await params).user_id.trim();
  const user = await findUser(user_id);
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
