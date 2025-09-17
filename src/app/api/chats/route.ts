import { NextResponse, NextRequest } from "next/server";
import {
  createChat,
  createParticipant,
  findParticipationsOfUser,
} from "../../../db/queries";

export async function GET(req: NextRequest) {
  const authUserId = req.headers.get("x-user-id");
  const userIdParam = req.nextUrl.searchParams.get("userId");
  const targetUserId = userIdParam || authUserId;

  if (!targetUserId) {
    return NextResponse.json({ message: "User ID not found" }, { status: 401 });
  }

  try {
    const participations = await findParticipationsOfUser(targetUserId);
    return NextResponse.json({ result: participations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user participations:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const creatorId = req.headers.get("x-user-id");
  const data = await req.json();
  const { title } = data;

  if (!creatorId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (title) {
    if (title.trim() === "") {
      return NextResponse.json(
        { message: "Missing the title field" },
        { status: 400 }
      );
    }
    const [chatCreated] = await createChat(title);
    await createParticipant(creatorId, chatCreated.id, "admin");

    return NextResponse.json(
      { message: "Created successfully", chat: chatCreated },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { message: "Invalid request body. Provide 'participantId' or 'title'." },
    { status: 400 }
  );
}
