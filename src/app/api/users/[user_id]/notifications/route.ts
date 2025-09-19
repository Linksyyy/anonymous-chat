import { NextRequest, NextResponse } from "next/server";
import { findNotificationsOfuser } from "../../../../../db/queries";

export async function GET(
  req: NextRequest,
  { params }: { params: { user_id: string } }
) {
  const res = await findNotificationsOfuser((await params).user_id);
  return NextResponse.json({ notifications: res });
}
