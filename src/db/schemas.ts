import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().unique().primaryKey().defaultRandom(),
  username: varchar({ length: 255 }),
  password_hash: varchar({ length: 255 }),
});
