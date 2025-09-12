import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().unique().primaryKey().defaultRandom(),
  username: varchar({ length: 255 }).unique().notNull(),
  password_hash: varchar({ length: 255 }).notNull(),
  ee_salt: varchar({ length: 255 }).unique().notNull(),
});
