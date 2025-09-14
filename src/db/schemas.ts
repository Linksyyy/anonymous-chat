import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  char,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().unique().primaryKey().defaultRandom(),
  username: varchar({ length: 255 }).unique().notNull(),
  password_hash: varchar({ length: 255 }).notNull(),
  ee_salt: char({ length: 32 }).unique().notNull(),
});

export const chats = pgTable("chats", {
  id: uuid().unique().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp(),
});

export const participants = pgTable("participants", {
  id: uuid().unique().primaryKey().defaultRandom(),
  user_id: uuid()
    .references(() => users.id)
    .notNull(),
  chat_id: uuid()
    .references(() => chats.id)
    .notNull(),
  joined_at: timestamp().defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: uuid().unique().primaryKey().defaultRandom(),
  sender_id: uuid()
    .references(() => users.id)
    .notNull(),
  chat_id: uuid()
    .references(() => chats.id)
    .notNull(),
  encrypted_message: text("encrypted_message").notNull(),
  created_at: timestamp().defaultNow().notNull(),
});
// User -> Participant
export const usersRelations = relations(users, ({ many }) => ({
  participants: many(participants),
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
