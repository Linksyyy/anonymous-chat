import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  char,
  timestamp,
  text,
  pgEnum,
} from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles", ["guest", "admin"]);
export const notificationsTypesEnum = pgEnum("notification_type", [
  "chat_invite",
]);

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  username: varchar({ length: 255 }).unique().notNull(),
  password_hash: varchar({ length: 255 }).notNull(),
  ee_salt: char({ length: 32 }).unique().notNull(),
  public_key: text("public_key").notNull(),
  encrypted_private_key: text("encrypted_private_key").notNull(),
});

export const chats = pgTable("chats", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 255 }),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp(),
});

export const participants = pgTable("participants", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .references(() => users.id)
    .notNull(),
  chat_id: uuid()
    .references(() => chats.id)
    .notNull(),
  joined_at: timestamp().defaultNow().notNull(),
  role: rolesEnum().default("guest"),
});

export const messages = pgTable("messages", {
  id: uuid().primaryKey().defaultRandom(),
  sender_id: uuid()
    .references(() => users.id)
    .notNull(),
  chat_id: uuid()
    .references(() => chats.id, {onDelete: "cascade"})
    .notNull(),
  encrypted_message: text("encrypted_message").notNull(),
  created_at: timestamp().defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid().primaryKey().defaultRandom(),
  sender_id: uuid().references(() => users.id),
  receiver_id: uuid().references(() => users.id),
  chat_id: uuid().references(() => chats.id),
  type: notificationsTypesEnum().notNull(),
  created_at: timestamp().defaultNow().notNull(),
  encrypted_group_key: text("encrypted_group_key"),
});
// User -> Participant & notifications
export const usersRelations = relations(users, ({ many }) => ({
  participants: many(participants),
  notificationsSent: many(notifications, { relationName: "sender" }), // user → notificações enviadas
  notificationsReceived: many(notifications, { relationName: "receiver" }), // user → notificações recebidas
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  sender: one(users, {
    fields: [notifications.sender_id],
    references: [users.id],
    relationName: "sender",
  }),
  receiver: one(users, {
    fields: [notifications.receiver_id],
    references: [users.id],
    relationName: "receiver",
  }),
  chat: one(chats, {
    fields: [notifications.chat_id],
    references: [chats.id],
  }),
}));

// Chat -> Participants & Messages
export const chatsRelations = relations(chats, ({ many }) => ({
  participants: many(participants),
  messages: many(messages),
}));

// Participant -> User & Chat
export const participantsRelations = relations(participants, ({ one }) => ({
  user: one(users, {
    fields: [participants.user_id],
    references: [users.id],
  }),
  chat: one(chats, {
    fields: [participants.chat_id],
    references: [chats.id],
  }),
}));

// Message -> User & Chat
export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.sender_id],
    references: [users.id],
  }),
  chat: one(chats, {
    fields: [messages.chat_id],
    references: [chats.id],
  }),
}));
