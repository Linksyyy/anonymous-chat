import { NextResponse, NextRequest } from "next/server";
import { createChat, createParticipant } from "../../../db/queries";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { creatorId, title } = data;

  if (!creatorId) {
    return NextResponse.json({ message: "Missing users ids" }, { status: 400 });
  }
  if (title.trim() === "") {
    return NextResponse.json(
      { message: "Missing the title field" },
      { status: 400 }
    );
  }

  const [chatCreated] = await createChat(title);
  await createParticipant(creatorId, chatCreated.id);

  return NextResponse.json(
    {
      message: "Created sucessful",
      chat: chatCreated,
    },
    { status: 200 }
  );
}
