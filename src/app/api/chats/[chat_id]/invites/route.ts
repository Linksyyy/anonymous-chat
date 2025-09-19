import { NextRequest, NextResponse } from "next/server";
import { createInvite } from "../../../../../db/queries";

export async function POST(
  req: NextRequest,
  { params }: { params: { chat_id: string } }
) {
  const data = await req.json();
  const chat_id = await params.chat_id;
  const sender_id = req.headers.get("x-user-id");
  const receiver_id = data.receiver_id;
  const type = data.type;

  createInvite(sender_id, receiver_id, chat_id, type);

  return NextResponse.json(
    { message: "Invite created sucessfully" },
    { status: 200 }
  );
}
