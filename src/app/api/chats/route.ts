import { NextResponse, NextRequest } from "next/server";
import { createChat, createParticipant } from "../../../db/queries";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { participantsIds } = data;

  if (!participantsIds) {
    return NextResponse.json({ message: "Missing users ids" }, { status: 400 });
  }
  const validIds = participantsIds.filter((el) => el);
  if (validIds.length !== participantsIds.length) {
    return NextResponse.json(
      {
        message:
          "Error ocurred to validate your user data, please try login again",
      },
      { status: 400 }
    );
  }

  const [chatCreated] = await createChat();
  const participantsCreated = participantsIds.map(async (id: string) => {
    return await createParticipant(id, chatCreated.id)[0];
  });

  return NextResponse.json(
    {
      message: "Created sucessful",
      participants: participantsCreated,
      chat: chatCreated,
    },
    { status: 200 }
  );
}
