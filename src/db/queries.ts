import { eq, sql } from "drizzle-orm";
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

export async function createParticipant(userId: string, chatId: string) {
  return await db
    .insert(participants)
    .values({ user_id: userId, chat_id: chatId })
    .returning();
}

export async function createChat(title: string = "Place Holder") {
  return await db.insert(chats).values({ title }).returning();
}

export async function findParticipationsOfUser(userId: string) {
  const participations = await db.query.participants.findMany({
    where: eq(participants.user_id, userId),
    with: {
      chat: true,
    },
  });
  return participations;
}

export async function findChatByParticipants(user1Id: string, user2Id: string) {
  const result = await db
    .select({ chatId: participants.chat_id })
    .from(participants)
    .where(
      sql`chat_id IN (SELECT p1.chat_id FROM ${participants} p1 JOIN ${participants} p2 ON p1.chat_id = p2.chat_id WHERE p1.user_id = ${user1Id} AND p2.user_id = ${user2Id})`
    )
    .groupBy(participants.chat_id)
    .having(sql`count(${participants.user_id}) = 2`);

  if (result.length === 0) {
    return [];
  }

  const chatDetails = await db.query.chats.findFirst({
    where: eq(chats.id, result[0].chatId),
  });

  return chatDetails ? [chatDetails] : [];
}
