import { NextRequest, NextResponse } from "next/server";
import { createInvite } from "../../../../../db/queries";

export async function POST(
  req: NextRequest,
  { params }
) {
  const data = await req.json();
  const chat_id = params.chat_id;
  const sender_id = req.headers.get("x-user-id");
  const receiver_id = data.receiver_id;
  const type = data.type;
  const encrypted_group_key = data.encrypted_group_key

  createInvite(sender_id, receiver_id, chat_id, type, encrypted_group_key);

  return NextResponse.json(
    { message: "Invite created sucessfully" },
    { status: 200 }
  );
}
