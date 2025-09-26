import { NextRequest, NextResponse } from "next/server";
import { findUserByUsername } from "../../../../db/queries";

export async function GET(req: NextRequest, { params }) {
  const username = (await params).username;

  const result = await findUserByUsername(username);
  return NextResponse.json({ result });
}
