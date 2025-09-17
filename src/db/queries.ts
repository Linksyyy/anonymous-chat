import { eq } from "drizzle-orm";
import { db } from "./db";
import { chats, participants, users } from "./schemas";
import { randomBytes } from "crypto";

export async function findUser(username: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
  return result[0];
}

export async function registerUser(username: string, password_hash: string) {
  const ee_salt = randomBytes(16).toString("hex");
  await db.insert(users).values({ username, password_hash, ee_salt });
}

export async function createParticipant(
  user_id: string,
  chat_id: string,
  role: "guest" | "admin" = "guest"
) {
  return await db
    .insert(participants)
    .values({ user_id, chat_id, role })
    .returning();
}

export async function createChat(title: string = "Place Holder") {
  return await db.insert(chats).values({ title }).returning();
}

export async function findParticipationsOfUser(userId: string) {
  const participations = await db.query.participants.findMany({
    where: eq(participants.user_id, userId),
    with: {
      chat: {
        with: {
          participants: {
            with: {
              user: {
                columns: {
                  password_hash: false,
                },
              },
            },
          },
        },
      },
    },
  });
  return participations;
}