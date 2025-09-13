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
    .notNull()
    .unique(),
  chat_id: uuid()
    .references(() => chats.id)
    .notNull()
    .unique(),
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
