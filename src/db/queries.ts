import { eq } from "drizzle-orm";
import { db } from "./db";
import { chats, notifications, participants, users } from "./schemas";
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

export async function createChat(title: string = "NO NAME") {
  return await db.insert(chats).values({ title }).returning();
}

export async function createInvite(
  sender_id: string,
  receiver_id: string,
  chat_id: string,
  type: "chat_invite"
) {
  return await db
    .insert(notifications)
    .values({ chat_id, sender_id, receiver_id, type })
    .returning();
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
                with: {
                  notificationsReceived: true,
                },
              },
            },
          },
        },
      },
    },
  });
  console.log(participants);
  return participations;
}

export async function findNotificationsOfuser(user_id: string) {
  return await db.query.notifications.findMany({
    where: eq(notifications.receiver_id, user_id),
    with: {
      chat: true,
      sender: {
        columns: {
          password_hash: false,
        },
      },
    },
  });
}
