import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { chats, notifications, participants, users } from "./schemas";
import { v7 } from "uuid";
import { randomBytes } from "crypto";

export async function findUser(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0];
}

export async function findUserByUsername(username: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
  return result[0];
}

export async function registerUser(
  username: string,
  password_hash: string,
  ee_salt: string,
  pubKey: JsonWebKey,
  encryptedPrivKey: {
    iv: Uint8Array<ArrayBuffer>;
    encryptedData: ArrayBuffer;
  }
) {
  const id = v7();
  const public_key = JSON.stringify(pubKey);
  const encrypted_private_key = JSON.stringify(encryptedPrivKey);
  await db.insert(users).values({
    id,
    username,
    password_hash,
    ee_salt,
    public_key,
    encrypted_private_key,
  });
}

export async function createParticipant(
  user_id: string,
  chat_id: string,
  role: "guest" | "admin" = "guest"
) {
  const newParticipation = await db
    .insert(participants)
    .values({ user_id, chat_id, role })
    .returning();
  return newParticipation[0];
}

export async function createChat(title: string = "NO NAME") {
  return await db.insert(chats).values({ title }).returning();
}

export async function findChat(chatId: string) {
  return await db.query.chats.findFirst({
    where: eq(chats.id, chatId),
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
  });
}

export async function createInvite(
  sender_id: string,
  receiver_id: string,
  chat_id: string,
  type: "chat_invite"
) {
  const notification = await db
    .insert(notifications)
    .values({ chat_id, sender_id, receiver_id, type })
    .returning();

  return db.query.notifications.findFirst({
    where: eq(notifications.id, notification[0].id),
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
  return participations;
}

export async function findParticipationData(participantioId: string) {
  const participation = await db.query.participants.findFirst({
    where: eq(participants.id, participantioId),
    with: {
      user: {
        columns: {
          password_hash: false,
        },
      },
    },
  });
  return participation;
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

export async function deleteNotification(id: string) {
  await db.delete(notifications).where(eq(notifications.id, id));
}

export async function deleteChat(chatId: string) {
  await db.delete(chats).where(eq(chats.id, chatId));
}

export async function deleteParticipation(participationId: string) {
  await db.delete(participants).where(eq(participants.id, participationId));
}
