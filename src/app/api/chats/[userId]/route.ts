import { NextRequest, NextResponse } from "next/server";
import { findParticipationsOfUser } from "../../../../db/queries";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ message: "Missing params" }, { status: 400 });
  }

  const querieResult = await findParticipationsOfUser(userId);

  return NextResponse.json({ result: querieResult }, { status: 200 });
}
