import { NextRequest, NextResponse } from "next/server";
import { findMessagesOfChat } from "../../../../../db/queries";

const MESSAGE_OFFSET = 50;

export async function GET(req: NextRequest, { params }) {
  const chatId = (await params).chat_id;
  const page = parseInt(req.nextUrl.searchParams.get("page"));

  const offset = (page - 1) * MESSAGE_OFFSET;
  try {
    const result = await findMessagesOfChat(chatId, MESSAGE_OFFSET, offset);

    return NextResponse.json({ result }, { status: 200 });
  } catch (e) {
    console.error("Failed to fetch messages:", e);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
